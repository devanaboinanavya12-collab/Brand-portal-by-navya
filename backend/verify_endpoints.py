import urllib.request
import json

BASE_URL = "http://localhost:5001"

def make_request(path, method="GET", headers=None, body=None):
    if headers is None:
        headers = {}
    url = f"{BASE_URL}{path}"
    data = None
    if body is not None:
        data = json.dumps(body).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            response_body = response.read().decode('utf-8')
            return status, json.loads(response_body) if response_body else None
    except urllib.error.HTTPError as e:
        response_body = e.read().decode('utf-8')
        try:
            err_json = json.loads(response_body)
        except Exception:
            err_json = response_body
        return e.code, err_json

def test_flow():
    print("1. Log in as admin...")
    status, res = make_request("/api/auth/login", method="POST", body={
        "email": "admin@example.com",
        "password": "admin123"
    })
    assert status == 200, f"Login failed: {res}"
    admin_token = res["token"]
    print("   Admin token obtained successfully.")

    print("\n2. Log in as a normal user (Director) to test permission constraints...")
    status, res = make_request("/api/auth/login", method="POST", body={
        "email": "director@example.com",
        "password": "director123"
    })
    assert status == 200, f"User login failed: {res}"
    director_token = res["token"]
    print("   Director token obtained successfully.")

    headers_admin = {"Authorization": f"Bearer {admin_token}"}
    headers_director = {"Authorization": f"Bearer {director_token}"}

    print("\n3. Create a temporary user via Admin...")
    status, res = make_request("/api/admin/users", method="POST", headers=headers_admin, body={
        "name": "Temp Test User",
        "email": "temp_test@example.com",
        "role": "COO",
        "password": "testpassword123"
    })
    assert status == 201, f"User creation failed: {res}"
    temp_user = res["user"]
    temp_user_id = temp_user["id"]
    print(f"   Created user {temp_user['name']} with ID {temp_user_id}.")

    print("\n3a. Verify creating a duplicate user name is blocked...")
    status, res = make_request("/api/admin/users", method="POST", headers=headers_admin, body={
        "name": "Temp Test User",
        "email": "temp_test_different@example.com",
        "role": "COO",
        "password": "testpassword123"
    })
    assert status == 409, f"Expected 409, got status {status}: {res}"
    assert res.get("detail") == "that username or email id is used try other name", f"Expected custom message, got: {res}"
    print("    Successfully blocked duplicate name creation with 409 and custom message.")

    print("\n3b. Verify creating a duplicate email is blocked...")
    status, res = make_request("/api/admin/users", method="POST", headers=headers_admin, body={
        "name": "Different Name",
        "email": "temp_test@example.com",
        "role": "COO",
        "password": "testpassword123"
    })
    assert status == 409, f"Expected 409, got status {status}: {res}"
    assert res.get("detail") == "that username or email id is used try other name", f"Expected custom message, got: {res}"
    print("    Successfully blocked duplicate email creation with 409 and custom message.")

    print("\n4. Verify non-admin (Director) cannot edit the temporary user...")
    status, res = make_request(f"/api/admin/users/{temp_user_id}", method="PUT", headers=headers_director, body={
        "name": "Unauthorized Edit",
        "role": "Admin"
    })
    assert status == 403, f"Expected 403, got status {status}: {res}"
    print("   Correctly blocked unauthorized edit with 403 Forbidden.")

    print("\n5. Verify admin can edit the temporary user's profile...")
    status, res = make_request(f"/api/admin/users/{temp_user_id}", method="PUT", headers=headers_admin, body={
        "name": "Temp Test User Edited",
        "role": "CEO"
    })
    assert status == 200, f"User edit failed: {res}"
    print(f"   Successfully updated profile details to: {res['user']}")

    print("\n5a. Verify updating to a duplicate username (e.g. 'Admin User') is blocked...")
    status, res = make_request(f"/api/admin/users/{temp_user_id}", method="PUT", headers=headers_admin, body={
        "name": "Admin User",
        "role": "CEO"
    })
    assert status == 409, f"Expected 409, got status {status}: {res}"
    assert res.get("detail") == "that username or email id is used try other name", f"Expected custom message, got: {res}"
    print("    Successfully blocked duplicate name update with 409 and custom message.")

    print("\n6. Verify DB persistence by listing users...")
    status, users_list = make_request("/api/users", headers=headers_admin)
    assert status == 200, f"Listing users failed: {res}"
    edited_user = next((u for u in users_list if u["id"] == temp_user_id), None)
    assert edited_user is not None, "Edited user not found in the users list"
    assert edited_user["name"] == "Temp Test User Edited", f"Expected 'Temp Test User Edited', got '{edited_user['name']}'"
    assert edited_user["role"] == "CEO", f"Expected role 'CEO', got '{edited_user['role']}'"
    print("   Verified details persisted correctly in PostgreSQL.")

    print("\n7. Verify non-admin (Director) cannot delete the temporary user...")
    status, res = make_request(f"/api/admin/users/{temp_user_id}", method="DELETE", headers=headers_director)
    assert status == 403, f"Expected 403, got status {status}: {res}"
    print("   Correctly blocked unauthorized delete with 403 Forbidden.")

    print("\n8. Verify admin can delete the temporary user...")
    status, res = make_request(f"/api/admin/users/{temp_user_id}", method="DELETE", headers=headers_admin)
    assert status == 200, f"User deletion failed: {res}"
    print("   Successfully deleted user.")

    print("\n9. Verify user deletion persistence by listing users...")
    status, users_list_post = make_request("/api/users", headers=headers_admin)
    deleted_user = next((u for u in users_list_post if u["id"] == temp_user_id), None)
    assert deleted_user is None, "User still exists in PostgreSQL after deletion!"
    print("   Verified user was successfully deleted from PostgreSQL.")

    print("\n10. Verify material approval / voting persistence in PostgreSQL...")
    status, materials_list = make_request("/api/materials?org_id=Bio%20Factor", headers=headers_admin)
    assert status == 200, f"Failed to fetch materials: {materials_list}"
    assert len(materials_list) > 0, "No seeded materials found"
    
    test_material = materials_list[0]
    test_material_id = test_material["id"]
    print(f"    Testing vote casting on material ID {test_material_id} ('{test_material['name']}')")
    
    # Cast vote as CEO
    status, res = make_request(f"/api/materials/{test_material_id}/vote", method="POST", headers=headers_director, body={"decision": "approved"})
    assert status == 200, f"Casting vote failed: {res}"
    print(f"    Successfully cast vote on material. Response: {res}")
    
    # Fetch materials again to confirm database persistence
    status, materials_list_post = make_request("/api/materials?org_id=nexus", headers=headers_admin)
    updated_material = next((m for m in materials_list_post if m["id"] == test_material_id), None)
    assert updated_material is not None, "Material not found after vote update"
    assert updated_material["votes"].get("director") == "approved", "Vote did not persist in PostgreSQL database!"
    print("    Verified that the cast vote successfully persisted in PostgreSQL.")

    print("\n11. Testing dynamic notifications endpoints...")
    # Fetch notifications for Admin (should see notifications seeded)
    status, notifications_list = make_request("/api/notifications?org_id=Bio%20Factor", headers=headers_admin)
    assert status == 200, f"Failed to fetch notifications: {notifications_list}"
    print(f"    Admin notifications count: {len(notifications_list)}")
    if len(notifications_list) > 0:
        print(f"    Admin notification sample: {notifications_list[0]}")
    
    # Mark notifications as read
    status, res = make_request("/api/notifications/read", method="POST", headers=headers_admin, body={"org_id": "Bio Factor"})
    assert status == 200, f"Failed to mark notifications as read: {res}"
    print("    Successfully marked all notifications for Admin as read.")
    
    # Fetch notifications again and confirm they are marked as read
    status, notifications_list_post = make_request("/api/notifications?org_id=Bio%20Factor", headers=headers_admin)
    assert status == 200, f"Failed to fetch notifications after read: {notifications_list_post}"
    for n in notifications_list_post:
        assert n["isRead"] is True, f"Notification not marked as read: {n}"
    print("    Verified that all notifications are marked as read.")

    print("\n12. Testing material rename endpoint...")
    # Attempt to rename as non-admin (Director) - should be 403
    status, res = make_request(f"/api/materials/{test_material_id}/rename", method="POST", headers=headers_director, body={"name": "Director Renamed"})
    assert status == 403, f"Expected 403 for unauthorized rename, got {status}: {res}"
    print("    Correctly blocked unauthorized material rename (Director) with 403.")

    # Rename as admin - should succeed
    new_name = "Admin Renamed Material"
    status, res = make_request(f"/api/materials/{test_material_id}/rename", method="POST", headers=headers_admin, body={"name": new_name})
    assert status == 200, f"Failed to rename material as Admin: {res}"
    print("    Successfully renamed material as Admin.")

    # Confirm renamed material persists in the DB
    status, materials_list_rename = make_request("/api/materials?org_id=Bio%20Factor", headers=headers_admin)
    renamed_material = next((m for m in materials_list_rename if m["id"] == test_material_id), None)
    assert renamed_material is not None, "Material not found after rename"
    assert renamed_material["name"] == new_name, f"Expected name '{new_name}', got '{renamed_material['name']}'"
    print("    Verified material name change persisted in PostgreSQL.")

    print("\nAll programmatic API verification checks PASSED successfully!")

if __name__ == "__main__":
    test_flow()
