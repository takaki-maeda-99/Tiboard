from django.shortcuts import render
from django.views import View


# Create your views here.

class IndexView(View):
    def get(self, request):
        scores = [
            {"id": 1, "name": "Alice", "score": 100, "created_at": "2021-01-01", "updated_at": "2021-01-01"},
            {"id": 2, "name": "Bob", "score": 200, "created_at": "2021-01-01", "updated_at": "2021-01-01"},
            {"id": 3, "name": "Charlie", "score": 300, "created_at": "2021-01-01", "updated_at": "2021-01-01"},
        ]
        return render(request, 'score_board/index.html',{"scores": scores})

index = IndexView.as_view()