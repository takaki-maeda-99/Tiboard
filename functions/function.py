import os.path
import requests

from datetime import datetime
from zoneinfo import ZoneInfo

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

COURSE_INFO_FIELDS = "courses(name,id,updateTime)"
COURSEWORK_INFO_FIELDS = "courseWork(title,id,updateTime)"

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

