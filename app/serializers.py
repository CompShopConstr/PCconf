from django.db import models
from rest_framework import serializers
from .models import User, Configuration


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')


class ConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ('id', 'name', 'items', 'owner')