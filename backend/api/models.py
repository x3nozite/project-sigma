from django.db import models
from django.contrib.auth.models import User

class RectCard(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    color = models.CharField()
    id = models.CharField(primary_key=True)
    title = models.CharField()
    description = models.CharField()
    dueDate = models.CharField()
    status = models.CharField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rectCard")

    """def __str__(self):
        return self.id"""

