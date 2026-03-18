from django.urls import path
from .views import *

urlpatterns = [

    # AUTH
    path("register/", register_api),
    path("login/", login_api),

    # USER
    path("userdetails/", user_details_api),
    path("add-item/", add_item_api),
    path("items/", view_items_api),
    path("user/my-items/", user_my_items_api),

    # ADMIN
    path("admin/", admin_users_api),
    path("approve/", approve_user_api),
    path("admin/remove-item/", remove_item_api),

    path("request-item/", request_item_api),
    path("item-requests/", view_item_requests_api),
    path("update-request/", update_item_request_api),
    path("admin/items/", admin_items_api),
    path("user/requested-items/", user_requested_items_api),

]
