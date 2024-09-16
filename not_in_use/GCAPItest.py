#%% Googleclassroom APIの認証処理

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

CREDENTIALS_FILE_PATH = "OAuth/credentials.json"
TOKENS_FILE_PATH = "OAuth/tokens/token.json"

def get_courses():
    # If modifying these scopes, delete the file token.json.
    SCOPES = [
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.students",
        "https://www.googleapis.com/auth/classroom.course-work.readonly",
        "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.me",
        "https://www.googleapis.com/auth/classroom.announcements.readonly",
        "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly",
        "https://www.googleapis.com/auth/classroom.rosters.readonly"
        ]
    
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists(TOKENS_FILE_PATH):
        creds = Credentials.from_authorized_user_file(TOKENS_FILE_PATH, SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE_PATH, SCOPES
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(TOKENS_FILE_PATH, "w") as token:
            token.write(creds.to_json())
    try:
        service = build("classroom", "v1", credentials=creds)

        # Call the Classroom API
        results = service.courses()

        if not results:
            print("There are not student account.")
            return
        return results

    except HttpError as error:
        print(f"An error occurred: {error}")

def test():
    # If modifying these scopes, delete the file token.json.
    SCOPES = [
        "https://www.googleapis.com/auth/classroom.courses.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.students",
        "https://www.googleapis.com/auth/classroom.course-work.readonly",
        "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
        "https://www.googleapis.com/auth/classroom.coursework.me",
        "https://www.googleapis.com/auth/classroom.announcements.readonly",
        "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly",
        "https://www.googleapis.com/auth/classroom.rosters.readonly"
        ]
    
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE_PATH, SCOPES
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    try:
        service = build("classroom", "v1", credentials=creds)

        return service

    except HttpError as error:
        print(f"An error occurred: {error}")

def test1():
    service = test()
    course_id = ['709373358268', '704077267531']
    for id in course_id:
        results = service.courses().students().list(courseId=id).execute()
        students = results.get('students', [])
        print(students)
        for student in students:
            print(f"course_id: {id}, Student ID: {student.get('userId')}")

#%% 動作確認
def test2():
    results = get_courses()
    courses = results.list().execute().get("courses", [])
    for course in courses:
        print(course["name"],":",course["id"])

def test3():
    service = test()
    course_id = ['709373358268', '704077267531']
    for id in course_id:
        couse_work = service.courses().courseWork().list(courseId=id).execute()
        print(couse_work)

# print(inspect.getmembers(results.courseWork(), inspect.ismethod))
#%% 課題と授業名を取得
def course_info(course_obj,course_id):
    coursename = course_obj.get(id=course_id).execute().get("name")
    courseworks = course_obj.courseWork().list(courseId=course_id).execute().get("courseWork", [])
    for coursework in courseworks:
        print(coursework["title"])
        print(coursename)

#%% 課題と授業名を取得し、辞書型で返す
def get_coursework_title_and_name():
    coursework_dict = {}
    results = get_courses()
    courses = results.list().execute().get("courses", [])
    for course in courses:
        course_id = course["id"]
        course_name = course["name"]
        courseworks = results.courseWork().list(courseId=course_id).execute().get("courseWork", [])
        coursework_titles = [coursework["title"] for coursework in courseworks]
        coursework_dict[course_name] = coursework_titles

    # 辞書をテンプレートに渡す
    return {"coursework_dict": coursework_dict}



# course_info(results,"645150769353")
# print(get_coursework_title_and_name())
# print(get_courses().list().execute())
# test1()
"""
.get("courses", [])
[
    {'id': '704077267531',
    'name': '焼肉行きたい', 
    'descriptionHeading': '焼肉行きたい', 
    'ownerId': '105125872991741815222', 
    'creationTime': '2024-08-14T05:05:11.123Z', 
    'updateTime': '2024-08-14T05:05:11.123Z', 
    'enrollmentCode': 'azglowc',
    'courseState': 'ACTIVE',
    'alternateLink': 'https://classroom.google.com/c/NzA0MDc3MjY3NTMx',
    'teacherGroupEmail': 'teachers_4c5d9da1@classroom.google.com',
    'courseGroupEmail': '211f1f9d@classroom.google.com',
    'teacherFolder': {
        'id': '1X49xwbfHFo9hSQCYkXGXG9ZlL7u6YtnKfP-Etj5aQoASyA0iTu8PmZXLu8rs8mcPh6d0e5W_',
        'title': '焼肉行きたい',
        'alternateLink': 'https://drive.google.com/drive/folders/1X49xwbfHFo9hSQCYkXGXG9ZlL7u6YtnKfP-Etj5aQoASyA0iTu8PmZXLu8rs8mcPh6d0e5W_'
        },
    'guardiansEnabled': False, 
    'calendarId': 'classroom111404708385815223213@group.calendar.google.com',
    'gradebookSettings': {
        'calculationType': 'TOTAL_POINTS',
        'displaySetting': 'HIDE_OVERALL_GRADE'
        }
    },
    {'id': '709373358268', 
    'name': 'Ti-board',
    'descriptionHeading': 'Ti-board',
    'description': 'Ti-boardのテスト用のクラス',
    'ownerId': '105125872991741815222',
    'creationTime': '2024-08-13T19:31:59.386Z', 
    'updateTime': '2024-08-13T19:37:12.076Z', 
    'enrollmentCode': 'wxf54ct',
    'courseState': 'ACTIVE',
    'alternateLink': 'https://classroom.google.com/c/NzA5MzczMzU4MjY4',
    'teacherGroupEmail': 'Ti_board_teachers_a51fa25f@classroom.google.com',
    'courseGroupEmail': 'Ti_board_e56a31f3@classroom.google.com', 
    'teacherFolder': {
        'id': '1s_HXfqV1ypEgLQeJVhJAarW5g6HSe52M1GSl8YHTt5bWofw3Jj3r6y7-KZNUPbY_rC1kj8m9', 
        'title': 'Ti-board', 
        'alternateLink': 'https://drive.google.com/drive/folders/1s_HXfqV1ypEgLQeJVhJAarW5g6HSe52M1GSl8YHTt5bWofw3Jj3r6y7-KZNUPbY_rC1kj8m9'
        }, 
    'guardiansEnabled': False,
    'calendarId': 'classroom111932100814199978107@group.calendar.google.com',
    'gradebookSettings': {
        'calculationType': 'TOTAL_POINTS',
        'displaySetting': 'HIDE_OVERALL_GRADE'
        }
    }
]"""
"""
{'courses': [
    {'id': '709373358268',
    'name': 'Ti-board', 
    'descriptionHeading': 'Ti-board', 
    'description': 'Ti-boardのテスト用のクラス',
    'ownerId': '105125872991741815222', 
    'creationTime': '2024-08-13T19:31:59.386Z',
    'updateTime': '2024-08-13T19:37:12.076Z', 
    'courseState': 'ACTIVE',
    'alternateLink': 'https://classroom.google.com/c/NzA5MzczMzU4MjY4',
    'teacherGroupEmail': 'Ti_board_teachers_a51fa25f@classroom.google.com', 
    'courseGroupEmail': 'Ti_board_e56a31f3@classroom.google.com', 
    'guardiansEnabled': False, 
    'calendarId': 'classroom111932100814199978107@group.calendar.google.com', 
    'gradebookSettings': {
        'calculationType': 'TOTAL_POINTS', 
        'displaySetting': 'HIDE_OVERALL_GRADE'}
        }
    ]
}

service.method()
methodとして使えるもの
[
    'courses', 授業一覧
    'invitations', 招待中のユーザー一覧
    'new_batch_http_request', 今のプロジェクトでは基本空
    'registrations',
    'userProfiles'
]
"""
