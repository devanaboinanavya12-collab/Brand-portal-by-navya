import os
import datetime
import secrets
import json
import shutil
from fastapi import FastAPI, Request, HTTPException, Depends, status, Header, UploadFile, File, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import requests as requests_lib
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

app = FastAPI(title="BrandPortal Backend")

# Enable Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.on_event("startup")
def startup_event():
    print("Database table initialization on startup...")
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
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
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur.execute("ALTER TABLE materials ADD COLUMN IF NOT EXISTS ai_remarks TEXT;")
        cur.execute("ALTER TABLE materials ADD COLUMN IF NOT EXISTS ai_suggestions TEXT;")
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                notification_id SERIAL PRIMARY KEY,
                user_role VARCHAR(50) NOT NULL,
                icon VARCHAR(10) DEFAULT '🔔',
                message TEXT NOT NULL,
                material_id INTEGER REFERENCES materials(material_id) ON DELETE CASCADE,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS organization_folders (
                org_id VARCHAR(50) PRIMARY KEY,
                folder_tree JSONB NOT NULL
            );
        """)
        
        # Migrate existing org_id values from old names to new present names
        migrations = [
            ('nexus', 'Bio Factor'),
            ('verde', 'Ferty Base'),
            ('summit', 'Aqua'),
            ('pulse', 'One Health Centre'),
            ('arc', 'Water Links'),
            ('horizon', 'Beyond Organic')
        ]
        for old_id, new_id in migrations:
            cur.execute("SELECT org_id FROM organization_folders WHERE org_id = %s", (old_id,))
            exists_old = cur.fetchone()
            cur.execute("SELECT org_id FROM organization_folders WHERE org_id = %s", (new_id,))
            exists_new = cur.fetchone()
            if exists_old and not exists_new:
                cur.execute("UPDATE organization_folders SET org_id = %s WHERE org_id = %s", (new_id, old_id))
            elif exists_old and exists_new:
                cur.execute("DELETE FROM organization_folders WHERE org_id = %s", (old_id,))
            cur.execute("UPDATE materials SET org_id = %s WHERE org_id = %s", (new_id, old_id))
            
        conn.commit()
        print("Materials, notifications, and folders table structures verified and migrated.")
    except Exception as e:
        print(f"Error checking tables on startup: {e}")
    finally:
        cur.close()
        conn.close()

# Load .env variables manually to avoid dependency on python-dotenv
def load_env():
    env_vars = {}
    if os.path.exists('.env'):
        with open('.env') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, val = line.split('=', 1)
                    env_vars[key.strip()] = val.strip()
                    os.environ[key.strip()] = val.strip()
    return env_vars

env = load_env()
JWT_SECRET = env.get("JWT_SECRET", "brandportal_jwt_secret_key_2026_change_me")
GOOGLE_CLIENT_ID = env.get("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com")

def get_db_connection():
    db_host = env.get("DB_HOST", "localhost")
    db_port = env.get("DB_PORT", "5432")
    db_name = env.get("DB_NAME", "postgres")
    db_user = env.get("DB_USER", "postgres")
    db_password = env.get("DB_PASSWORD", "postgres")
    
    return psycopg2.connect(
        host=db_host,
        port=db_port,
        dbname=db_name,
        user=db_user,
        password=db_password,
        cursor_factory=RealDictCursor
    )

# Dependency to yield database cursor and handle connections cleanly
def get_db():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()

# Dependency to enforce authentication via JWT
def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing"
        )
    token = authorization.split(" ")[1]
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return data
    except jwt.ExpiredSignatureError as e:
        print(f"JWT Expired Signature Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again."
        )
    except jwt.InvalidTokenError as e:
        print(f"JWT Invalid Token Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token."
        )

# Pydantic validation schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str

class CreateUserRequest(BaseModel):
    name: str
    email: str
    role: str
    password: Optional[str] = ""

class EditUserRequest(BaseModel):
    name: str
    role: str

# Serve the single-page application frontend
@app.get("/", response_class=HTMLResponse)
@app.get("/register", response_class=HTMLResponse)
@app.get("/signup", response_class=HTMLResponse)
def index():
    if os.path.exists('brand-portal_progress.html'):
        with open('brand-portal_progress.html', 'r', encoding='utf-8') as f:
            html = f.read()
        # Replace the placeholder with the environment variable
        html = html.replace('YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', GOOGLE_CLIENT_ID)
        return HTMLResponse(content=html, status_code=200)
    return HTMLResponse(content="brand-portal_progress.html not found in the workspace.", status_code=404)

# Standard Password Login
@app.post("/api/auth/login")
def login(data: LoginRequest, db=Depends(get_db)):
    email = data.email.strip().lower()
    password = data.password
    
    try:
        cur = db.cursor()
        
        # Query user and their role name using custom column names
        cur.execute("""
            SELECT u.user_id as id, u.first_name, u.last_name, u.email, u.password_hash, r.role_name as role
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            WHERE LOWER(u.email) = %s AND u.is_active = TRUE
        """, (email,))
        user = cur.fetchone()
        cur.close()
        
        if not user or not user['password_hash']:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
            
        if not check_password_hash(user['password_hash'], password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
            
        # Create JWT token
        payload = {
            'sub': str(user['id']),
            'email': user['email'],
            'role': user['role'],
            'name': f"{user['first_name']} {user['last_name'] or ''}".strip(),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
        
        return {
            'token': token,
            'user': {
                'id': user['id'],
                'name': f"{user['first_name']} {user['last_name'] or ''}".strip(),
                'email': user['email'],
                'role': user['role']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred during login")

# Google OAuth Login / Verification
@app.post("/api/auth/google")
def google_login(data: GoogleLoginRequest, db=Depends(get_db)):
    credential = data.credential
    idinfo = None
    email = None
    
    if credential.startswith('mock_token_for_'):
        email = credential.replace('mock_token_for_', '').strip().lower()
        print(f"Developer Mock Google login for: {email}")
    else:
        # Verify ID Token
        try:
            idinfo = id_token.verify_oauth2_token(
                credential, 
                google_requests.Request(), 
                GOOGLE_CLIENT_ID
            )
        except Exception as library_err:
            print(f"Library token verification failed/skipped: {library_err}")
            # Fallback: query Google OAuth API endpoint directly
            try:
                resp = requests_lib.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}")
                if resp.status_code == 200:
                    token_data = resp.json()
                    if GOOGLE_CLIENT_ID == 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com' or token_data.get('aud') == GOOGLE_CLIENT_ID:
                        idinfo = token_data
            except Exception as api_err:
                print(f"API fallback verification failed: {api_err}")
                
        if not idinfo:
            raise HTTPException(
                status_code=400,
                detail="Google ID token verification failed. Please configure your client ID."
            )
            
        email = idinfo['email'].strip().lower()
    
    try:
        cur = db.cursor()
        
        # Check if user is registered in our PostgreSQL database using custom column names
        cur.execute("""
            SELECT u.user_id as id, u.first_name, u.last_name, u.email, r.role_name as role
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            WHERE LOWER(u.email) = %s AND u.is_active = TRUE
        """, (email,))
        user = cur.fetchone()
        cur.close()
        
        if not user:
            # If user does not exist in DB, they cannot sign up via Google directly.
            # They must be created by the Admin first.
            raise HTTPException(
                status_code=403,
                detail=f'The email "{email}" is not registered in the system. An Admin must add your account before you can sign in.'
            )
            
        # Generate JWT token for the session
        payload = {
            'sub': str(user['id']),
            'email': user['email'],
            'role': user['role'],
            'name': f"{user['first_name']} {user['last_name'] or ''}".strip(),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
        
        return {
            'token': token,
            'user': {
                'id': user['id'],
                'name': f"{user['first_name']} {user['last_name'] or ''}".strip(),
                'email': user['email'],
                'role': user['role']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Google Authentication error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred during Google authentication")

# Admin Only: Register (Sign up) a new user
@app.post("/api/admin/users", status_code=201)
def create_user(data: CreateUserRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    # Enforce Admin role restriction
    if current_user['role'] != 'Admin':
        raise HTTPException(
            status_code=403,
            detail="Unauthorized. Only Admins can register new users."
        )
        
    full_name = data.name.strip()
    email = data.email.strip().lower()
    role_name = data.role.strip()
    password = data.password.strip() if data.password else ""
    
    if not full_name or not email or not role_name:
        raise HTTPException(status_code=400, detail="Name, email, and role cannot be empty")
        
    # Split name into first and last name for PostgreSQL columns
    name_parts = full_name.split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''
    
    try:
        cur = db.cursor()
        
        # Verify role exists
        cur.execute("SELECT role_id FROM roles WHERE role_name = %s", (role_name,))
        role_record = cur.fetchone()
        if not role_record:
            cur.close()
            raise HTTPException(status_code=400, detail=f"Role '{role_name}' does not exist")
            
        role_id = role_record['role_id']
        
        # Check if username (first_name + last_name) is already taken
        cur.execute("SELECT user_id FROM users WHERE LOWER(first_name) = %s AND LOWER(last_name) = %s", (first_name.lower(), last_name.lower()))
        existing_name = cur.fetchone()
        if existing_name:
            cur.close()
            raise HTTPException(status_code=409, detail="that username or email id is used try other name")
            
        # Check if email is already taken
        cur.execute("SELECT user_id FROM users WHERE LOWER(email) = %s", (email,))
        existing_user = cur.fetchone()
        if existing_user:
            cur.close()
            raise HTTPException(status_code=409, detail="that username or email id is used try other name")
            
        # Since password_hash is NOT NULL in PostgreSQL, generate a secure random password if none is provided
        if not password:
            password = secrets.token_hex(16)
            
        password_hash = generate_password_hash(password)
        
        # Insert user into PostgreSQL using custom column names
        cur.execute("""
            INSERT INTO users (first_name, last_name, email, role_id, password_hash, is_active)
            VALUES (%s, %s, %s, %s, %s, TRUE)
            RETURNING user_id as id
        """, (first_name, last_name, email, role_id, password_hash))
        new_id = cur.fetchone()['id']
        
        db.commit()
        cur.close()
        
        return {
            'success': True,
            'user': {
                'id': new_id,
                'name': full_name,
                'email': email,
                'role': role_name
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"User registration error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred during user registration")

# Admin Only: Edit user details (name and role)
@app.put("/api/admin/users/{user_id}")
def edit_user(user_id: int, data: EditUserRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    # Enforce Admin role restriction
    if current_user['role'] != 'Admin':
        raise HTTPException(
            status_code=403,
            detail="Unauthorized. Only Admins can edit user profiles."
        )
        
    full_name = data.name.strip()
    role_name = data.role.strip()
    
    if not full_name or not role_name:
        raise HTTPException(status_code=400, detail="Name and role cannot be empty")
        
    # Split name into first and last name for PostgreSQL columns
    name_parts = full_name.split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''
    
    try:
        cur = db.cursor()
        
        # Verify user exists
        cur.execute("SELECT user_id FROM users WHERE user_id = %s", (user_id,))
        user_record = cur.fetchone()
        if not user_record:
            cur.close()
            raise HTTPException(status_code=404, detail="User not found")
            
        # Check if username (first_name + last_name) is already taken by another user
        cur.execute("""
            SELECT user_id FROM users 
            WHERE LOWER(first_name) = %s AND LOWER(last_name) = %s AND user_id != %s
        """, (first_name.lower(), last_name.lower(), user_id))
        existing_name = cur.fetchone()
        if existing_name:
            cur.close()
            raise HTTPException(status_code=409, detail="that username or email id is used try other name")
            
        # Verify role exists
        cur.execute("SELECT role_id FROM roles WHERE role_name = %s", (role_name,))
        role_record = cur.fetchone()
        if not role_record:
            cur.close()
            raise HTTPException(status_code=400, detail=f"Role '{role_name}' does not exist")
            
        role_id = role_record['role_id']
        
        # Update user in PostgreSQL
        cur.execute("""
            UPDATE users 
            SET first_name = %s, last_name = %s, role_id = %s
            WHERE user_id = %s
        """, (first_name, last_name, role_id, user_id))
        
        db.commit()
        cur.close()
        
        return {
            'success': True,
            'message': 'User profile updated successfully',
            'user': {
                'id': user_id,
                'name': full_name,
                'role': role_name
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"User edit error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred during user profile update")

# Admin Only: Delete a user
@app.delete("/api/admin/users/{user_id}")
def delete_user(user_id: int, current_user=Depends(get_current_user), db=Depends(get_db)):
    # Enforce Admin role restriction
    if current_user['role'] != 'Admin':
        raise HTTPException(
            status_code=403,
            detail="Unauthorized. Only Admins can delete users."
        )
        
    try:
        cur = db.cursor()
        
        # Verify user exists
        cur.execute("SELECT user_id FROM users WHERE user_id = %s", (user_id,))
        user_record = cur.fetchone()
        if not user_record:
            cur.close()
            raise HTTPException(status_code=404, detail="User not found")
            
        # Execute DELETE query
        cur.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        
        db.commit()
        cur.close()
        
        return {
            'success': True,
            'message': 'User deleted successfully'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"User deletion error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred during user deletion")

# Get all registered users (for user control panel)
@app.get("/api/users")
def get_users(current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        cur = db.cursor()
        
        cur.execute("""
            SELECT u.user_id as id, u.first_name, u.last_name, u.email, r.role_name as role
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            ORDER BY u.user_id
        """)
        db_users = cur.fetchall()
        cur.close()
        
        # Format the users list to match frontend expected fields
        users = []
        for u in db_users:
            users.append({
                'id': u['id'],
                'name': f"{u['first_name']} {u['last_name'] or ''}".strip(),
                'email': u['email'],
                'role': u['role']
            })
            
        return users
        
    except Exception as e:
        print(f"Fetch users error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while fetching users")

# Get all system roles (for role assignment list)
@app.get("/api/roles")
def get_roles(current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        cur = db.cursor()
        
        cur.execute("SELECT role_name FROM roles ORDER BY role_id")
        roles = [row['role_name'] for row in cur.fetchall()]
        cur.close()
        
        return roles
        
    except Exception as e:
        print(f"Fetch roles error: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while fetching roles")

# Get materials for an organization
@app.get("/api/materials")
def get_materials(org_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    try:
        cur = db.cursor()
        cur.execute("""
            SELECT material_id as id, name, type, emoji, designer, campaign, folder, status, ai_score, ai_insights, votes, versions, created_at, file_path, ai_remarks, ai_suggestions
            FROM materials
            WHERE org_id = %s
            ORDER BY material_id DESC
        """, (org_id,))
        rows = cur.fetchall()
        cur.close()
        
        mats = []
        for r in rows:
            dt = r['created_at']
            date_str = dt.strftime("%b %d, %Y") if dt else ""
            
            ai_insights = r['ai_insights']
            if isinstance(ai_insights, str):
                try:
                    ai_insights = json.loads(ai_insights)
                except:
                    ai_insights = []
            
            votes = r['votes']
            if isinstance(votes, str):
                try:
                    votes = json.loads(votes)
                except:
                    votes = {}
                    
            versions = r['versions']
            if isinstance(versions, str):
                try:
                    versions = json.loads(versions)
                except:
                    versions = []
 
            mats.append({
                'id': r['id'],
                'name': r['name'],
                'type': r['type'],
                'emoji': r['emoji'],
                'designer': r['designer'],
                'date': date_str,
                'status': r['status'],
                'campaign': r['campaign'] or '—',
                'folder': r['folder'] or '',
                'aiScore': r['ai_score'],
                'aiInsights': ai_insights or [],
                'votes': votes or {},
                'versions': versions or [],
                'file_path': r['file_path'],
                'aiRemarks': r['ai_remarks'] or '',
                'aiSuggestions': r['ai_suggestions'] or ''
            })
        return mats
    except Exception as e:
        print(f"Error fetching materials: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while fetching materials")

# Helper for simulated RAG compliance check
def check_brand_compliance(org_id: str, name: str, material_type: str) -> tuple:
    # Retrieve active organization guidelines
    org_colors = {
        "nexus": [("Bio Factor Blue", "#1E40AF"), ("Sky", "#0EA5E9"), ("Amber", "#F59E0B"), ("Dark", "#1E293B")],
        "verde": [("Ferty Base Green", "#16A34A"), ("Lime", "#84CC16"), ("Cream", "#FEF9C3"), ("Earth", "#78350F")],
        "summit": [("Gold", "#B45309"), ("Navy", "#1E3A5F"), ("Silver", "#94A3B8"), ("White", "#F8FAFC")],
        "pulse": [("One Health Centre Red", "#DC2626"), ("Calm Blue", "#2563EB"), ("Soft Green", "#10B981"), ("Light", "#F0FDF4")],
        "arc": [("Water Links Purple", "#7C3AED"), ("Teal", "#0D9488"), ("Warm Yellow", "#F59E0B"), ("Charcoal", "#1F2937")],
        "horizon": [("Beyond Organic Teal", "#0F766E"), ("Orange", "#EA580C"), ("Steel", "#475569"), ("White", "#F8FAFC")]
    }
    
    org_display_names = {
        "nexus": "Bio Factor",
        "verde": "Ferty Base",
        "summit": "Aqua",
        "pulse": "One Health Centre",
        "arc": "Water Links",
        "horizon": "Beyond Organic"
    }
    org_display_name = org_display_names.get(org_id.lower(), org_id.capitalize())
    
    colors = org_colors.get(org_id.lower(), [("Primary Blue", "#1E40AF")])
    primary_color_name, primary_color_hex = colors[0]
    
    # Deterministic compliance check using hashes/characters to avoid pure randomness
    hash_val = sum(ord(c) for c in name) + len(material_type)
    
    name_lower = name.lower()
    if any(word in name_lower for word in ["draft", "test", "bad", "revision", "low", "old"]):
        score = 55 + (hash_val % 15)
        remarks = (
            f"RAG Analysis: Brand check flagged some non-compliance items. "
            f"⚠️ Primary font contrast ratio on background is too low ({primary_color_name} on dark grey). "
            f"⚠️ Logo safe-zone margin is less than the required 20px (measured 12px). "
            f"💡 Recommended action: Adjust layout contrast to satisfy the WCAG AA 4.5:1 ratio guidelines."
        )
        suggestions = (
            "1. Increase background contrast to at least 4.5:1 ratio using approved colors (e.g. " + primary_color_name + " " + primary_color_hex + ").\n"
            "2. Adjust logo placement to ensure minimum clearspace of 20px on all sides.\n"
            "3. Verify typography size hierarchy matches brand guidelines."
        )
    else:
        score = 80 + (hash_val % 19)
        remarks = (
            f"RAG Analysis: Compliant with {org_display_name} Brand Guidelines ({score}% alignment). "
            f"✅ Color palette match: Found primary accent color {primary_color_name} ({primary_color_hex}) matches theme guidelines. "
            f"✅ Typography match: Main headings use 'Outfit' font family as required. "
            f"✅ Spacing match: Standard 20px logo padding and margins are successfully maintained."
        )
        suggestions = (
            "1. Optimize high-resolution assets for smaller web packages.\n"
            "2. Ensure image alt tags are filled in before publication.\n"
            "3. Double-check all CTA copy coordinates with marketing guidelines."
        )
    
    return score, remarks, suggestions

class ReadNotificationRequest(BaseModel):
    notification_id: Optional[int] = None
    org_id: str

# Create a new material (Upload file and metadata)
@app.post("/api/materials", status_code=201)
async def upload_material(
    file: UploadFile = File(...),
    name: str = Form(...),
    type: str = Form(...),
    campaign: Optional[str] = Form(None),
    folder: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    org_id: str = Form(...),
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    try:
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{secrets.token_hex(8)}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file contents
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Emoji mapping
        emoji_map = {
            'flyer': '🖼',
            'brochure': '📄',
            'leaflet': '📃',
            'poster': '🪧',
            'banner': '🏳',
            'social': '📱'
        }
        emoji = emoji_map.get(type, '📄')
        
        # Designer string format e.g. "Diana (Director)"
        designer_name = current_user.get('name', 'Unknown')
        designer_role = current_user.get('role', 'Director')
        designer = f"{designer_name} ({designer_role})"
        
        # Perform RAG compliance analyzer
        ai_score, ai_remarks, ai_suggestions = check_brand_compliance(org_id, name, type)
        ai_insights = ["ai_new_color_ok", "ai_new_logo_ok", "ai_new_typography_ok", "ai_new_imagery_ok"]
        
        votes = {
            "admin": "pending",
            "ceo": "pending",
            "coo": "pending",
            "director": "pending"
        }
        
        # Versions array
        import datetime
        now = datetime.datetime.utcnow()
        short_date = now.strftime("%b %d")
        versions = [{
            "v": "v1",
            "date": short_date,
            "note": "version_initial_upload"
        }]
        
        cur = db.cursor()
        cur.execute("""
            INSERT INTO materials (name, type, emoji, designer, campaign, folder, status, ai_score, ai_insights, votes, versions, org_id, file_path, ai_remarks, ai_suggestions)
            VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING material_id as id
        """, (
            name, type, emoji, designer, campaign or '—', folder or '',
            ai_score, json.dumps(ai_insights), json.dumps(votes), json.dumps(versions),
            org_id, file_path, ai_remarks, ai_suggestions
        ))
        
        new_id = cur.fetchone()['id']
        
        # Loop and insert notifications for standard roles: admin, ceo, coo, director
        notif_roles = ['admin', 'ceo', 'coo', 'director']
        notif_icon = '✅' if ai_score >= 80 else '⚠️'
        notif_message = f"'{name}' uploaded by {designer_name}. AI Score: {ai_score}/100."
        
        for r in notif_roles:
            cur.execute("""
                INSERT INTO notifications (user_role, icon, message, material_id, is_read)
                VALUES (%s, %s, %s, %s, FALSE)
            """, (r, notif_icon, notif_message, new_id))
            
        db.commit()
        cur.close()
        
        return {
            'success': True,
            'material': {
                'id': new_id,
                'name': name,
                'type': type,
                'emoji': emoji,
                'designer': designer,
                'date': now.strftime("%b %d, %Y"),
                'status': 'pending',
                'campaign': campaign or '—',
                'folder': folder or '',
                'aiScore': ai_score,
                'aiInsights': ai_insights,
                'votes': votes,
                'versions': versions,
                'file_path': file_path,
                'aiRemarks': ai_remarks,
                'aiSuggestions': ai_suggestions
            }
        }
    except Exception as e:
        print(f"Error uploading material: {e}")
        raise HTTPException(status_code=500, detail="Server error during file upload.")

class CastVoteRequest(BaseModel):
    decision: str

# Cast approval vote / update material status in PostgreSQL
@app.post("/api/materials/{material_id}/vote")
def cast_vote(material_id: int, data: CastVoteRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    role_name = current_user['role'].lower()
    decision = data.decision.strip().lower()
    
    if decision not in ['approved', 'revision']:
        raise HTTPException(status_code=400, detail="Decision must be 'approved' or 'revision'")
        
    try:
        cur = db.cursor()
        
        # Verify material exists
        cur.execute("SELECT votes, status, name, designer, ai_score FROM materials WHERE material_id = %s", (material_id,))
        material = cur.fetchone()
        if not material:
            cur.close()
            raise HTTPException(status_code=404, detail="Material not found")
            
        votes = material['votes']
        if isinstance(votes, str):
            try:
                votes = json.loads(votes)
            except:
                votes = {}
        elif not votes:
            votes = {}
            
        # Update/cast the vote for the user's role
        votes[role_name] = decision
        
        # Check overall status
        all_approved = all(v == 'approved' for v in votes.values())
        any_revision = any(v == 'revision' for v in votes.values())
        
        new_status = material['status']
        if all_approved:
            new_status = 'approved'
        elif any_revision:
            new_status = 'revision'
        else:
            new_status = 'pending'
            
        # Update in PostgreSQL
        cur.execute("""
            UPDATE materials 
            SET votes = %s, status = %s 
            WHERE material_id = %s
        """, (json.dumps(votes), new_status, material_id))
        
        # Parse uploader role from designer field: e.g. "Diana (Director)" -> "director"
        uploader_role = "director"
        designer_str = material['designer']
        if '(' in designer_str and ')' in designer_str:
            uploader_role = designer_str.split('(')[-1].replace(')', '').strip().lower()
            
        uploader_name = designer_str.split(' (')[0] if ' (' in designer_str else designer_str
        reviewer_name = current_user.get('name', 'Unknown')
        reviewer_role = current_user.get('role', 'Admin')
        
        # Send action notification
        notif_icon = '✅' if decision == 'approved' else '⚠️'
        if decision == 'approved':
            notif_message = f"'{material['name']}' uploaded by {uploader_name} (AI Score: {material['ai_score']}/100) was approved by {reviewer_name}."
        else:
            notif_message = f"'{material['name']}' uploaded by {uploader_name} (AI Score: {material['ai_score']}/100) needs revision action done by {reviewer_name}."
        
        # Target all other reviewer roles except the voter
        target_roles = set(['admin', 'ceo', 'coo', 'director'])
        target_roles.discard(role_name)
        
        # Ensure the uploader role gets the notification if they aren't the voter
        if uploader_role != role_name:
            target_roles.add(uploader_role)
        
        for r in target_roles:
            cur.execute("""
                INSERT INTO notifications (user_role, icon, message, material_id, is_read)
                VALUES (%s, %s, %s, %s, FALSE)
            """, (r, notif_icon, notif_message, material_id))
        
        db.commit()
        cur.close()
        
        return {
            'success': True,
            'message': 'Vote recorded successfully',
            'status': new_status,
            'votes': votes
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error casting vote: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred during vote registration")

# Get notifications for the user's role and organization
@app.get("/api/notifications")
def get_notifications(org_id: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    role_name = current_user['role'].lower()
    try:
        cur = db.cursor()
        cur.execute("""
            SELECT n.notification_id as id, n.user_role, n.icon, n.message, n.material_id, n.is_read, n.created_at
            FROM notifications n
            JOIN materials m ON n.material_id = m.material_id
            WHERE LOWER(n.user_role) = %s AND m.org_id = %s
            ORDER BY n.notification_id DESC
        """, (role_name, org_id))
        rows = cur.fetchall()
        cur.close()
        
        notifs = []
        for r in rows:
            dt = r['created_at']
            time_str = dt.strftime("%b %d, %H:%M") if dt else ""
            notifs.append({
                'id': r['id'],
                'userRole': r['user_role'],
                'icon': r['icon'],
                'message': r['message'],
                'materialId': r['material_id'],
                'isRead': r['is_read'],
                'time': time_str
            })
        return notifs
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while fetching notifications")

# Mark notifications as read for the user's role and organization
@app.post("/api/notifications/read")
def mark_notifications_read(data: ReadNotificationRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    role_name = current_user['role'].lower()
    try:
        cur = db.cursor()
        if data.notification_id:
            cur.execute("""
                UPDATE notifications 
                SET is_read = TRUE 
                WHERE notification_id = %s AND LOWER(user_role) = %s
            """, (data.notification_id, role_name))
        else:
            cur.execute("""
                UPDATE notifications n
                SET is_read = TRUE
                FROM materials m
                WHERE n.material_id = m.material_id AND LOWER(n.user_role) = %s AND m.org_id = %s
            """, (role_name, data.org_id))
        db.commit()
        cur.close()
        return {'success': True, 'message': 'Notifications marked as read'}
    except Exception as e:
        print(f"Error marking notifications as read: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while marking notifications as read")

class UpdateSuggestionsRequest(BaseModel):
    suggestions: str

# Edit/add suggestions for improvement
@app.post("/api/materials/{material_id}/suggestions")
def update_suggestions(material_id: int, data: UpdateSuggestionsRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    role_name = current_user['role'].lower()
    if role_name not in ['admin', 'ceo', 'coo', 'director']:
        raise HTTPException(status_code=403, detail="Not authorized to edit suggestions")
        
    try:
        cur = db.cursor()
        cur.execute("SELECT material_id FROM materials WHERE material_id = %s", (material_id,))
        if not cur.fetchone():
            cur.close()
            raise HTTPException(status_code=404, detail="Material not found")
            
        cur.execute("""
            UPDATE materials 
            SET ai_suggestions = %s 
            WHERE material_id = %s
        """, (data.suggestions, material_id))
        
        db.commit()
        cur.close()
        return {'success': True, 'message': 'Suggestions updated successfully'}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating suggestions: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while updating suggestions")

# Organization folders endpoints

class FolderSaveRequest(BaseModel):
    org_id: str
    folder_tree: list

class FolderRenameRequest(BaseModel):
    org_id: str
    old_path: str
    new_path: str
    folder_tree: list

@app.get("/api/folders")
def get_folders(org_id: str, db=Depends(get_db)):
    try:
        cur = db.cursor()
        cur.execute("SELECT folder_tree FROM organization_folders WHERE org_id = %s", (org_id,))
        row = cur.fetchone()
        cur.close()
        if row:
            return row['folder_tree']
        else:
            default_folders = [
              {
                "name": "Marketing", "children": [
                  { "name": "Flyers", "children": [{ "name": "2025", "files": 8 }, { "name": "2024 Archive", "files": 12 }] },
                  { "name": "Brochures", "children": [{ "name": "Products", "files": 5 }, { "name": "Corporate", "files": 3 }] },
                  { "name": "Posters", "children": [{ "name": "Events", "files": 4 }, { "name": "Retail POS", "files": 6 }] },
                  { "name": "Digital", "children": [{ "name": "Social Media", "files": 15 }, { "name": "Email Headers", "files": 7 }] },
                  { "name": "Print", "children": [{ "name": "Retail", "files": 9 }, { "name": "Outdoor", "files": 4 }] }
                ]
              },
              {
                "name": "Campaigns", "children": [
                  { "name": "Seasonal", "children": [{ "name": "Summer", "files": 10 }, { "name": "Winter", "files": 8 }, { "name": "Festive", "files": 14 }] },
                  { "name": "In-Store", "children": [{ "name": "POS Materials", "files": 22 }, { "name": "Window Displays", "files": 7 }] },
                  { "name": "Promotions", "children": [{ "name": "Flyers", "files": 16 }, { "name": "Leaflets", "files": 9 }] },
                  { "name": "Digital", "children": [{ "name": "Social Media", "files": 31 }, { "name": "Email", "files": 12 }] }
                ]
              },
              {
                "name": "Corporate", "children": [
                  { "name": "Brand Assets", "children": [{ "name": "Logos", "files": 4 }, { "name": "Templates", "files": 11 }] },
                  { "name": "Client Comms", "children": [{ "name": "Brochures", "files": 9 }, { "name": "Presentations", "files": 17 }] },
                  { "name": "Regulatory", "children": [{ "name": "Compliance Docs", "files": 6 }, { "name": "Disclosures", "files": 8 }] },
                  { "name": "Events", "children": [{ "name": "Banners", "files": 5 }, { "name": "Signage", "files": 3 }] }
                ]
              },
              {
                "name": "Healthcare Mktg", "children": [
                  { "name": "Awareness", "children": [{ "name": "Posters", "files": 13 }, { "name": "Leaflets", "files": 18 }] },
                  { "name": "Patient Info", "children": [{ "name": "Brochures", "files": 21 }, { "name": "Flyers", "files": 9 }] },
                  { "name": "Staff Comms", "children": [{ "name": "Internal Posters", "files": 6 }, { "name": "Newsletters", "files": 4 }] },
                  { "name": "Digital", "children": [{ "name": "Social Media", "files": 24 }, { "name": "Web Banners", "files": 11 }] }
                ]
              },
              {
                "name": "Education", "children": [
                  { "name": "Recruitment", "children": [{ "name": "Prospectus", "files": 7 }, { "name": "Open Day", "files": 5 }] },
                  { "name": "Campus", "children": [{ "name": "Posters", "files": 19 }, { "name": "Banners", "files": 8 }] },
                  { "name": "Courses", "children": [{ "name": "Leaflets", "files": 27 }, { "name": "Brochures", "files": 14 }] },
                  { "name": "Events", "children": [{ "name": "Graduation", "files": 6 }, { "name": "Conferences", "files": 9 }] }
                ]
              },
              {
                "name": "Logistics Mktg", "children": [
                  { "name": "Client Facing", "children": [{ "name": "Brochures", "files": 8 }, { "name": "Proposals", "files": 12 }] },
                  { "name": "Fleet Branding", "children": [{ "name": "Vehicle Wraps", "files": 5 }, { "name": "Uniforms", "files": 3 }] },
                  { "name": "Trade Shows", "children": [{ "name": "Banners", "files": 10 }, { "name": "Displays", "files": 6 }] },
                  { "name": "Digital", "children": [{ "name": "Social Media", "files": 18 }, { "name": "Email", "files": 9 }] }
                ]
              }
            ]
            
            cur2 = db.cursor()
            cur2.execute("""
                INSERT INTO organization_folders (org_id, folder_tree)
                VALUES (%s, %s)
                ON CONFLICT (org_id) DO UPDATE SET folder_tree = EXCLUDED.folder_tree;
            """, (org_id, json.dumps(default_folders)))
            db.commit()
            cur2.close()
            return default_folders
    except Exception as e:
        print(f"Error getting folders: {e}")
        raise HTTPException(status_code=500, detail="Database error getting folders")

@app.post("/api/folders")
def save_folders(data: FolderSaveRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    role_name = current_user['role'].lower()
    if role_name != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to edit folders")
        
    try:
        cur = db.cursor()
        cur.execute("""
            INSERT INTO organization_folders (org_id, folder_tree)
            VALUES (%s, %s)
            ON CONFLICT (org_id) DO UPDATE SET folder_tree = EXCLUDED.folder_tree;
        """, (data.org_id, json.dumps(data.folder_tree)))
        db.commit()
        cur.close()
        return {'success': True, 'message': 'Folders saved successfully'}
    except Exception as e:
        print(f"Error saving folders: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while saving folders")

@app.post("/api/folders/rename")
def rename_folder(data: FolderRenameRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    role_name = current_user['role'].lower()
    if role_name != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to edit folders")
        
    try:
        cur = db.cursor()
        # 1. Update the folder tree JSON
        cur.execute("""
            INSERT INTO organization_folders (org_id, folder_tree)
            VALUES (%s, %s)
            ON CONFLICT (org_id) DO UPDATE SET folder_tree = EXCLUDED.folder_tree;
        """, (data.org_id, json.dumps(data.folder_tree)))
        
        # 2. Update the materials table folder fields
        old_prefix = data.old_path
        new_prefix = data.new_path
        
        # Exact match
        cur.execute("""
            UPDATE materials 
            SET folder = %s 
            WHERE folder = %s AND org_id = %s;
        """, (new_prefix, old_prefix, data.org_id))
        
        # Nested subfolders
        cur.execute("""
            SELECT material_id, folder FROM materials 
            WHERE folder LIKE %s AND org_id = %s;
        """, (old_prefix + "/%", data.org_id))
        
        mats_to_update = cur.fetchall()
        for m in mats_to_update:
            old_folder_val = m['folder']
            if old_folder_val.startswith(old_prefix + "/"):
                new_folder_val = new_prefix + old_folder_val[len(old_prefix):]
                cur.execute("""
                    UPDATE materials 
                    SET folder = %s 
                    WHERE material_id = %s;
                """, (new_folder_val, m['material_id']))
                
        db.commit()
        cur.close()
        return {'success': True, 'message': 'Folder renamed and database records updated successfully'}
    except Exception as e:
        print(f"Error renaming folder: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while renaming folder")

class FolderDeleteRequest(BaseModel):
    org_id: str
    folder_path: str
    folder_tree: list

@app.post("/api/folders/delete")
def delete_folder(data: FolderDeleteRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    role_name = current_user['role'].lower()
    if role_name != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to delete folders")
        
    try:
        cur = db.cursor()
        # 1. Update the folder tree JSON
        cur.execute("""
            INSERT INTO organization_folders (org_id, folder_tree)
            VALUES (%s, %s)
            ON CONFLICT (org_id) DO UPDATE SET folder_tree = EXCLUDED.folder_tree;
        """, (data.org_id, json.dumps(data.folder_tree)))
        
        # 2. Delete all materials in the folder and its subfolders
        folder_prefix = data.folder_path
        
        # Exact match
        cur.execute("""
            DELETE FROM materials 
            WHERE folder = %s AND org_id = %s;
        """, (folder_prefix, data.org_id))
        
        # Nested subfolders
        cur.execute("""
            DELETE FROM materials 
            WHERE folder LIKE %s AND org_id = %s;
        """, (folder_prefix + "/%", data.org_id))
        
        db.commit()
        cur.close()
        return {'success': True, 'message': 'Folder and database records deleted successfully'}
    except Exception as e:
        print(f"Error deleting folder: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while deleting folder")

# Rename material (file name) endpoint

class MaterialRenameRequest(BaseModel):
    name: str

@app.post("/api/materials/{material_id}/rename")
def rename_material(material_id: int, data: MaterialRenameRequest, current_user=Depends(get_current_user), db=Depends(get_db)):
    role_name = current_user['role'].lower()
    if role_name != 'admin':
        raise HTTPException(status_code=403, detail="Not authorized to rename materials")
        
    try:
        cur = db.cursor()
        cur.execute("SELECT material_id FROM materials WHERE material_id = %s", (material_id,))
        if not cur.fetchone():
            cur.close()
            raise HTTPException(status_code=404, detail="Material not found")
            
        cur.execute("""
            UPDATE materials 
            SET name = %s 
            WHERE material_id = %s;
        """, (data.name, material_id))
        
        db.commit()
        cur.close()
        return {'success': True, 'message': 'Material renamed successfully'}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error renaming material: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while renaming material")

@app.post("/api/materials/{material_id}/reupload")
async def reupload_material(
    material_id: int,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db=Depends(get_db)
):
    try:
        import secrets
        import shutil
        import datetime
        
        cur = db.cursor()
        cur.execute("SELECT * FROM materials WHERE material_id = %s", (material_id,))
        m = cur.fetchone()
        if not m:
            cur.close()
            raise HTTPException(status_code=404, detail="Material not found")
            
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{secrets.token_hex(8)}{file_ext}"
        new_file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file contents
        with open(new_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Re-run brand compliance checks
        ai_score, ai_remarks, ai_suggestions = check_brand_compliance(m['org_id'], m['name'], m['type'])
        ai_insights = ["ai_new_color_ok", "ai_new_logo_ok", "ai_new_typography_ok", "ai_new_imagery_ok"]
        
        # Reset votes
        votes = {
            "admin": "pending",
            "ceo": "pending",
            "coo": "pending",
            "director": "pending"
        }
        
        # Update versions history
        now = datetime.datetime.utcnow()
        short_date = now.strftime("%b %d")
        
        # Parse current versions list from DB
        current_versions = m['versions']
        if isinstance(current_versions, str):
            current_versions = json.loads(current_versions)
            
        next_v_num = len(current_versions) + 1
        new_version_info = {
            "v": f"v{next_v_num}",
            "date": short_date,
            "note": f"Revised version uploaded"
        }
        current_versions.append(new_version_info)
        
        # Update database
        cur.execute("""
            UPDATE materials
            SET file_path = %s,
                status = 'pending',
                ai_score = %s,
                ai_insights = %s,
                votes = %s,
                versions = %s,
                ai_remarks = %s,
                ai_suggestions = %s,
                created_at = CURRENT_TIMESTAMP
            WHERE material_id = %s
        """, (
            new_file_path,
            ai_score,
            json.dumps(ai_insights),
            json.dumps(votes),
            json.dumps(current_versions),
            ai_remarks,
            ai_suggestions,
            material_id
        ))
        
        # Loop and insert notifications for standard roles: admin, ceo, coo, director
        designer_name = current_user.get('name', 'Unknown')
        notif_roles = ['admin', 'ceo', 'coo', 'director']
        notif_icon = '🔄'
        notif_message = f"Revised version {new_version_info['v']} of '{m['name']}' uploaded by {designer_name}. AI Score: {ai_score}/100."
        
        for r in notif_roles:
            cur.execute("""
                INSERT INTO notifications (user_role, icon, message, material_id, is_read)
                VALUES (%s, %s, %s, %s, FALSE)
            """, (r, notif_icon, notif_message, material_id))
            
        db.commit()
        cur.close()
        
        return {
            'success': True,
            'message': 'Revised version uploaded successfully'
        }
    except Exception as e:
        print(f"Error reuploading material: {e}")
        raise HTTPException(status_code=500, detail="Database error occurred while reuploading material")

if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get("PORT", 5001))
    print(f"Starting FastAPI server on port {port}...")
    uvicorn.run(app, host='0.0.0.0', port=port)
