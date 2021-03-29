from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='User')
    text = models.CharField(max_length=400)
    date = models.DateField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return f'{self.user} posts at {self.date}'


class Comment(models.Model):
    comment = models.TextField
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} commented in {self.post}'


class Following(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="follows")
    following = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return f'{self.user} is following {self.following}'
