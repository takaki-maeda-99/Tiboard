from django.urls import path, include
from django.views.generic import TemplateView

from .views import question_board
from .views import task_board

from django.conf import settings
from django.conf.urls.static import static

app_name = "guilds"

task_board_patterns = [
    path("", TemplateView.as_view(template_name="task_board/index.html"), name="index"),
    path("get_tasks/", task_board.get_tasks, name="get_tasks"),
    path("update_courses/", task_board.update_courses, name="update_courses"),
    path("update_coursework/", task_board.update_courseworks, name="update_coursework"),
    path("update_submission/", task_board.update_submissions, name="update_submission"),
]

question_board_patterns = [
    path("", TemplateView.as_view(template_name="question_board/index.html"), name="index"),
    path("thread_list/", question_board.thread_list, name="thread_list"),
    path("get_thread/<int:thread_id>/", question_board.get_thread, name="get_thread"),
    path("post_post/", question_board.post_post, name="post_post"),
    path("thread/<int:thread_id>/", question_board.thread_detail, name="thread_detail"),
]

urlpatterns = [
    path("task_board/", include((task_board_patterns, "task_board"))),
    path("question_board/", include((question_board_patterns, "question_board"))),
    path("test/", TemplateView.as_view(template_name="widgets_test/index.html"), name="test"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)