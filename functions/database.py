from task_board.models import User, Course, CourseWork, Submission

from datetime import datetime
from zoneinfo import ZoneInfo

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

def insert_user_to_db(user_id, user_email):
    user, _ = User.objects.get_or_create(
        user_id=user_id, 
        defaults={'user_email': user_email})
    user.save()

def add_course_to_user(user_id, course_id):
    user = User.objects.get(user_id=user_id)
    course = Course.objects.get(course_id=course_id)
    user.enrolled_courses.add(course)
    user.save()

def insert_course_to_db(course_dict):
    course, _ = Course.objects.get_or_create(
        course_id=course_dict.get('id', 'No id'),
        defaults={
            'course_name': course_dict.get('name', 'No name'),
            'link': course_dict.get('alternateLink', '')})
    course.save()

def insert_coursework_to_db(course_id, coursework_dict):
    course = Course.objects.get(course_id=course_id)
    coursework, _ = CourseWork.objects.get_or_create(
        course_id=course, 
        coursework_id=coursework_dict.get('id', 'No id'),
        defaults={
            'coursework_title': coursework_dict.get('title', 'No title'),
            'description': coursework_dict.get('description', 'No description'),
            'materials': coursework_dict.get('materials', ''),
            'link': coursework_dict.get('alternateLink', ''),
            'update_time': convert_utc_to_jst(utc_date=coursework_dict.get('updateTime')),
            'due_time': convert_utc_to_jst(date_dict=coursework_dict.get('dueDate'), time_dict=coursework_dict.get('dueTime')),
        })
    coursework.save()

def insert_submission_state(user_id, course_id, coursework_id, submission_dict):
    user = User.objects.get(user_id=user_id)
    course = Course.objects.get(course_id=course_id)
    coursework = CourseWork.objects.get(course_id=course, coursework_id=coursework_id)
    submission, _ = Submission.objects.get_or_create(
        user_id=user,
        course_id=course,
        coursework_id=coursework,
        defaults={
            'submission_state': submission_dict.get('state', 'No state'),
            'submission_created_time': convert_utc_to_jst(utc_date=submission_dict.get('creationTime')),
        })
    submission.save()

def get_courses_from_db(user_id):
    user = User.objects.get(user_id=user_id)
    courses = user.enrolled_courses.all()
    return courses

def get_courseworkss_from_db(user_id):
    courses = get_courses_from_db(user_id)
    courseworkss = []
    for course in courses:
        courseworks = course.coursework_set.all()
        courseworkss.append(courseworks)
    return courseworkss

def get_submissions_from_db(user_id):
    user = User.objects.get(user_id=user_id)
    submissions = user.submission_set.all()
    return submissions