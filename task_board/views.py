from django.shortcuts import render
from django.http import JsonResponse

from django.views import View

from .models import User, Course

from functions.function import authenticate_user

# Create your views here.

class IndexView(View):
    def get(self, request):
        authenticate_user(request)
        response = render(request, "task_board/index.html")
        response.set_cookie('user_id', '106358438524995564112')
        return response

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()

def auth(request):
    _ , user = authenticate_user(request)
    response = JsonResponse({"user": user})
    response.set_cookie('user_id', user.get('user_id'))
    return response

def update_course(request):
    # creds,user = authenticate_user(request)
    # user_id = user.get('user_id')
    # courses = Course.objects.filter(user_id=user_id)
    # course_list = []
    # for course in courses:
    #     course_list.append({
    #         "course_id": course.course_id,
    #         "course_name": course.course_name,
    #         "update_time": course.update_time,
    #         "link": course.link
    #     })
    return JsonResponse({"courses": "course_list"})

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