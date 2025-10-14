from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class RectCard(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    color = models.CharField(max_length=255)
    id = models.CharField(primary_key=True, max_length=255)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    dueDate = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rectCard")

    """def __str__(self):
        return self.id"""

