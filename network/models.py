from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone



class User(AbstractUser):
    pass

class Npost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='author')
    post = models.CharField(max_length=280)
    timest = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"id: {self.id}, Author: {self.author}, Post: {self.post}, Timestamp: {self.timest}"

class Like(models.Model):
    liker = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ManyToManyField(Npost, blank=True, related_name='liker')
    def __str__(self):
        return f"Liker: {self.liker}"
