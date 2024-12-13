from django.urls import path
from django.views.generic import TemplateView
from . import views

from django.conf import settings
from django.conf.urls.static import static

app_name = "guilds"
urlpatterns = [
    path("task_board/", TemplateView.as_view(template_name="task_board/index.html"), name="task_board"),
    path("get_tasks/", views.get_tasks, name="get_task_board"),
    path("update_courses/", views.update_courses, name="update_courses"),
    path("update_coursework/", views.update_courseworks, name="update_coursework"),
    path("update_submission/", views.update_submissions, name="update_submission"),
    
    path('question_board/', TemplateView.as_view(template_name="question_board/index.html"), name='question_board'),
    path('question_board/thread_list/', views.thread_list, name='thread_list'),
    path('question_board/get_thread/<int:thread_id>', views.get_thread, name='get_thread'),
    path('question_board/thread/<int:thread_id>/', views.thread_detail, name='thread_detail'),
    
    path("test/", TemplateView.as_view(template_name="widgets_test/index.html"), name="test"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)