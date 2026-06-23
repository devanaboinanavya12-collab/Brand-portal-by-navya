import os
import psycopg2
from werkzeug.security import generate_password_hash
import json

# Simple helper to read .env file manually to avoid dependency on python-dotenv
def load_env():
    env_vars = {}
    if os.path.exists('.env'):
        with open('.env') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, val = line.split('=', 1)
                    env_vars[key.strip()] = val.strip()
    return env_vars

def main():
    print("Reading environment configuration...")
    env = load_env()
    
    db_host = env.get("DB_HOST", "localhost")
    db_port = env.get("DB_PORT", "5432")
    db_name = env.get("DB_NAME", "postgres")
    db_user = env.get("DB_USER", "postgres")
    db_password = env.get("DB_PASSWORD", "postgres")
    
    print(f"Connecting to database '{db_name}' on {db_host}:{db_port} as user '{db_user}'...")
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            dbname=db_name,
            user=db_user,
            password=db_password
        )
        conn.autocommit = True
        cur = conn.cursor()
        print("Connected successfully!")
    except Exception as e:
        print(f"ERROR: Could not connect to PostgreSQL database.")
        print(f"Details: {e}")
        return



    # Seed Roles if not exists
    roles = [
        {"name": "Admin", "desc": "System Administrator"},
        {"name": "CEO", "desc": "Chief Executive Officer"},
        {"name": "COO", "desc": "Chief Operating Officer"},
        {"name": "Director", "desc": "Director"},
        {"name": "User", "desc": "Standard User"}
    ]
    print("Seeding roles...")
    for role in roles:
        cur.execute(
            "INSERT INTO roles (role_name, description) VALUES (%s, %s) ON CONFLICT (role_name) DO NOTHING;",
            (role["name"], role["desc"])
        )
    
    # Get role IDs
    cur.execute("SELECT role_id, role_name FROM roles;")
    role_map = {role_name: r_id for r_id, role_name in cur.fetchall()}
    print(f"Roles mapped: {role_map}")

    # Seed Default Users
    default_users = [
        {"first_name": "Admin", "last_name": "", "email": "admin@example.com", "role": "Admin", "password": "admin123"},
        {"first_name": "CEO", "last_name": "", "email": "ceo@example.com", "role": "CEO", "password": "ceopass"},
        {"first_name": "COO", "last_name": "", "email": "coo@example.com", "role": "COO", "password": "coopass"},
        {"first_name": "Director", "last_name": "", "email": "director@example.com", "role": "Director", "password": "director123"},
    ]

    print("Seeding default user accounts...")
    for u in default_users:
        role_id = role_map.get(u["role"])
        if not role_id:
            print(f"ERROR: Role {u['role']} not found for user {u['first_name']}. Skipping.")
            continue
        
        # Hash password using Werkzeug's pbkdf2
        pw_hash = generate_password_hash(u["password"])
        
        # Check if user already exists
        cur.execute("SELECT user_id FROM users WHERE email = %s;", (u["email"],))
        res = cur.fetchone()
        
        if not res:
            cur.execute(
                """INSERT INTO users (first_name, last_name, email, role_id, password_hash, is_active) 
                   VALUES (%s, %s, %s, %s, %s, TRUE);""",
                (u["first_name"], u["last_name"], u["email"], role_id, pw_hash)
            )
            print(f"Created user: {u['first_name']} ({u['email']}) with role {u['role']}.")
        else:
            # User exists, update password and role to keep it in sync
            cur.execute(
                """UPDATE users SET first_name = %s, last_name = %s, role_id = %s, password_hash = %s 
                   WHERE email = %s;""",
                (u["first_name"], u["last_name"], role_id, pw_hash, u["email"])
            )
            print(f"User {u['first_name']} ({u['email']}) already exists. Password/role updated.")

    # Create Materials table
    print("Recreating materials and notifications tables...")
    cur.execute("DROP TABLE IF EXISTS notifications CASCADE;")
    cur.execute("DROP TABLE IF EXISTS materials CASCADE;")
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
            user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    """)

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

    # Seed default materials if empty
    cur.execute("SELECT COUNT(*) FROM materials;")
    count = cur.fetchone()[0]
    if count == 0:
        print("Seeding default materials and notifications...")
        base_materials = [
            {
                "name": "Summer Sale Flyer", "type": "flyer", "emoji": "🖼", "designer": "Diana (Director)", "campaign": "Summer 2025", "folder": "Campaigns/Seasonal/Summer",
                "status": "pending", "ai_score": 82, "ai_insights": '["ai_m1_1", "ai_m1_2", "ai_m1_3", "ai_m1_4", "ai_m1_5"]',
                "votes": '{"admin": "pending", "ceo": "pending", "coo": "approved", "director": "approved"}',
                "versions": '[{"v": "v2", "date": "Jun 8", "note": "version_revised_cta"}, {"v": "v1", "date": "Jun 5", "note": "version_initial_upload"}]',
                "ai_remarks": "RAG analysis: Color palette matches primary brand palette (82%). Typography is consistent with brand style guide. Safe zone margin for logo is checked.",
                "ai_suggestions": "1. Consider checking color contrast on the CTA button.\n2. Verify the font weight of headings is standard.",
                "org_id": "Bio Factor"
            },
            {
                "name": "Q3 Product Brochure", "type": "brochure", "emoji": "📄", "designer": "Diana (Director)", "campaign": "Q3 Launch", "folder": "Campaigns/In-Store/POS Materials",
                "status": "pending", "ai_score": 91, "ai_insights": '["ai_m2_1", "ai_m2_2", "ai_m2_3", "ai_m2_4"]',
                "votes": '{"admin": "pending", "ceo": "pending", "coo": "pending", "director": "approved"}',
                "versions": '[{"v": "v1", "date": "Jun 7", "note": "version_initial_upload"}]',
                "ai_remarks": "RAG analysis: Excellent alignment with brand standards (91%). Text fonts and layout dimensions are fully approved.",
                "ai_suggestions": "1. Layout and assets are highly compliant. No immediate changes needed.",
                "org_id": "Bio Factor"
            },
            {
                "name": "Event Announcement Poster", "type": "poster", "emoji": "🪧", "designer": "Diana (Director)", "campaign": "Annual Conference", "folder": "Campaigns/Promotions/Flyers",
                "status": "revision", "ai_score": 58, "ai_insights": '["ai_m3_1", "ai_m3_2", "ai_m3_3", "ai_m3_4"]',
                "votes": '{"admin": "revision", "ceo": "revision", "coo": "revision", "director": "approved"}',
                "versions": '[{"v": "v1", "date": "Jun 5", "note": "version_initial_upload"}]',
                "ai_remarks": "RAG analysis: Color palette contrast is too low (58%). Logo rules not met (stretching/busy background). Action required: adjust contrast ratio to at least 4.5:1.",
                "ai_suggestions": "1. Increase background contrast to at least 4.5:1 ratio.\n2. Adjust logo placement to respect the 20px safe-zone margin.",
                "org_id": "Bio Factor"
            },
            {
                "name": "Retail POS Banner", "type": "banner", "emoji": "🏳", "designer": "Diana (Director)", "campaign": "Retail 2025", "folder": "Campaigns/Promotions/Flyers",
                "status": "approved", "ai_score": 95, "ai_insights": '["ai_m4_1", "ai_m4_2"]',
                "votes": '{"admin": "approved", "ceo": "approved", "coo": "approved", "director": "approved"}',
                "versions": '[{"v": "v2", "date": "Jun 3", "note": "version_final"}, {"v": "v1", "date": "May 30", "note": "version_initial"}]',
                "ai_remarks": "RAG analysis: Highly compliant (95%) with all in-store branding parameters.",
                "ai_suggestions": "1. Highly compliant. Ready for production usage.",
                "org_id": "Bio Factor"
            },
            {
                "name": "Social Media Bundle", "type": "banner", "emoji": "📱", "designer": "Diana (Director)", "campaign": "Social June", "folder": "Campaigns/Digital/Social Media",
                "status": "approved", "ai_score": 88, "ai_insights": '["ai_m5_1", "ai_m5_2", "ai_m5_3"]',
                "votes": '{"admin": "approved", "ceo": "approved", "coo": "approved", "director": "approved"}',
                "versions": '[{"v": "v1", "date": "Jun 1", "note": "version_initial"}]',
                "ai_remarks": "RAG analysis: Social media dimensions and colors are verified and compliant.",
                "ai_suggestions": "1. Ensure dimensions match social platform specifications.",
                "org_id": "Bio Factor"
            },
            {
                "name": "Leaflet — New Services", "type": "leaflet", "emoji": "📃", "designer": "Diana (Director)", "campaign": "Service Launch", "folder": "Campaigns/Promotions/Flyers",
                "status": "approved", "ai_score": 79, "ai_insights": '["ai_m6_1", "ai_m6_2", "ai_m6_3"]',
                "votes": '{"admin": "approved", "ceo": "approved", "coo": "approved", "director": "approved"}',
                "versions": '[{"v": "v1", "date": "May 28", "note": "version_initial"}]',
                "ai_remarks": "RAG analysis: Layout and image selections are aligned.",
                "ai_suggestions": "1. Tweak spacing around subheadings for better readability.",
                "org_id": "Bio Factor"
            }
        ]

        common_paths = [
            # Marketing
            "Marketing/Flyers/2025",
            "Marketing/Flyers/2024 Archive",
            "Marketing/Brochures/Products",
            "Marketing/Brochures/Corporate",
            "Marketing/Posters/Events",
            "Marketing/Posters/Retail POS",
            "Marketing/Digital/Social Media",
            "Marketing/Digital/Email Headers",
            "Marketing/Print/Retail",
            "Marketing/Print/Outdoor",
            # Campaigns
            "Campaigns/Seasonal/Summer",
            "Campaigns/Seasonal/Winter",
            "Campaigns/Seasonal/Festive",
            "Campaigns/In-Store/POS Materials",
            "Campaigns/In-Store/Window Displays",
            "Campaigns/Promotions/Flyers",
            "Campaigns/Promotions/Leaflets",
            "Campaigns/Digital/Social Media",
            "Campaigns/Digital/Email",
            # Corporate
            "Corporate/Brand Assets/Logos",
            "Corporate/Brand Assets/Templates",
            "Corporate/Client Comms/Brochures",
            "Corporate/Client Comms/Presentations",
            "Corporate/Regulatory/Compliance Docs",
            "Corporate/Regulatory/Disclosures",
            "Corporate/Events/Banners",
            "Corporate/Events/Signage",
            # Healthcare Mktg
            "Healthcare Mktg/Awareness/Posters",
            "Healthcare Mktg/Awareness/Leaflets",
            "Healthcare Mktg/Patient Info/Brochures",
            "Healthcare Mktg/Patient Info/Flyers",
            "Healthcare Mktg/Staff Comms/Internal Posters",
            "Healthcare Mktg/Staff Comms/Newsletters",
            "Healthcare Mktg/Digital/Social Media",
            "Healthcare Mktg/Digital/Web Banners",
            # Education
            "Education/Recruitment/Prospectus",
            "Education/Recruitment/Open Day",
            "Education/Campus/Posters",
            "Education/Campus/Banners",
            "Education/Courses/Leaflets",
            "Education/Courses/Brochures",
            "Education/Events/Graduation",
            "Education/Events/Conferences",
            # Logistics Mktg
            "Logistics Mktg/Client Facing/Brochures",
            "Logistics Mktg/Client Facing/Proposals",
            "Logistics Mktg/Fleet Branding/Vehicle Wraps",
            "Logistics Mktg/Fleet Branding/Uniforms",
            "Logistics Mktg/Trade Shows/Banners",
            "Logistics Mktg/Trade Shows/Displays",
            "Logistics Mktg/Digital/Social Media",
            "Logistics Mktg/Digital/Email"
        ]

        org_folder_paths = {
            "Bio Factor": common_paths,
            "Ferty Base": common_paths,
            "Aqua": common_paths,
            "One Health Centre": common_paths,
            "Water Links": common_paths,
            "Beyond Organic": common_paths
        }

        # Get Director user ID
        cur.execute("SELECT user_id FROM users WHERE email = 'director@example.com';")
        director_user_id = cur.fetchone()[0]

        # Seed default materials for all standard organisations
        for org in ["Bio Factor", "Ferty Base", "Aqua", "One Health Centre", "Water Links", "Beyond Organic"]:
            paths = org_folder_paths[org]
            for idx, bm in enumerate(base_materials):
                # Try to assign folder based on type
                assigned_folder = paths[idx % len(paths)]
                t_lower = bm["type"].lower()
                t_plural = t_lower + "s" if not t_lower.endswith("s") else t_lower
                for p in paths:
                    p_lower = p.lower()
                    if t_lower in p_lower or t_plural in p_lower:
                        assigned_folder = p
                        break

                cur.execute("""
                    INSERT INTO materials (name, type, emoji, designer, campaign, folder, status, ai_score, ai_insights, votes, versions, org_id, ai_remarks, ai_suggestions, user_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING material_id;
                """, (bm["name"], bm["type"], bm["emoji"], bm["designer"], bm["campaign"], assigned_folder, bm["status"], bm["ai_score"], bm["ai_insights"], bm["votes"], bm["versions"], org, bm["ai_remarks"], bm.get("ai_suggestions", ""), director_user_id))
                mat_id = cur.fetchone()[0]

                # Seed alerts in notifications
                if bm["status"] == "pending":
                    for role in ['admin', 'ceo', 'coo', 'director']:
                        cur.execute("""
                            INSERT INTO notifications (user_role, icon, message, material_id, is_read)
                            VALUES (%s, '📋', %s, %s, FALSE);
                        """, (role, f"New design '{bm['name']}' uploaded. AI Remarks: {bm['ai_remarks']}", mat_id))
                elif bm["status"] == "revision":
                    for role in ['admin', 'director']:
                        cur.execute("""
                            INSERT INTO notifications (user_role, icon, message, material_id, is_read)
                            VALUES (%s, '⚠️', %s, %s, FALSE);
                        """, (role, f"Design '{bm['name']}' flagged for revision. AI Remarks: {bm['ai_remarks']}", mat_id))

    cur.close()
    conn.close()
    print("Database setup completed successfully!")

if __name__ == "__main__":
    main()
