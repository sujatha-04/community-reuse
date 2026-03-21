from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, Item, ExchangeRequest

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

    # -------- CHECK IF USERNAME EXISTS --------
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"})

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"})

    # -------- CREATE USER --------
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        # Create user profile with mobile and address
        UserProfile.objects.create(
            user=user, 
            is_approved=False, 
            role='user',
            mobile=mobile,
            address=address
        )
        return Response({"success": "Registration successful. Awaiting admin approval"})
    except Exception as e:
        return Response({"error": str(e)})


# ================= LOGIN =================
@api_view(["POST"])
def login_api(request):
    username = request.data.get("username")
    password = request.data.get("password")

    print(f"Login attempt: {username}")

    # -------- AUTHENTICATE USER --------
    user = authenticate(username=username, password=password)

    if user is None:
        print(f"Authentication failed for {username}")
        return Response({"error": "Invalid username or password"})

    print(f"Authentication successful for {username}, is_staff: {user.is_staff}")

    # -------- CHECK APPROVAL STATUS --------
    try:
        profile = UserProfile.objects.get(user=user)
        print(f"Profile found: is_approved={profile.is_approved}, role={profile.role}")
        
        if not profile.is_approved and not user.is_staff:
            print(f"User {username} not approved and not staff")
            return Response({"error": "Account not approved by admin yet"})
        
        role = "admin" if user.is_staff else "user"
        print(f"Returning role: {role}")
        
    except UserProfile.DoesNotExist:
        print(f"No profile for {username}, creating one")
        # Create profile if doesn't exist (for admin user)
        if user.is_staff:
            UserProfile.objects.create(user=user, is_approved=True, role='admin')
            role = "admin"
        else:
            return Response({"error": "Invalid user profile"})

    return Response({
        "success": "Login successful",
        "role": role,
        "username": user.username,
        "email": user.email
    })


# ================= ADD ITEM =================
@api_view(["POST"])
def add_item_api(request):
    try:
        username = request.data.get("username")
        # Support both 'name' and 'item_name' field names
        name = request.data.get("name") or request.data.get("item_name")
        description = request.data.get("description")

        if not all([username, name, description]):
            return Response({"error": "All fields are required"})

        user = User.objects.get(username=username)
        item = Item.objects.create(owner=user, name=name, description=description)
        
        return Response({"success": "Item added successfully", "item_id": item.id})
    except User.DoesNotExist:
        return Response({"error": "User not found"})
    except Exception as e:
        return Response({"error": str(e)})


# ================= VIEW ITEMS =================
@api_view(["GET"])
def view_items_api(request):
    username = request.query_params.get("username")
    try:
        # Show only items from other users
        if username:
            items = Item.objects.exclude(owner__username=username)
        else:
            items = Item.objects.all()
        items_data = []
        for item in items:
            items_data.append({
                "id": item.id,
                "item_name": item.name,
                "name": item.name,
                "description": item.description,
                "owner": item.owner.username,
                "username": item.owner.username,
                "created_at": item.created_at
            })
        return Response({"items": items_data})
    except Exception as e:
        return Response({"error": str(e)})


# ================= USER DETAILS =================
@api_view(["GET"])
def user_details_api(request):
    username = request.query_params.get("username")
    try:
        user = User.objects.get(username=username)
        profile = UserProfile.objects.get(user=user)
        return Response({
            "user": {
                "username": user.username,
                "email": user.email,
                "mobile": profile.mobile or "",
                "address": profile.address or "",
                "is_approved": profile.is_approved,
                "role": profile.role
            }
        })
    except Exception as e:
        return Response({"error": str(e)})


# ================= ADMIN: APPROVE USER =================
@api_view(["POST"])
def approve_user_api(request):
    username = request.data.get("username")
    try:
        user = User.objects.get(username=username)
        profile = UserProfile.objects.get(user=user)
        profile.is_approved = True
        profile.save()
        return Response({"success": f"User {username} approved"})
    except Exception as e:
        return Response({"error": str(e)})


# ================= ADMIN: GET ALL USERS =================
@api_view(["GET"])
def admin_users_api(request):
    try:
        users = User.objects.all()
        users_data = []
        for user in users:
            try:
                profile = UserProfile.objects.get(user=user)
                is_approved = profile.is_approved
            except:
                is_approved = user.is_staff
            
            users_data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_approved": is_approved
            })
        return Response({"users": users_data})
    except Exception as e:
        return Response({"error": str(e)})


# ================= ITEM MANAGEMENT =================
@api_view(["GET"])
def user_my_items_api(request):
    username = request.query_params.get("username")
    if not username:
        return Response({"error": "Username required"})
    try:
        user = User.objects.get(username=username)
        items = Item.objects.filter(owner=user)
        items_data = []
        for item in items:
            items_data.append({
                "id": item.id,
                "item_name": item.name,
                "name": item.name,
                "description": item.description,
                "status": "active",
                "created_at": item.created_at
            })
        return Response({"items": items_data})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["POST"])
def remove_item_api(request):
    item_id = request.data.get("item_id")
    if not item_id:
        return Response({"error": "Item ID required"})
    try:
        item = Item.objects.get(id=item_id)
        item.delete()
        return Response({"success": "Item removed"})
    except Exception as e:
        return Response({"error": str(e)})


# ================= EXCHANGE REQUESTS =================
@api_view(["POST"])
def request_item_api(request):
    username = request.data.get("username")
    item_id = request.data.get("item_id")
    
    if not username or not item_id:
        return Response({"error": "Invalid request"})
    
    try:
        requester = User.objects.get(username=username)
        item = Item.objects.get(id=item_id)
        
        # Check if already requested
        if ExchangeRequest.objects.filter(item=item, requester=requester).exists():
            return Response({"error": "Already requested"})
        
        ExchangeRequest.objects.create(item=item, requester=requester, status='pending')
        return Response({"success": "Item request sent"})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def view_item_requests_api(request):
    username = request.query_params.get("username")
    try:
        owner = User.objects.get(username=username)
        requests = ExchangeRequest.objects.filter(item__owner=owner)
        requests_data = []
        for req in requests:
            requests_data.append({
                "id": req.id,
                "item_name": req.item.name,
                "requester": req.requester.username,
                "status": req.status
            })
        return Response({"requests": requests_data})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["POST"])
def update_item_request_api(request):
    request_id = request.data.get("request_id")
    status = request.data.get("status")  # approved / rejected
    
    try:
        exchange_req = ExchangeRequest.objects.get(id=request_id)
        exchange_req.status = status
        exchange_req.save()
        return Response({"success": f"Request {status}"})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def admin_items_api(request):
    try:
        items = Item.objects.all()
        items_data = []
        for item in items:
            items_data.append({
                "id": item.id,
                "item_name": item.name,
                "description": item.description,
                "username": item.owner.username,
                "created_at": item.created_at
            })
        return Response({"items": items_data})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def user_requested_items_api(request):
    username = request.query_params.get("username")
    try:
        requester = User.objects.get(username=username)
        requests = ExchangeRequest.objects.filter(requester=requester)
        items_data = []
        for req in requests:
            items_data.append({
                "item_id": req.item.id,
                "item_name": req.item.name,
                "status": req.status,
                "owner": req.item.owner.username
            })
        return Response({"items": items_data})
    except Exception as e:
        return Response({"error": str(e)})
