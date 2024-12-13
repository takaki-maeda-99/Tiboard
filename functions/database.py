from guilds.models.task_board_models import Course, CourseWork, Submission, CustomSocialAccount
from guilds.utils import retry_on_failure

from datetime import datetime, timedelta

from zoneinfo import ZoneInfo
import re

def convert_utc_to_jst(utc_date=None, date_dict=None, time_dict=None):
    if utc_date:
        utc_date = datetime.fromisoformat(utc_date.replace('Z', '+00:00'))
        jst_time = utc_date.astimezone(ZoneInfo("Asia/Tokyo"))
        return jst_time
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
    return None

def calc_score(submission_dict, due_time):
    K = 0.01
    created_time = convert_utc_to_jst(utc_date=submission_dict['creationTime'])
    updated_time = convert_utc_to_jst(utc_date=submission_dict['updateTime'])
    time_to_due = max(due_time - created_time, timedelta(seconds=1)) 
    turn_in_time = due_time - updated_time
    score_rate = turn_in_time.total_seconds() / time_to_due.total_seconds()
    score_max = round(time_to_due.total_seconds()*K)
    score = round(score_rate * score_max)
    return score_rate, score_max, score

class Database:
    def __init__(self, user):
        self.user = CustomSocialAccount.objects.get(social_account=user)
    
    @retry_on_failure()
    def courses(self):
        return self.user.enrolled_courses.all()
    
    @retry_on_failure()
    def courseworks(self):
        return self.user.assignment_courseworks.all()
    
    @retry_on_failure()
    def submissions(self):
        return self.user.submission_set.all()
    
    @retry_on_failure()
    def clear_courses(self):
        self.user.enrolled_courses.clear()
        self.user.save()
    
    @retry_on_failure()
    def clear_courseworks(self):
        self.user.assignment_courseworks.clear()
        self.user.save()
    
    @retry_on_failure()
    def add_course(self, course):
        course, _ = Course.objects.get_or_create(
            course_id=course.get('id', 'No id'),
            defaults={
                'course_name': re.sub(r'B\d{1,7}[_\d]*\s*', '',  course.get('name', 'No name')),
                'link': course.get('alternateLink', 'No link')}
            )
        self.user.enrolled_courses.add(course)
        self.user.save()
    
    @retry_on_failure()
    def add_coursework(self, coursework):
        course = Course.objects.get(course_id=coursework.get('courseId', 'No course_id'))
        coursework, created = CourseWork.objects.update_or_create(
            course=course,
            coursework_id = coursework.get('id', 'No id'),
            defaults={
                'coursework_title': coursework.get('title', 'No title'),
                'description': coursework.get('description', 'No description'),
                'materials': coursework.get('materials', ''),
                'link': coursework.get('alternateLink', ''),
                'update_time': convert_utc_to_jst(utc_date=coursework.get('updateTime')),
                'due_time': convert_utc_to_jst(date_dict=coursework.get('dueDate'), time_dict=coursework.get('dueTime'))}
            )
        self.user.assignment_courseworks.add(coursework)
        self.user.save()
        return created
    
    @retry_on_failure()
    def update_submission(self, submission):
        coursework = CourseWork.objects.get(coursework_id=submission.get('courseWorkId', 'No coursework_id'))
        finished = submission["state"] in ('TURNED_IN','RETURNED') and coursework.due_time is not None
        scores = calc_score(submission, coursework.due_time) if finished else (0, 0, 0)
        submission, _ = Submission.objects.update_or_create(
            user = self.user,
            course = coursework.course,
            coursework = coursework,
            defaults={
                'submission_state': submission.get('state', 'No state'),
                'submission_created_time': convert_utc_to_jst(utc_date=submission.get('creationTime')),
                'submission_updated_time': convert_utc_to_jst(utc_date=submission.get('updateTime')),
                'score_rate': scores[0],
                'score_max': scores[1],
                'score': scores[2]}
            )