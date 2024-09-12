from django.shortcuts import render
from django.views import View
from .models import Category, Post, Comment

class IndexView(View):
    def get(self, request):
        return render(request, 'question_board/index.html')

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()
