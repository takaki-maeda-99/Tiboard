from django.urls import path
from . import views

app_name = "dash_board"
urlpatterns = [
    path("", views.index, name="index"),
    path('auth/', views.auth, name='auth'),
    path('google/login/', views.google_login, name='google_login'),
    path('google/callback/', views.google_callback, name='google_callback'),
]
