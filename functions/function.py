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

def get_user_info(creds):
    # classroomAPIを使ってユーザーの情報を取得する
    # 入力：creds（Credentials）, 出力: user_id, user_mail (dict)
    
    headers = {
        'Authorization': f'Bearer {creds.token}',
    }
    
    try:
        response = requests.get(f"https://people.googleapis.com/v1/people/me?personFields=emailAddresses", headers=headers).json()
        user_info = response.get("emailAddresses", [])[0]
        user_id = user_info["metadata"]["source"]["id"]
        user_mail = user_info["value"]
    except Exception as e:
        print(f"An error occurred: {e}")
        return []
    
    return {"id": user_id, "mail": user_mail}

def get_courses_info(creds):
    # set the headers for the request to the Google Classroom API with the access token
    headers = {
        'Authorization': f'Bearer {creds.token}',
    }
    
    try:
        response = requests.get(f"https://classroom.googleapis.com/v1/courses?fields={COURSE_INFO_FIELDS}", headers=headers).json()
        courses_info = response.get("courses", [])
    except Exception as e:
        print(f"An error occurred: {e}")
        return []
    
    return courses_info
    

def authenticate_user(request):
    
    user_id = None

    creds = None
    
    try:
        # cookieを使ってユーザーの情報を取得する
        user_id = request.COOKIES['user_id']
        
        # データベースにユーザーが存在するか確認する
        user = User.objects.get(user_id=user_id)
        
        # トークンファイルが存在する場合は、それを使って認証する
        if os.path.exists(f"{TOKENS_FILE_PATH}/{user_id}token.json"):
            creds = Credentials.from_authorized_user_file(f"{TOKENS_FILE_PATH}/{user_id}token.json", SCOPES)
        
        # トークンファイルが存在しない、またはトークンが無効な場合は、新しいトークンを取得する
        if not creds or not creds.valid:
            raise KeyError
        
    except KeyError or FileNotFoundError or User.DoesNotExist:
        # Refresh the token if it has expired
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE_PATH, SCOPES
            )
            creds = flow.run_local_server(port=0)
            
            user_info = get_user_info(creds)
            
            user_id = user_info["id"]
            user_mail = user_info["mail"]
            
            user = User(user_id=user_id, user_mail=user_mail)
            user.save()
            
            # Save the credentials for the next run
            with open(f"{TOKENS_FILE_PATH}/{user_id}token.json", "w") as token:
                token.write(creds.to_json())
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return None, None
    
    return creds, {"id": user.user_id, "mail": user.user_mail}