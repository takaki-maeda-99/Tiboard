from django.urls import path
from . import views


app_name = "task_board"
urlpatterns = [
    path("", views.index, name="index"),
    path("auth/", views.auth, name="auth"),
    path("test/", views.test_insert_to_db, name="test"),
    path("update_courseWork/", views.update_course_work, name="update_course_work"),
]