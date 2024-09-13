from django.urls import path
from . import views

app_name = "question_board"
urlpatterns = [
    path('', views.index, name='index'),
    path('category/<uuid:category_id>/', views.category_detail, name='category_detail'),
    path('post/<uuid:post_id>/', views.post_detail, name='post_detail'),
]