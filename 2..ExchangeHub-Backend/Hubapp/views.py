from rest_framework.decorators import api_view
from rest_framework.response import Response
import pymysql

# ================= DATABASE CONNECTION =================
def get_db_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="root",
        database="webdb7",
        cursorclass=pymysql.cursors.DictCursor
    )


# ================= ENSURE SINGLE ADMIN =================
def ensure_single_admin():
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM users1 WHERE role='admin'")
        if not cur.fetchone():
            cur.execute("""
                INSERT INTO users1
                (username,email,password,mobile,address,role,approved)
                VALUES ('admin','admin@gmail.com','admin',
                        '1234567890','Hyderabad','admin',1)
            """)
            con.commit()


# ================= REGISTER =================
@api_view(["POST"])
def register_api(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    mobile = request.data.get("mobile")
    address = request.data.get("address")

    if not all([username, email, password, mobile, address]):
        return Response({"error": "All fields are required"})

    con = get_db_connection()
    with con:
        cur = con.cursor()

        # -------- UNIQUE CHECKS --------
        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        if cur.fetchone():
            return Response({"error": "Username already exists"})

        cur.execute("SELECT id FROM users1 WHERE email=%s", (email,))
        if cur.fetchone():
            return Response({"error": "Email already exists"})

        cur.execute("SELECT id FROM users1 WHERE mobile=%s", (mobile,))
        if cur.fetchone():
            return Response({"error": "Mobile number already exists"})

        # -------- INSERT USER --------
        cur.execute("""
            INSERT INTO users1
            (username,email,password,mobile,address,role,approved)
            VALUES (%s,%s,%s,%s,%s,'user',0)
        """, (username, email, password, mobile, address))
        con.commit()

    return Response({"success": "Registration successful. Awaiting Admin approval"})


# ================= LOGIN =================
@api_view(["POST"])
def login_api(request):
    ensure_single_admin()

    username = request.data.get("username")
    password = request.data.get("password")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute(
            "SELECT * FROM users1 WHERE username=%s AND password=%s",
            (username, password)
        )
        user = cur.fetchone()

    if not user:
        return Response({"error": "Invalid credentials"})

    if user["role"] != "admin" and user["approved"] == 0:
        return Response({"error": "Account not approved by admin"})

    return Response({
        "success": "Login successful",
        "role": user["role"],
        "username": user["username"]
    })


# ================= USER DETAILS =================
@api_view(["GET"])
def user_details_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM users1 WHERE username=%s", (username,))
        user = cur.fetchone()

    if not user:
        return Response({"error": "User not found"})

    return Response({"user": user})


# ================= ADMIN – VIEW PENDING USERS =================
@api_view(["GET"])
def admin_users_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("""
            SELECT username, email, mobile, approved
            FROM users1
            WHERE role='user'
        """)
        users = cur.fetchall()

    return Response({"users": users})


# ================= ADMIN – APPROVE USER =================
@api_view(["POST"])
def approve_user_api(request):
    username = request.data.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute(
            "UPDATE users1 SET approved=1 WHERE username=%s",
            (username,)
        )
        con.commit()

    return Response({"success": "User approved"})


# ================= USER – ADD ITEM =================
@api_view(["POST"])
def add_item_api(request):
    username = request.data.get("username")
    item_name = request.data.get("item_name")
    description = request.data.get("description")

    if not all([username, item_name, description]):
        return Response({"error": "All fields are required"})

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        user = cur.fetchone()

        if not user:
            return Response({"error": "User not found"})

        cur.execute("""
            INSERT INTO items (user_id, item_name, description)
            VALUES (%s,%s,%s)
        """, (user["id"], item_name, description))
        con.commit()

    return Response({"success": "Item added successfully"})


# ================= USER – VIEW ITEMS =================
@api_view(["GET"])
def view_items_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()

        # show only other users' items
        cur.execute("""
            SELECT items.id, item_name, description, username
            FROM items
            JOIN users1 ON items.user_id = users1.id
            WHERE items.status='active'
            AND users1.username != %s
        """, (username,))

        items = cur.fetchall()

    return Response({"items": items})



# ================= ADMIN – REMOVE ITEM =================
@api_view(["POST"])
def remove_item_api(request):
    item_id = request.data.get("item_id")  # ✅ FIX

    if not item_id:
        return Response({"error": "Item ID required"})

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute(
            "UPDATE items SET status='removed' WHERE id=%s",
            (item_id,)
        )
        con.commit()

    return Response({"success": "Item removed"})



@api_view(["GET"])
def user_my_items_api(request):
    username = request.GET.get("username")

    if not username:
        return Response({"error": "Username required"})

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT items.id, item_name, description, status
            FROM items
            JOIN users1 ON items.user_id = users1.id
            WHERE users1.username=%s
        """, (username,))
        items = cur.fetchall()

    return Response({"items": items})

@api_view(["POST"])
def request_item_api(request):
    username = request.data.get("username")
    item_id = request.data.get("item_id")

    if not username or not item_id:
        return Response({"error": "Invalid request"})

    con = get_db_connection()
    with con:
        cur = con.cursor()

        # requester
        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        requester = cur.fetchone()

        # item owner
        cur.execute("SELECT user_id FROM items WHERE id=%s", (item_id,))
        item = cur.fetchone()

        if not requester or not item:
            return Response({"error": "Invalid request"})

        # ✅ PREVENT MULTIPLE REQUESTS
        cur.execute("""
            SELECT id FROM item_requests
            WHERE item_id=%s AND requester_id=%s
        """, (item_id, requester["id"]))

        if cur.fetchone():
            return Response({"error": "Already requested"})

        # insert request
        cur.execute("""
            INSERT INTO item_requests (item_id, requester_id, owner_id)
            VALUES (%s,%s,%s)
        """, (item_id, requester["id"], item["user_id"]))
        con.commit()

    return Response({"success": "Item request sent"})



@api_view(["GET"])
def view_item_requests_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()

        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        owner = cur.fetchone()

        cur.execute("""
            SELECT r.id, i.item_name, u.username AS requester, r.status
            FROM item_requests r
            JOIN items i ON r.item_id = i.id
            JOIN users1 u ON r.requester_id = u.id
            WHERE r.owner_id = %s
        """, (owner["id"],))

        requests = cur.fetchall()

    return Response({"requests": requests})

@api_view(["POST"])
def update_item_request_api(request):
    request_id = request.data.get("request_id")
    status = request.data.get("status")  # approved / rejected

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            UPDATE item_requests SET status=%s WHERE id=%s
        """, (status, request_id))
        con.commit()

    return Response({"success": f"Request {status}"})


@api_view(["GET"])
def admin_items_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("""
            SELECT items.id,
                   items.item_name,
                   items.description,
                   items.status,
                   users1.username
            FROM items
            JOIN users1 ON items.user_id = users1.id
        """)
        items = cur.fetchall()

    return Response({"items": items})

@api_view(["GET"])
def user_requested_items_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor()

        # requester id
        cur.execute("SELECT id FROM users1 WHERE username=%s", (username,))
        requester = cur.fetchone()

        if not requester:
            return Response({"items": []})

        cur.execute("""
            SELECT 
                i.id AS item_id,
                i.item_name,
                r.status,
                u.username AS owner,
                CASE WHEN r.status='approved' THEN u.mobile ELSE NULL END AS owner_mobile,
                CASE WHEN r.status='approved' THEN u.address ELSE NULL END AS owner_address
            FROM item_requests r
            JOIN items i ON r.item_id = i.id
            JOIN users1 u ON r.owner_id = u.id
            WHERE r.requester_id = %s
        """, (requester["id"],))

        items = cur.fetchall()

    return Response({"items": items})
