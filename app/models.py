from django.db import models

# Create your models here.


class User(models.Model):
    name = models.TextField()
    email = models.TextField()
    password = models.TextField()


class Configuration(models.Model):
    name = models.TextField()
    owner = models.ForeignKey("User", on_delete=models.SET_NULL, null=True)
