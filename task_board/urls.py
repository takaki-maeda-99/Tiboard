from django.urls import path
from . import views


app_name = "task_board"
urlpatterns = [
    path("", views.index, name="index"),
    path("get_task_board/", views.get_task_board, name="get_task_board"),
    path("update_courses/", views.update_courses, name="update_courses"),
    path("update_coursework/", views.update_coursework, name="update_coursework"),
    path("update_submission/", views.update_submission, name="update_submission"),
]