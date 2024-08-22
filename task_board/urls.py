from django.urls import path
from . import views

app_name = "task_board"
urlpatterns = [
    path("", views.index, name="index"),
]