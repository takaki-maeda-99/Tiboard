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
test_coursework_due_time = "2024-07-18T01:05:33.759Z"
test_submission_state = "test_submission_state"
test_submission_created_time = "2024-07-18T01:05:33.759Z"

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
            "dueTime": test_coursework_due_time
        })
        response = JsonResponse({"insert": "success"})
    except Exception as e:
        print(f"An error occurred: {e}")
        response = JsonResponse({"insert": "failed", "error": f"{e}"})
    return response

def update_course_work(request):
    # user = authenticate_user(request)
    # user_id = user.get('user_id')
    # course = Course.objects.get(course_id=course_id, user_id=user_id)
    # course_works = course.course_ids.all()
    # course_work_list = []
    # for course_work in course_works:
    #     course_work_list.append({
    #         "course_work_id": course_work.course_work_id,
    #         "course_work_title": course_work.course_work_title,
    #         "description": course_work.description,
    #         "materials": course_work.materials,
    #         "link": course_work.link,
    #         "update_time": course_work.update_time,
    #         "due_time": course_work.due_time,
    #         "creation_time": course_work.creation_time,
    #         "state": course_work.state,
    #         "late": course_work.late,
    #     })
    return JsonResponse({"course_works": "course_work_list"})