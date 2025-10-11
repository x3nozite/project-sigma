from django.db import models
from django.contrib.auth.models import User

class RectCard(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    color = models.CharField()
    id = models.CharField()
    title = models.CharField()
    description = models.CharField()
    dueDate = models.CharField()
    status = models.CharField()

