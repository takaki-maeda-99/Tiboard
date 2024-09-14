from django.shortcuts import render
from django.views import View

from functions.GCAPItest import get_coursework_title_and_name
from functions.for_update_data import update_course_data

# Create your views here.

class IndexView(View):
    def get(self, request):
        return render(request, "dash_board/frontpage.html")

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()

from django.shortcuts import redirect, render
from google_auth_oauthlib.flow import Flow
from django.conf import settings
from django.urls import reverse
import os

# Google OAuth 2.0のクライアント設定
CREDENTIALS_FILE_PATH = "OAuth/credentials.json"
CREDENTIALS_FILE_ABSOLUTE_PATH = os.path.join(settings.BASE_DIR, CREDENTIALS_FILE_PATH)
TOKENS_FILE_PATH = "OAuth/tokens"

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

import functions.classroom as classroom
import functions.database as database

def google_login(request):
    # Google OAuth Flowを初期化
    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE_ABSOLUTE_PATH,
        scopes=SCOPES,
        redirect_uri=request.build_absolute_uri(reverse('dash_board:google_callback'))
    )

    # 認証URLを生成してリダイレクト
    authorization_url, state = flow.authorization_url()
    request.session['state'] = state
    return redirect(authorization_url)

def google_callback(request):
    # Google OAuth Flowを初期化
    flow = Flow.from_client_secrets_file(
        CREDENTIALS_FILE_ABSOLUTE_PATH,
        scopes=SCOPES,
        redirect_uri=request.build_absolute_uri(reverse('dash_board:google_callback'))
    )

    # 認証URLからトークンを取得
    flow.fetch_token(authorization_response=request.build_absolute_uri())

    if not request.session['state'] == request.GET.get('state'):
        return redirect('dash_board:google_login')  # 状態が一致しない場合はリトライ

    # 認証情報を取得
    creds = flow.credentials
    
    headers = {"Authorization": f"Bearer {creds.token}"}
    
    response = classroom.async_request_user_and_course_info(headers)
    
    print(response)
    
    user_info = response[0]
    courses = response[1]
    
    user_id = user_info.get("user_id", "")
    user_email = user_info.get("user_email", "")
    
    database.insert_user_to_db(user_id, user_email)
    
    for course in courses:
        database.insert_course_to_db(course)
        database.add_course_to_user(user_id, course.get("id", ""))
    
    with open(f"{TOKENS_FILE_PATH}/{user_id}token.json", "w") as token:
            token.write(creds.to_json())
    
    return redirect('dash_board:index')
