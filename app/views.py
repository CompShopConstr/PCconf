from django.shortcuts import render
from django.views import View
import requests
from app.models import User, Configuration
from rest_framework import viewsets
from .models import User, Configuration
from .serializers import UserSerializer, ConfigurationSerializer
from django.views.decorators.csrf import ensure_csrf_cookie


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ConfigurationViewSet(viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer


class FrontendTemplateView(View):
    def userdata(request, pk):
        user_obj = User.objects.get(pk=pk)
        configuration_objs = Configuration.objects.filter(user_id=user_obj.id)
        context = {
            "configurations": configuration_objs,
            "users": user_obj,
            }
        return render(request, "index.html", context)

    def get(self, request):
        return render(request, 'index.html')