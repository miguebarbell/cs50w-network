
from django.urls import path, include

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # path("posts", views.posts, name="posts"),
    path("newpost", views.newpost, name="newpost"),
    path("api", views.PostView.as_view()),
    # path("api", views.PostViewSet.as_view(), name="api_post")
    path("profile/<str:username>", views.profile, name="profile"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("following", views.following_posts)
]
