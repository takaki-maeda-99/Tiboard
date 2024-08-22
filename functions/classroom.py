import os.path
import requests

from datetime import datetime
from zoneinfo import ZoneInfo

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError



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
TOKENS_FILE_PATH = "OAuth/tokens/token.json"

COURSE_INFO_FIELDS = "courses(name,id,updateTime)"
COURSEWORK_INFO_FIELDS = "courseWork(title,id,updateTime)"

def create_creds(userId = ""):
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    
    creds = None

    if os.path.exists(f"{TOKENS_FILE_PATH}/{userId}token.json"):
        creds = Credentials.from_authorized_user_file(f"{TOKENS_FILE_PATH}/{userId}token.json", SCOPES)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        
        # Refresh the token if it has expired
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        
        # If there are no credentials available, let the user log in.
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE_PATH, SCOPES
            )
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for the next run
        with open(f"{TOKENS_FILE_PATH}/{userId}token.json", "w") as token:
            token.write(creds.to_json())
            
    return creds

def rename_creds(userId = ""):
    # Rename the token file to the userId
    os.rename(f"{TOKENS_FILE_PATH}/token.json", f"{TOKENS_FILE_PATH}/{userId}token.json")

def get_user_info(creds):
    # set the headers for the request to the Google Classroom API with the access token
    headers = {
        'Authorization': f'Bearer {creds.token}',
    }
    
    response = requests.get(f"https://people.googleapis.com/v1/people/me?personFields=emailAddresses", headers=headers).json()
    response1 = response.get("emailAddresses", [])
    
    return response1

def get_courses_info(creds):
    # set the headers for the request to the Google Classroom API with the access token
    headers = {
        'Authorization': f'Bearer {creds.token}',
    }
    
    response = requests.get(f"https://classroom.googleapis.com/v1/courses?fields={COURSE_INFO_FIELDS}", headers=headers).json()
    response = response.get("courses", [])
    
    return response

def get_courseWork_info(creds, courseId="709373358268"):
    # set the headers for the request to the Google Classroom API with the access token
    headers = {
        'Authorization': f'Bearer {creds.token}',
    }
    
    response = requests.get(f"https://classroom.googleapis.com/v1/courses/{courseId}/courseWork?fields={COURSEWORK_INFO_FIELDS}", headers=headers).json()
    response = response.get("courseWork", [])
    
    return response

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


import aiohttp
import asyncio

from task_board.models import User, Course, CourseWork

async def execute(func, *args):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, func, *args)

async def get_all_courseWork_info(creds, userId):

    course_ids = Course.objects.filter(user_id=userId)
    
    
    tasks = [
        
    ]

    # 全てのタスクを非同期で実行
    results = await asyncio.gather(*tasks)

    for result in results:
        print(result)

def test_run():
    creds = create_creds()
    print(get_user_info(creds)[0]["value"])
    user, created = User.objects.get_or_create(
                email=get_user_info(creds)[0]["value"]
                )
    user.save()
    
    # User.objects.all().delete()
    # print(get_user_info(creds)[0]["value"])
    # print(get_user_info(creds)[0]["metadata"]["source"]["id"])
    # print(get_courses_info(creds))
    # print(Course.objects.filter(user_id="110298044136430036008"))
    # print(Course.objects.all())
    


# asyncio.run(main(creds))