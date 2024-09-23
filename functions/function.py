from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

import functions.classroom as classroom
import functions.database as database

from datetime import datetime, timedelta
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
    
    courseworks = database.get_assignments_from_db(user_id)
    
    course_and_coursework_ids = []
    return_coursework_ids = []
    
    now = datetime.now(ZoneInfo("Asia/Tokyo"))

    for coursework in courseworks:
        coursework_due_time = coursework.due_time
        if coursework_due_time is not None:
            if coursework_due_time < now:
                continue
            return_coursework_ids.append(coursework.id)
            course_and_coursework_ids.append((coursework.course_id.course_id, coursework.coursework_id))
                
    submissions = classroom.async_request_submissions_info(headers, course_and_coursework_ids)
    
    for (course_id, coursework_id), submission in zip(course_and_coursework_ids, submissions):
        if submission.get("error", None) is not None:
            database.remove_coursework_from_user(user_id, coursework_id)
            continue
        database.insert_submission_state(user_id, course_id, coursework_id, submission)
    
    response = database.get_submissions_from_db(user_id)
    
    response = list(response.values())
    
    response = [submission for submission in response if submission["coursework_id_id"] in return_coursework_ids]
    
    return response

import time

def update_polling():
    start_time = time.time()
    
    courses = database.get_all_courses_from_db()
    headerss = []
    
    for course in courses:
        enrolled_users = database.get_users_from_course(course.course_id)
        enrolled_first_user_id = list(enrolled_users.values())[0]["user_id"]
        creds = Credentials.from_authorized_user_file(f"{TOKENS_FILE_PATH}/{enrolled_first_user_id}token.json", SCOPES)
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        headers = {"Authorization": f"Bearer {creds.token}"}
        headerss.append(headers)
    
    course_ids = [course.course_id for course in courses]
    course_workss = classroom.async_request_all_courseWork_info(headerss, course_ids)
    
    for course_id, course_works in zip(course_ids, course_workss):
            for course_work in course_works:
                database.insert_coursework_to_db(course_id, course_work)
    
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"update_polling 実行時間: {execution_time}秒")
    
def get_tasks_data(request):
    user_id = request.COOKIES['user_id']
    tasks = database.get_tasks_from_db(user_id)
    return tasks

def calc_scores(tasks):
    K = 0.01
    scores = []
    for task in tasks:
        time_to_due = max(task['due_time'] - task['publish_time'], timedelta(seconds=1)) 
        turn_in_time = task['due_time'] - task['submission_created_time'] if task["submission_state"] == "TURNED_IN" else timedelta(seconds=0)
        score_rate = turn_in_time.total_seconds() / time_to_due.total_seconds()
        score_max = round(time_to_due.total_seconds()*K)
        score = {
            "score_rate": score_rate, 
            "score_max": score_max,
            "score": round(score_rate * score_max),
            "course_name": task['course_name'],
            "coursework_title": task['coursework_title'],
            "submission_state": task['submission_state']
        }
        scores.append(score)

    return scores

def update_assignments(request):
    creds, user_id = set_or_create_creds(request)
    
    headers = {"Authorization": f"Bearer {creds.token}"}
    
    course_ids = database.get_courses_from_db(user_id)
    
    course_ids = [course.course_id for course in course_ids]
    
    courseworkss = classroom.async_request_courseWork_info(headers, course_ids)
    
    for course_works in courseworkss:
        for course_work in course_works:
            database.add_coursework_to_user(user_id, course_work["id"])
    
    assignments = database.get_assignments_from_db(user_id)
    
    response = list(assignments.values())
    
    return response