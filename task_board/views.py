from django.shortcuts import render
from django.http import JsonResponse

from django.views import View

import functions.function as function

# Create your views here.

class IndexView(View):
    def get(self, request):
        return render(request, "task_board/index.html")

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()

def auth(request):
    try:
        headers, user_id, created = function.authorize(request)
        response = JsonResponse({"auth": "success"})
        if created:
            response.set_cookie('user_id', user_id)
    except Exception as e:
        print(f"An error occurred: {e}")
        response = JsonResponse({"auth": "failed", "error": f"{e}"})

    return response

def get_task_board(request):
    try:
        response = JsonResponse(function.get_task_board_data(request),safe=False)
    except Exception as e:
        print(f"An error occurred: {e}")
        response = JsonResponse({"get_task_board": "failed", "error": f"{e}"})

    return response

def update_courses(request):
    try:
        response = JsonResponse(function.update_courses_data(request),safe=False)
    except Exception as e:
        print(f"An error occurred: {e}")
        response = JsonResponse({"update_courses": "failed", "error": f"{e}"})

    return response

def update_coursework(request):
    try:
        response = JsonResponse(function.update_coursework_data(request),safe=False)
    except Exception as e:
        print(f"An error occurred: {e}")
        response = JsonResponse({"update_coursework": "failed", "error": f"{e}"})

    return response

def update_submission(request):
    try:
        response = JsonResponse(function.update_submission_data(request),safe=False)
    except Exception as e:
        print(f"An error occurred: {e}")
        response = JsonResponse({"update_submission": "failed", "error": f"{e}"})

    return response