from django.urls import path
from . import views

app_name = "task_board"
urlpatterns = [
    path("", views.index, name="task_board"),
    path("get_tasks/", views.get_tasks, name="get_task_board"),
    path("update_courses/", views.update_courses, name="update_courses"),
    path("update_coursework/", views.update_courseworks, name="update_coursework"),
    path("update_submission/", views.update_submissions, name="update_submission"),
]