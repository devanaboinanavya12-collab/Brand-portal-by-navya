// server.js
const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Setup PostgreSQL pool connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Database schema migration and initialization function
async function initDbSchema() {
  const client = await pool.connect();
  try {
    console.log('Validating database schema...');
    
    // 1. Alter password_hash to be NULLable (important for Google OAuth users)
    await client.query(`
      ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
    `);
    
    // 2. Add Google OAuth specific columns if they do not exist
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS google_sub VARCHAR(255) UNIQUE;
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS picture VARCHAR(1000);
    `);
    
    // 3. Ensure role names exist in the roles table (just in case)
    const rolesCheck = await client.query('SELECT COUNT(*) FROM roles');
    if (parseInt(rolesCheck.rows[0].count) === 0) {
      console.log('Inserting default roles...');
      await client.query(`
        INSERT INTO roles (role_id, role_name, description) VALUES
        (1, 'Admin', 'System Administrator'),
        (2, 'CEO', 'Chief Executive Officer'),
        (3, 'COO', 'Chief Operating Officer'),
        (4, 'Director', 'Director')
        ON CONFLICT (role_id) DO NOTHING;
      `);
    }

    // 4. Seed default users from mock data if users table is empty
    const usersCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(usersCheck.rows[0].count) === 0) {
      console.log('Seeding default users...');
      
      const defaultUsers = [
        { first_name: 'Alex', last_name: '', email: 'admin@example.com', role_name: 'Admin', password: 'admin123' },
        { first_name: 'Carol', last_name: '', email: 'ceo@example.com', role_name: 'CEO', password: 'ceopass' },
        { first_name: 'Omar', last_name: '', email: 'coo@example.com', role_name: 'COO', password: 'coopass' },
        { first_name: 'Diana', last_name: '', email: 'director@example.com', role_name: 'Director', password: 'director123' }
      ];

      for (const user of defaultUsers) {
        // Find role_id
        const roleRes = await client.query('SELECT role_id FROM roles WHERE role_name = $1', [user.role_name]);
        if (roleRes.rows.length > 0) {
          const roleId = roleRes.rows[0].role_id;
          const hashed = hashPassword(user.password);
          await client.query(`
            INSERT INTO users (first_name, last_name, email, password_hash, role_id, is_active)
            VALUES ($1, $2, $3, $4, $5, true)
          `, [user.first_name, user.last_name, user.email, hashed, roleId]);
        }
      }
      console.log('Seeding completed successfully.');
    }
  } catch (err) {
    console.error('Error validating or initializing database schema:', err);
  } finally {
    client.release();
  }
}

// Token decoding helper to parse mock JWTs from developer simulator
function parseMockToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload;
  } catch (e) {
    return null;
  }
}

// ═══════════════════════════════════════════
//  AUTHENTICATION MIDDLEWARE
// ═══════════════════════════════════════════
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// ═══════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════

// Get roles
app.get('/api/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT role_name FROM roles ORDER BY role_id');
    const roles = result.rows.map(row => row.role_name);
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Standard Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const query = `
      SELECT u.user_id, u.first_name, u.last_name, u.email, u.password_hash, u.picture, r.role_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.role_id 
      WHERE LOWER(u.email) = $1 AND u.is_active = true
    `;
    const result = await pool.query(query, [email.toLowerCase().trim()]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const hashedInput = hashPassword(password);
    
    // Compare password hash (if exists)
    if (!user.password_hash || user.password_hash !== hashedInput) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const displayName = (user.first_name + ' ' + (user.last_name || '')).trim();
    const token = jwt.sign(
      { sub: user.user_id, email: user.email, name: displayName, role: user.role_name },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.user_id.toString(), name: displayName, email: user.email, role: user.role_name, picture: user.picture }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server database error.' });
  }
});

// Google OAuth Login & Registration
app.post('/api/auth/google', async (req, res) => {
  const { credential, role } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' });
  }

  let payload;
  try {
    if (credential.endsWith('.mocksignature')) {
      // Decode simulated token
      payload = parseMockToken(credential);
      if (!payload) throw new Error('Invalid mock token');
    } else {
      // Verify real Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }
  } catch (err) {
    console.error('OAuth token verification failed:', err);
    return res.status(401).json({ error: 'Google credential verification failed.' });
  }

  const { email, name, picture, sub } = payload;

  try {
    // Check if user exists in database
    const selectQuery = `
      SELECT u.user_id, u.first_name, u.last_name, u.email, u.google_sub, u.picture, r.role_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.role_id 
      WHERE LOWER(u.email) = $1
    `;
    const result = await pool.query(selectQuery, [email.toLowerCase().trim()]);

    let user;

    if (result.rows.length === 0) {
      // User doesn't exist. If role is provided, create the account.
      if (!role) {
        // Request role selection on front-end
        return res.json({ isNew: true, tempUser: { name, email, picture } });
      }

      // Resolve role ID
      const roleRes = await pool.query('SELECT role_id FROM roles WHERE role_name = $1', [role]);
      if (roleRes.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid role selection.' });
      }
      const roleId = roleRes.rows[0].role_id;

      // Create new user
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || 'GoogleUser';
      const lastName = nameParts.slice(1).join(' ') || '';

      const insertQuery = `
        INSERT INTO users (first_name, last_name, email, role_id, google_sub, picture, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, true)
        RETURNING user_id, first_name, last_name, email, google_sub, picture
      `;
      const insertResult = await pool.query(insertQuery, [firstName, lastName, email, roleId, sub, picture]);
      
      user = {
        ...insertResult.rows[0],
        role_name: role
      };
      console.log(`Successfully registered new Google user: ${email} as ${role}`);
    } else {
      user = result.rows[0];
      // Update Google sub and profile picture if missing or updated
      if (user.google_sub !== sub || user.picture !== picture) {
        await pool.query(
          'UPDATE users SET google_sub = $1, picture = $2 WHERE user_id = $3',
          [sub, picture, user.user_id]
        );
        user.google_sub = sub;
        user.picture = picture;
      }
    }

    const displayName = (user.first_name + ' ' + (user.last_name || '')).trim();
    
    // Generate JWT
    const token = jwt.sign(
      { sub: user.user_id, email: user.email, name: displayName, role: user.role_name },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.user_id.toString(), name: displayName, email: user.email, role: user.role_name, picture: user.picture }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database operation failed during Google sign-in.' });
  }
});

// Get all users (returns same layout as mock API)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT u.user_id as id, (u.first_name || ' ' || COALESCE(u.last_name, '')) as name, u.email, r.role_name as role, u.picture
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      ORDER BY u.user_id ASC
    `;
    const result = await pool.query(query);
    
    // Format id as string to match mock DB
    const users = result.rows.map(row => ({
      ...row,
      id: row.id.toString()
    }));
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Admin register new user
app.post('/api/admin/users', authenticateToken, async (req, res) => {
  // Check authorization
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Unauthorized. Admin only.' });
  }

  const { name, email, role, password } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required.' });
  }

  try {
    // Check if user already exists
    const checkRes = await pool.query('SELECT user_id FROM users WHERE LOWER(email) = $1', [email.toLowerCase().trim()]);
    if (checkRes.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Resolve role ID
    const roleRes = await pool.query('SELECT role_id FROM roles WHERE role_name = $1', [role]);
    if (roleRes.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    const roleId = roleRes.rows[0].role_id;

    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    const hashed = hashPassword(password || 'password123');

    const insertQuery = `
      INSERT INTO users (first_name, last_name, email, password_hash, role_id, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING user_id as id, (first_name || ' ' || COALESCE(last_name, '')) as name, email
    `;
    const insertResult = await pool.query(insertQuery, [firstName, lastName, email.toLowerCase().trim(), hashed, roleId]);
    
    res.status(201).json({
      ...insertResult.rows[0],
      id: insertResult.rows[0].id.toString(),
      role: role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// Serve static frontend files
// We will serve the brand-portal html files
app.use(express.static(__dirname));

// Route to serve brand-portal_progress 1.html as index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'brand-portal_progress 1.html'));
});

// Connect to DB and Start Server
pool.connect()
  .then(async () => {
    console.log('Connected to PostgreSQL successfully.');
    // Check tables and run migrations
    await initDbSchema();
    
    app.listen(PORT, () => {
      console.log(`BrandPortal Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL:', err);
    process.exit(1);
  });
