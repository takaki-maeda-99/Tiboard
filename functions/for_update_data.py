import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from django.http import HttpResponse
from datetime import datetime
from zoneinfo import ZoneInfo
import requests

from task_board.models import User, Course, CourseWork

CREDENTIALS_FILE_PATH = "OAuth/credentials.json"
TOKENS_FILE_PATH = "OAuth/tokens/token.json"

SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.course-work.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.me",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.profile.emails"
    ]

def convert_utc_to_jst(utc_date=None, date_dict=None, time_dict=None):
    jst_time = datetime(1970, 1, 1, tzinfo=ZoneInfo("Asia/Tokyo"))
    if utc_date:
        utc_date = datetime.fromisoformat(utc_date.replace('Z', '+00:00'))
        jst_time = utc_date.astimezone(ZoneInfo("Asia/Tokyo"))
    elif date_dict:
        utc_time = datetime(
            date_dict.get('year', 1970),
            date_dict.get('month', 1),
            date_dict.get('day', 1),
            time_dict.get('hours', 0),
            time_dict.get('minutes', 0),
            time_dict.get('seconds', 0),
        )
        utc_time = str(utc_time) + '+00:00'
        jst_time = datetime.fromisoformat(utc_time).astimezone(ZoneInfo("Asia/Tokyo"))
    return jst_time

def set_creds():
    creds = None
    
    if os.path.exists(TOKENS_FILE_PATH):
        creds = Credentials.from_authorized_user_file(TOKENS_FILE_PATH, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE_PATH, SCOPES
            )
            creds = flow.run_local_server(port=0)

        with open(TOKENS_FILE_PATH, "w") as token:
            token.write(creds.to_json())
    return creds

def update_course_data(request):
    creds = set_creds()
    headers = {
        'Authorization': f'Bearer {creds.token}',
        'Accept': 'application/json'
    }
    
    try:
        courses = get_courses(headers)
        current_course_ids = []
        current_user_ids = []
        
        for course in courses:
            course_id = course.get('id')
            current_course_ids.append(course_id)
            
            students = get_students(headers, course_id)
            current_user_ids = process_students(students)
            
            course_instance = save_or_update_course(course, course_id, current_user_ids)
            
            course_works = get_course_work(headers, course_id)
            process_coursework(course_works, course_instance, headers)
        
        delete_unused_data(current_course_ids, current_user_ids)
        
        return HttpResponse('Course data updated successfully.')

    except requests.exceptions.RequestException as error:
        print(f"An error occurred: {error}")
        return HttpResponse('Failed to update course data due to API error.', status=500)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return HttpResponse('Failed to update course data due to unexpected error.', status=500)

def get_courses(headers):
    url = "https://classroom.googleapis.com/v1/courses?fields=courses(name,id,updateTime,alternateLink)"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json().get("courses", [])

def get_students(headers, course_id):
    url = f"https://classroom.googleapis.com/v1/courses/{course_id}/students"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json().get('students', [])

def process_students(students):
    current_user_ids = []
    
    for student in students:
        user_id = student.get('userId')
        current_user_ids.append(user_id)
        
        user, _ = User.objects.get_or_create(
            user_id=user_id,
        )
        user.save()
    
    return current_user_ids

def save_or_update_course(course, course_id, current_user_ids):
    user = User.objects.get(user_id__in=current_user_ids)
    
    course_instance, _ = Course.objects.update_or_create(
        course_id=course_id,
        defaults={
            'user_id': user,
            'course_name': course.get('name'),
            'update_time': course.get('updateTime'),
            'link': course.get('alternateLink') or "No link available",
        }
    )
    course_instance.save()
    
    return course_instance

def get_course_work(headers, course_id):
    url = f"https://classroom.googleapis.com/v1/courses/{course_id}/courseWork"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json().get('courseWork', [])

def process_coursework(course_works, course_instance, service):
    current_coursework_ids = [work.get('id') for work in course_works]
    existing_courseworks = CourseWork.objects.filter(course_id=course_instance)
    existing_coursework_ids = list(existing_courseworks.values_list('course_work_id', flat=True))
    
    to_delete_coursework_ids = set(existing_coursework_ids) - set(current_coursework_ids)
    if to_delete_coursework_ids:
        CourseWork.objects.filter(course_work_id__in=to_delete_coursework_ids).delete()
    
    for work in course_works:
        submissions = get_submissions(service, course_instance.course_id, work.get('id'))
        
        for submission in submissions:
            save_or_update_coursework(work, submission, course_instance)

def get_submissions(headers, course_id, course_work_id):
    url = f"https://classroom.googleapis.com/v1/courses/{course_id}/courseWork/{course_work_id}/studentSubmissions"
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json().get('studentSubmissions', [])

def save_or_update_coursework(work, submission, course_instance):
    coursework_instance, _ = CourseWork.objects.update_or_create(
        course_id=course_instance,
        course_work_id=work.get('id'),
        defaults={
            'course_work_title': work.get('title', "No title"),
            'description': work.get('description', "No description"),
            'materials': str(work.get('materials', "No materials")),
            'link': work.get('alternateLink', "No link"),
            'update_time': convert_utc_to_jst(utc_date=work.get('updateTime')),
            'due_time': convert_utc_to_jst(date_dict=work.get('dueDate'), time_dict=work.get('dueTime')),
            'creation_time': convert_utc_to_jst(utc_date=work.get('creationTime')),
            'state': submission.get('state'),
            'late': submission.get('late', False)
        }
    )
    coursework_instance.save()

def delete_unused_data(current_course_ids, current_user_ids):
    existing_course_ids = list(Course.objects.values_list('course_id', flat=True))
    existing_user_ids = list(User.objects.values_list('user_id', flat=True))
    
    to_delete_course_ids = set(existing_course_ids) - set(current_course_ids)
    to_delete_user_ids = set(existing_user_ids) - set(current_user_ids)
    
    if to_delete_course_ids:
        Course.objects.filter(course_id__in=to_delete_course_ids).delete()
    if to_delete_user_ids:
        User.objects.filter(user_id__in=to_delete_user_ids).delete()

"""def get_data_from_db():
    courses = Course.objects.all()
    users = User.objects.all()
    courseworks = CourseWork.objects.all()

    return courses, users, courseworks

print(get_data_from_db())"""