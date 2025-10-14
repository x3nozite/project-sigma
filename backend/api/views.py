from django.shortcuts import render
# from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import RectCardSerializer
from users.serializers import UserSerializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import RectCard
from django.contrib.auth import get_user_model
User = get_user_model()


class RectCardListCreate(generics.ListCreateAPIView):
    serializer_class = RectCardSerializer
    queryset = RectCard.objects.all()
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # Optionally set author if user is authenticated
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            serializer.save()


class RectCardDelete(generics.DestroyAPIView):
    queryset = RectCard.objects.all()
    serializer_class = RectCardSerializer
    permission_classes = [AllowAny]
    

    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]
