from django.urls import path
from . import views

app_name = "question_board"
urlpatterns = [
    path('', views.index, name='index'),
    path('thread/<int:thread_id>/', views.thread_detail, name='thread_detail'),
    # path('get_thread/<int:thread_id>/', views.get_thread, name='get_thread'),
]