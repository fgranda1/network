from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from . models import *
from django.core.paginator import Paginator
from django.http import JsonResponse
import json

def get_following(request, user_name):
    try:
        following_list = []
        user_obj = User.objects.get(username=user_name)
        follows = Follow.objects.filter(follower=user_obj)
        for i in follows:
            for e in i.follow_to.all():
                test = str(e.username)
                following_list.append(test)
        following_count = len(following_list)
        return JsonResponse(status=200, data={'following':{'count':following_count}, 'following_to':following_list})
    except:
        return JsonResponse(status=404, data={'Message': 'User does not exist'})

def get_follows(request, user_name):
    try:
        follow_list = []
        user_obj = User.objects.get(username=user_name)
        follows = Follow.objects.filter(follow_to=user_obj)
        for follow in follows:
            followers = str(follow.follower)
            follow_list.append(followers)
        follow_count = len(follow_list)
        return JsonResponse(status=200, data={'follows':{'count':follow_count}, 'followers':follow_list})
    except:
        return JsonResponse(status=404, data={'Message': 'User does not exist'})


def liking(request, post_id):
    if request.method == 'POST':
        data = json.loads(request.body.decode("utf-8"))
        tag = data['action']
        print(tag)
        if tag == 'like':
            #getting the post object
            pst = Npost.objects.get(id=post_id)
            #getting author Object
            author = User.objects.get(username=request.user)
            #creating like and saving it
            like = Like(liker=author)
            like.save()
            #adding like to post and saving it
            like.post.add(pst)
            like.save()
            return JsonResponse(status=200, data={'Like':'ok'})
        elif tag == 'dislike':
            #getting the post object filtering by post_id
            pst = Npost.objects.get(id=post_id)
            #getting author Object filtering by username
            author = User.objects.get(username=request.user)
            # getting Like object and filtering by author and pst
            like = Like.objects.get(liker=author, post=pst)
            #removing like
            like.delete()
            return JsonResponse(status=200, data={'Dislike':'ok'})


def get_likes(request, post_id):
    try:
        likers = []
        post = Npost.objects.get(id=post_id)
        likes = Like.objects.filter(post=post)

        for like in likes:
            liker = str(like.liker)
            likers.append(liker)
        likes_count = len(likers)
        return JsonResponse(status=200, data={'likes':{'count':likes_count}, 'likers':likers})
    except:
        return JsonResponse(status=404, data={'Message': 'Post_id does not exist'})




def user_profile(request, user):
    author = User.objects.get(username=user)
    post_list_byuser = Npost.objects.filter(author=author).order_by('-id')
    paginator = Paginator(post_list_byuser, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    user = request.user
    return render(request, 'network/profile.html', {'page_obj': page_obj, 'profile': author, 'user':user})

def index(request):
    if request.method == 'POST':
        post_text = request.POST['post_text']
        author = User.objects.get(username=request.user)
        new_post = Npost(author=author, post=post_text)
        new_post.save()
        return HttpResponseRedirect(reverse('index'))
    else:
        post_list = Npost.objects.all().order_by('-id')
        paginator = Paginator(post_list, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        return render(request, "network/index.html", {'page_obj': page_obj})


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
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
