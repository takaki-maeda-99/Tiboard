from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from .classroom import Classroom

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from allauth.socialaccount.models import SocialToken, SocialAccount

from .database import Database

def judge_expired(coursework, request):
        all = request.GET.get('all', False)
        if coursework.due_time is None:
            return True
        if all:
            return False
        now = datetime.now(ZoneInfo("Asia/Tokyo"))
        return coursework.due_time < now

class Function:
    def __init__(self, request):
        self.user = request.user
        self.social_account = SocialAccount.objects.get(user=request.user)
        self.user_id = self.social_account.uid
        social_token = SocialToken.objects.get(account__user=request.user, account__provider='google')
        creds = Credentials(
            social_token.token,
            refresh_token=social_token.token_secret,
            token_uri='https://oauth2.googleapis.com/token',
            client_id=social_token.app.client_id,
            client_secret=social_token.app.secret
        )
        creds.refresh(Request())
        self.social_account.socialtoken_set.update(token=creds.token)
        self.creds = creds
        self.db = Database(self.social_account)
        self.cls = Classroom(self.creds)
    
    def get_tasks(self, request):
        submissions = self.db.submissions()
        tasks = []
        for submission in submissions:
            course = submission.course
            coursework = submission.coursework
            if judge_expired(coursework, request):
                continue
            tasks.append({
                "name": f"{course.course_name} {coursework.coursework_title}",
                "courseTitle": course.course_name,
                "courseworkTitle": coursework.coursework_title,
                "startTime": submission.submission_created_time,
                "endTime": coursework.due_time,
                "submissionState": submission.submission_state,
                "link": coursework.link,
                
                "submit_time": submission.submission_updated_time,
                "score": submission.score,
                "score_max": submission.score_max,
                "score_rate": submission.score_rate,
            })
            # name: `${courseTitle} ${coursework_title}`,
            # courseTitle: courseTitle,
            # courseworkTitle: coursework_title,
            # startTime: startTime,
            # endTime: due_time,
            # submissionState: submissionState,
            # link: link,
        return tasks
    
    def update_courses(self, request):
        courses = self.cls.request_courses()
        self.db.clear_courses()
        for course in courses:
            self.db.add_course(course)
        return {"result": "success"}
    
    def update_courseworks(self, request):
        created = False
        self.courses = self.db.courses()
        course_ids = [course.course_id for course in self.courses]
        courseworks = self.cls.request_courseworks(course_ids)
        self.db.clear_courseworks()
        for coursework in courseworks:
            for work in coursework:
                created = self.db.add_coursework(work) or created
        if created:
            tasks = self.update_submissions(request)
        else:
            tasks = self.get_tasks(request)
        return tasks
    
    def update_submissions(self, request):
        self.courseworks = self.db.courseworks()
        course_and_coursework_ids = []
        for coursework in self.courseworks:
            if judge_expired(coursework, request):
                continue
            course_and_coursework_ids.append((coursework.course.course_id, coursework.coursework_id))
        submissions = self.cls.request_submissions(course_and_coursework_ids)
        for submission in submissions:
            self.db.update_submission(submission)
        tasks = self.get_tasks(request)
        return tasks


# def get_ranking_data(coursework_id):
#     submissions = database.get_submissions_from_coursework(coursework_id).order_by("score")
#     submissions = list(submissions.values("user_id_id", "score"))

#     user_names = []
#     for submission in submissions:
#         user = database.get_user_from_db(submission["user_id_id"])
#         user_names.append(user.user_email)

#     ranking = []
#     for user_name, submission in zip(user_names, submissions):
#         ranking.append({
#             "user_name": user_name,
#             "score": submission["score"]
#         })
#     return ranking