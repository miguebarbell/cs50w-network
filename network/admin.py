from django.contrib import admin
from .models import User, Comment, Post, Following
from django.contrib.auth.admin import UserAdmin


admin.site.register(User, UserAdmin)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(Following)
