from django.http import JsonResponse
from django.views import View
from .forms import EmailForm

# Create your views here.

class IndexView(View):
    def get(self, request):
        return render(request, "dash_board/frontpage.html")

class AuthView(View):
    def get(self, request):
        try:
            if request.GET.get('regist', 'false') == 'true':
                redirect_url = f"{settings.BASE_URL}/google/login/"
                return redirect(redirect_url)
            
            next_url = request.GET.get('next', '/') + "?auth=success"
            
            # セキュリティ対策として、next_urlが許可されたホストのものであるか確認
            from django.utils.http import url_has_allowed_host_and_scheme
            if not url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
                next_url = '/'
            
            user_id = request.COOKIES['user_id']
            database.get_courses_from_db(user_id)
            if not os.path.exists(f"{TOKENS_FILE_PATH}/{user_id}token.json"):
                raise FileNotFoundError
            
            response = redirect(next_url)
            return response
        except FileNotFoundError:
            redirect_url = f"{settings.BASE_URL}/google/login/"
            return redirect(redirect_url)
        except Exception as e:
            print(f"(auth) An error occurred: {e}")
            form = EmailForm()
            return render(request, "dash_board/login.html", {"form": form})
            
    def post(self, request):
            form = EmailForm(request.POST)
            if form.is_valid():
                user_email = form.cleaned_data['user_email']
                try:
                    user_id = database.get_user_id_from_email(user_email)
                    response = redirect(f"{settings.BASE_URL}/auth")
                    response.set_cookie('user_id', user_id)
                    return response
                except Exception as e:
                    form.add_error('user_email', 'User not found')
                    return render(request, "dash_board/login.html", {"form": form})
            else:
                return render(request, "dash_board/login.html", {"form": form})
            

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()
auth = AuthView.as_view()

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

    # セッションから不要になったデータを削除
    request.session.pop('state', None)

    # 認証情報を取得
    creds = flow.credentials
    
    headers = {"Authorization": f"Bearer {creds.token}"}
    
    user_and_course_info = classroom.async_request_user_and_course_info(headers)
    
    user_info = user_and_course_info[0]
    courses = user_and_course_info[1]
    
    user_id = user_info.get("user_id", "")
    user_email = user_info.get("user_email", "")
    
    database.insert_user_to_db(user_id, user_email)
    
    for course in courses:
        database.insert_course_to_db(course)
        database.add_course_to_user(user_id, course.get("id", ""))
    
    with open(f"{TOKENS_FILE_PATH}/{user_id}token.json", "w") as token:
            token.write(creds.to_json())

    auth_url = f"{settings.BASE_URL}/auth"
    
    response = redirect(auth_url)
    response.set_cookie('user_id', user_id)

    # 元のページにリダイレクト
    return response
