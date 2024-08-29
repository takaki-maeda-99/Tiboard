from django.shortcuts import render
from django.http import JsonResponse

from django.views import View

from .models import User, Course

import functions.function as function
import functions.database as database

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
        response = JsonResponse({"task_board_data": "failed", "error": f"{e}"})

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




# -------------------------------test--------------------------------

# test_data
test_user_id = "test_user_id"
test_user_email = "test_user_email"
test_course_id = "test_course_id"
test_course_name = "test_course_name"
test_course_link = "test_course_link"
test_coursework_id = "test_coursework_id"
test_coursework_title = "test_coursework_title"
test_coursework_description = "test_coursework_description"
test_coursework_materials = "test_coursework_materials"
test_coursework_link = "test_coursework_link"
test_coursework_update_time = "2024-07-18T01:05:33.759Z"
test_coursework_due_date = {'year': 2024, 'month': 7, 'day': 18}
test_coursework_due_time = {'hours': 18, 'minutes': 59}
test_submission_state = "test_submission_state"
test_submission_created_time = "2024-07-18T05:05:33.759Z"

def test_insert_to_db(request):
    try:
        database.insert_user_to_db(test_user_id, test_user_email)
        database.insert_course_to_db(test_user_id, {
            "id": test_course_id,
            "name": test_course_name,
            "alternateLink": test_course_link
        })
        database.insert_coursework_to_db(test_user_id, test_course_id, {
            "id": test_coursework_id,
            "title": test_coursework_title,
            "description": test_coursework_description,
            "materials": test_coursework_materials,
            "alternateLink": test_coursework_link,
            "updateTime": test_coursework_update_time,
            "dueDate": test_coursework_due_date,
            "dueTime": test_coursework_due_time
        })
        database.update_submission_state(test_user_id, test_course_id, test_coursework_id, {
            "state": test_submission_state,
            "creationTime": test_submission_created_time
        })
        response = JsonResponse({"insert": "success"})
    except Exception as e:
        print(f"An error occurred: {e}")
        response = JsonResponse({"insert": "failed", "error": f"{e}"})
    return response