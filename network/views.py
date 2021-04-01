from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
# from .forms import PostForm
from .models import User, Post, Profile
import json
from rest_framework import viewsets, generics
from .serializers import PostSerializer


# serializer Post
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('id')
    serializer_class = PostSerializer


# class PostView(generics.CreateAPIView):
class PostView(generics.ListAPIView):
    queryset = Post.objects.all().order_by('-date')
    serializer_class = PostSerializer


def newpost(request):
    if request.method == 'POST':
        # text = str(request.POST.get('post'))
        post = Post(text=str(request.POST.get('post')), user=request.user)
        # post.text = str(request.POST.get('post'))
        # post.user = request.user
        post.save()
    return render(request, "network/index.html")


def posts(request):
    posts = Post.objects.all()
    p = Paginator(posts, 10)
    start = int(request.GET.get('start') or 0)
    end = int(request.GET.get('end') or start + 9)
    if end > len(posts):
        end = len(posts)
    # data = [f'Post #{i}' for i in range(start, end, 1)]
    data = []
    for i in range(start, end, 1):
        # get the posts from the model
        # TODO: make the python dict json object
        data.append({
            'user': {posts[i].user},
            'text': {posts[i].text},
            'date': {posts[i].date},
            'likes': {posts[i].likes}
        })
        # data.append(f'Post #{i} {posts[i].text} by {posts[i].user}')

    return JsonResponse({"posts": json.dumps(str(data))})


def index(request):
    # data = posts(request)
    data = str(Post.objects.all())
    if request.method == "POST":
        if request.user.is_authenticated():
            postform = PostForm
            # postform = PostForm(data=request.POST)
            return render(request, "network/index.html", {'user': request.user, 'post': data})
    else:
        return render(request, "network/index.html", {'post': data})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()

        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        profile = Profile(user=user)
        profile.save()
        print(f'created {profile}')
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def profile(request, username):
    user_posts = Post.objects.filter(user=username).order_by('-date')
    posts = []
    for i in range(len(user_posts)):
        posts.append({'date': user_posts[i].date.strftime('%H:%M %d %b %Y'), 'text': user_posts[i].text,
                      'likes': len(user_posts[i].likes.all())})
    status = request.user.is_authenticated
    ###el profile que se esta visitando
    user = User.objects.get(username=username)
    # profile = Profile.objects.get(user=user)
    ###el usuario q esta haciendo el requiest
    user_profile = Profile.objects.get(user=request.user)
    ### folling a user el que hace el request
    # user_profile.following.add(user) #funcionando migue folling leo
    following_status = user in user_profile.following.all()
    print(f'{user_profile} following {user}: {user in user_profile.following.all()}')
    followers = 0
    for u in Profile.objects.all():
        if user in u.following.all():
            followers += 1
    return JsonResponse({'followers': followers,
                         'posts': posts,
                         'logged': status,
                         'following_status': following_status,
                         'request_user': str(request.user)
                         })


@login_required
@csrf_exempt
def follow(request):
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    follow = data.get("follow")
