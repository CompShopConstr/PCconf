from django.db import models

# Create your models here.


class User(models.Model):
    name = models.TextField()
    email = models.TextField()
    password = models.TextField()


class Configuration(models.Model):
    name = models.TextField()
    items = models.TextField(max_length=40000, default='')
    owner = models.TextField(default='')
