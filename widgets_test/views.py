from django.shortcuts import render

from django.views import View

# Create your views here.

class IndexView(View):
    def get(self, request):
        
        return render(request, "widgets_test/index.html")
index = IndexView.as_view()
