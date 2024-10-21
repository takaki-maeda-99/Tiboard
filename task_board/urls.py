from django.urls import path
from django.views.generic import TemplateView
from . import views

app_name = "task_board"
urlpatterns = [
    path("", TemplateView.as_view(template_name="task_board/index.html"), name="index"),
    path("get_tasks/", views.get_tasks, name="get_task_board"),
    path("update_courses/", views.update_courses, name="update_courses"),
    path("update_coursework/", views.update_courseworks, name="update_coursework"),
    path("update_submission/", views.update_submissions, name="update_submission"),
]