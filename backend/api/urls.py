from django.urls import path
from . import views

urlpatterns = [
    path("rectcard/", views.RectCardListCreate.as_view(), name="rect-list"),
    path("rectcard/delete/<int:pk>/", views.RectCardDelete.as_view(), name="delete-rect"),
]