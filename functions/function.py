from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from task_board.models import User, Course, CourseWork

import functions.classroom as classroom
import functions.database as database

# If modifying these scopes, delete the file token.json.
SCOPES = [
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.students",
        "https://www.googleapis.com/auth/classroom.course-work.readonly",
        "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.me",
        "https://www.googleapis.com/auth/classroom.announcements.readonly",
        "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly",
        "https://www.googleapis.com/auth/classroom.rosters.readonly",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        'openid',
        ]

CREDENTIALS_FILE_PATH = "OAuth/credentials.json"
TOKENS_FILE_PATH = "OAuth/tokens"

def set_or_create_creds(request):
    
    creds = None
    user_id = None
    created = False
    
    try:
        # cookieを使ってユーザーの情報を取得する
        user_id = request.COOKIES['user_id']
        
        creds = Credentials.from_authorized_user_file(f"{TOKENS_FILE_PATH}/{user_id}token.json", SCOPES)
        
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        
        if not creds or not creds.valid:
            raise KeyError
    
    except (KeyError, FileNotFoundError):
        
        flow = InstalledAppFlow.from_client_secrets_file(
            CREDENTIALS_FILE_PATH, SCOPES
        )
        creds = flow.run_local_server(port=0)
        
        created = True
    
    return creds, user_id, created

def authorize(request):
    creds, user_id, created = set_or_create_creds(request)
    
    headers = {"Authorization": f"Bearer {creds.token}"}
    
    if created:
        user_info = classroom.request_person_info(headers)
        
        user_id = user_info["user_id"]
        user_email = user_info["user_email"]
        
        database.insert_user_to_db(user_id, user_email)
        
        with open(f"{TOKENS_FILE_PATH}/{user_id}token.json", "w") as token:
            token.write(creds.to_json())
    
    return headers, user_id, created

def get_task_board_data(request):
    user_id = request.COOKIES['user_id']
    courses = database.get_courses_from_db(user_id)
    courses = list(courses.values())
    return courses

def update_courses_data(request):
    creds, user_id, _ = set_or_create_creds(request)
    
    headers = {"Authorization": f"Bearer {creds.token}"}

    courses = classroom.request_courses_info(headers)
    
    for course in courses:
        database.insert_course_to_db(user_id, course)
    
    return courses

def update_coursework_data(request):
    creds, user_id, _ = set_or_create_creds(request)
    
    headers = {"Authorization": f"Bearer {creds.token}"}
    
    courses = database.get_courses_from_db(user_id)
    courses = list(courses.values())
    
    course_ids = [course['course_id'] for course in courses]
    
    course_workss = classroom.async_request_courseWork_info(headers, course_ids)
    
    for course_id, course_works in zip(course_ids, course_workss):
        for course_work in course_works:
            database.insert_coursework_to_db(user_id, course_id, course_work)
    
    return course_workss