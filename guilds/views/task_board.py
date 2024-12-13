from django.shortcuts import render
from django.views import View
from django.http import JsonResponse

from django.contrib.auth.decorators import login_required
from functions.function import Function as func

@login_required
def get_tasks(request):
    isinstance = func(request)
    return JsonResponse(isinstance.get_tasks(request), safe=False)

@login_required
def update_courses(request):
    isinstance = func(request)
    return JsonResponse(isinstance.update_courses(request), safe=False)

@login_required
def update_courseworks(request):
    isinstance = func(request)
    return JsonResponse(isinstance.update_courseworks(request), safe=False)

@login_required
def update_submissions(request):
    isinstance = func(request)
    return JsonResponse(isinstance.update_submissions(request), safe=False)