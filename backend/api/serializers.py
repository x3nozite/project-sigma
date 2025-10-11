from django.contrib.auth.models import User
from rest_framework import serializers
from .models import RectCard

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class RectCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = RectCard
        fields = [
            "x", 
            "y",
            "width",
            "height",
            "color",
            "id",
            "title", 
            "description", 
            "dueDate",
            "status",
            "author"
        ]
        extra_kwargs = {"author": {"read_only": True}}