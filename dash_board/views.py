from django.shortcuts import render
from django.views import View

from functions.GCAPItest import get_coursework_title_and_name
from functions.for_update_data import update_course_data

# Create your views here.


class IndexView(View):
    def get(self, request):
        update_course_data(request)
        return render(request, "dash_board/frontpage.html", get_coursework_title_and_name())

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()