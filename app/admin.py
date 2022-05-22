from django.contrib import admin
from django.db import models
from .models import User, Configuration


admin.site.register(User)
admin.site.register(Configuration)