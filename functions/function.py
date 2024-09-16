from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

import functions.classroom as classroom
import functions.database as database

from datetime import datetime
from zoneinfo import ZoneInfo

# If modifying these scopes, delete the file token.json.
SCOPES = [
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.students",
        "https://www.googleapis.com/auth/classroom.course-work.readonly",
        "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.me",
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
    
    # cookieを使ってユーザーの情報を取得する
    user_id = request.COOKIES['user_id']
    
    creds = Credentials.from_authorized_user_file(f"{TOKENS_FILE_PATH}/{user_id}token.json", SCOPES)
    
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    
    return creds, user_id

def get_task_board_data(request):
    user_id = request.COOKIES['user_id']
    courses = database.get_courses_from_db(user_id)
    courses = list(courses.values())
    courseworkss = database.get_courseworkss_from_db(user_id)
    courseworkss = [list(courseworks.values()) for courseworks in courseworkss]
    submission = database.get_submissions_from_db(user_id)
    submission = list(submission.values())
    return [courses, courseworkss, submission]

def update_courses_data(request):
    creds, user_id = set_or_create_creds(request)
    
    headers = {"Authorization": f"Bearer {creds.token}"}

    courses = classroom.request_courses_info(headers)
    
    for course in courses:
        database.insert_course_to_db(course)
    
    response = database.get_courses_from_db(user_id)
    
    response = list(response.values())
    
    return response

def update_coursework_data(request):
    creds, user_id = set_or_create_creds(request)
    
    headers = {"Authorization": f"Bearer {creds.token}"}
    
    courses = database.get_courses_from_db(user_id)
    courses = list(courses.values())
    
    course_ids = [course['course_id'] for course in courses]
    
    course_workss = classroom.async_request_courseWork_info(headers, course_ids)
    
    for course_id, course_works in zip(course_ids, course_workss):
        for course_work in course_works:
            database.insert_coursework_to_db(course_id, course_work)
    
    response = database.get_courseworkss_from_db(user_id)
    
    response = [list(courseworks.values()) for courseworks in response]
    
    return response

def update_submission_data(request):
    creds, user_id = set_or_create_creds(request)
    
    headers = {"Authorization": f"Bearer {creds.token}"}
    
    courseworkss = database.get_courseworkss_from_db(user_id)
    
    course_and_coursework_ids = []
    
    now = datetime(2024, 7, 15, 12, 0, 0, tzinfo=ZoneInfo("Asia/Tokyo"))

    for courseworks in courseworkss:
        for coursework in courseworks:
            coursework_due_time = coursework.due_time
            if coursework_due_time is not None:
                if coursework_due_time < now:
                    continue
            course_and_coursework_ids.append((coursework.course_id.course_id, coursework.coursework_id))
            
    submissions = classroom.async_request_submissions_info(headers, course_and_coursework_ids)
    
    for (course_id, coursework_id), submission in zip(course_and_coursework_ids, submissions):
        database.insert_submission_state(user_id, course_id, coursework_id, submission)
    
    response = database.get_submissions_from_db(user_id)
    
    response = list(response.values())
    
    return response