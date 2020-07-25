
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("user/<str:user>", views.user_profile, name="user"),
    path("following/<str:user_name>", views.following, name="following_"),
    path("api/likes/<int:post_id>", views.get_likes, name="likes"),
    path("api/liking/<int:post_id>", views.liking, name="liking"),
    path("api/followers/<str:user_name>", views.get_follows, name="follow"),
    path("api/following/<str:user_name>", views.get_following, name="following"),
    path("api/push_follow/<str:user_name>", views.push_follow, name="push_follow"),
    path("api/update_post/", views.update_post, name="update_post")

]
