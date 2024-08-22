from django.shortcuts import render
from django.views import View

from .models import User, Course

# Create your views here.

class IndexView(View):
    def get(self, request):
        print(Course.objects.filter(user__user_id="105125872991741815222"))
        return render(request, "task_board/index.html")

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()