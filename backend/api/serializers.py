from django.contrib.auth.models import User
from rest_framework import serializers
from .models import RectCard


    

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