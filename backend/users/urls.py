from django.contrib import admin
from django.urls import path, include
from views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register', CreateUserView.as_view(), name = "register")
]