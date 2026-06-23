-- Schema for BrandPortal user authentication and access management
-- Matches your existing tables in PostgreSQL

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(role_id) ON DELETE RESTRICT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Materials table
CREATE TABLE IF NOT EXISTS materials (
    material_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    designer VARCHAR(100) NOT NULL,
    campaign VARCHAR(100),
    folder VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    ai_score INTEGER DEFAULT 80,
    ai_insights JSONB DEFAULT '[]'::jsonb,
    votes JSONB DEFAULT '{}'::jsonb,
    versions JSONB DEFAULT '[]'::jsonb,
    org_id VARCHAR(50) NOT NULL,
    file_path VARCHAR(255),
    ai_remarks TEXT,
    ai_suggestions TEXT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_role VARCHAR(50) NOT NULL,
    icon VARCHAR(10) DEFAULT '🔔',
    message TEXT NOT NULL,
    material_id INTEGER REFERENCES materials(material_id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
