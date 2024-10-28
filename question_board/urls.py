from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = "question_board"
urlpatterns = [
    path('', views.index, name='index'),
    path('thread_list/', views.thread_list, name='thread_list'),
    path('thread/<int:thread_id>/', views.thread_detail, name='thread_detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)