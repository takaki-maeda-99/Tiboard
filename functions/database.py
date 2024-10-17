from task_board.models import User, Course, CourseWork, Submission

from datetime import datetime, timedelta

from zoneinfo import ZoneInfo
import re

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
    
def add_coursework_to_user(user_id, coursework_id):
    user = User.objects.get(user_id=user_id)
    coursework = CourseWork.objects.get(coursework_id=coursework_id)
    user.assignment_courseworks.add(coursework)
    user.save()
    
def remove_coursework_from_user(user_id, coursework_id):
    user = User.objects.get(user_id=user_id)
    coursework = CourseWork.objects.get(coursework_id=coursework_id)
    user.assignment_courseworks.remove(coursework)
    user.save()

def insert_course_to_db(course_dict):
    course_name = course_dict.get('name', 'No name')
    if course_name:
        course_name = re.sub(r'B\d{1,7}[_\d]*\s*', '', course_name)
    course, _ = Course.objects.get_or_create(
        course_id=course_dict.get('id', 'No id'),
        defaults={
            'course_name': course_name,
            'link': course_dict.get('alternateLink', '')})
    course.save()

def insert_coursework_to_db(course_id, coursework_dict):
    course = Course.objects.get(course_id=course_id)
    coursework, created = CourseWork.objects.update_or_create(
        course_id=course, 
        coursework_id = coursework_dict.get('id', 'No id'),
        defaults={
            'coursework_title': coursework_dict.get('title', 'No title'),
            'description': coursework_dict.get('description', 'No description'),
            'materials': coursework_dict.get('materials', ''),
            'link': coursework_dict.get('alternateLink', ''),
            'update_time': convert_utc_to_jst(utc_date=coursework_dict.get('updateTime')),
            'due_time': convert_utc_to_jst(date_dict=coursework_dict.get('dueDate'), time_dict=coursework_dict.get('dueTime')),
            })

def insert_submission_state(user_id, course_id, coursework_id, submission_dict):
    user = User.objects.get(user_id=user_id)
    course = Course.objects.get(course_id=course_id)
    coursework = CourseWork.objects.get(course_id=course, coursework_id=coursework_id)
    
    submission_state = submission_dict['state']
    score_rate, score_max, score = 0, 0, 0
    
    if submission_state == 'TURNED_IN' or submission_state == 'RETURNED':
        score_rate, score_max, score = calc_score(submission_dict, coursework)
    
    submission, created = Submission.objects.update_or_create(
        user_id=user,
        course_id=course,
        coursework_id=coursework,
        defaults={
            'submission_state': submission_state,
            'submission_created_time': convert_utc_to_jst(utc_date=submission_dict.get('creationTime')),
            'submission_updated_time': convert_utc_to_jst(utc_date=submission_dict.get('updateTime')),
            'score_rate': score_rate,
            'score_max': score_max,
            'score': score
            })

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

def get_user_id_from_email(user_email):
    user = User.objects.get(user_email=user_email)
    return user.user_id

def get_users_from_db():
    users = User.objects.all()
    return users

def get_all_courses_from_db():
    courses = Course.objects.all()
    return courses

def get_users_from_course(course_id):
    course = Course.objects.get(course_id=course_id)
    users = course.user_set.all()
    return users

def get_tasks_from_db(user_id):
    user = User.objects.get(user_id=user_id)
    submissions = user.submission_set.all()
    enrolled_courseworks = []
    for submission in submissions:
        enrolled_courseworks.append(submission.coursework_id)
    
    tasks = []
    for coursework, submission in zip(enrolled_courseworks, submissions):
        if coursework.due_time < datetime.now(ZoneInfo("Asia/Tokyo")):
            continue
        tasks.append({
            'course_name': coursework.course_id.course_name,
            'coursework_title': coursework.coursework_title,
            'submission_state': submission.submission_state,
            'submission_created_time': submission.submission_created_time,
            'submission_updated_time': submission.submission_updated_time,
            'due_time': coursework.due_time,
            'link': coursework.link
            })
    return tasks

def calc_score(submission_dict, coursework):
    K = 0.01
    created_time = convert_utc_to_jst(utc_date=submission_dict['creationTime'])
    updated_time = convert_utc_to_jst(utc_date=submission_dict['updateTime'])
    time_to_due = max(coursework.due_time - created_time, timedelta(seconds=1)) 
    turn_in_time = coursework.due_time - updated_time
    score_rate = turn_in_time.total_seconds() / time_to_due.total_seconds()
    score_max = round(time_to_due.total_seconds()*K)
    score = round(score_rate * score_max)
    
    return score_rate, score_max, score

def get_coursework_from_db(coursework_id):
    coursework = CourseWork.objects.get(coursework_id=coursework_id)
    return coursework

def get_assignments_from_db(user_id):
    user = User.objects.get(user_id=user_id)
    assignments = user.assignment_courseworks.all()
    return assignments

def get_submissions_from_coursework(coursework_id):
    coursework = CourseWork.objects.get(coursework_id=coursework_id)
    submissions = coursework.submission_set.all()
    return submissions

def get_user_from_db(user_id):
    user = User.objects.get(id=user_id)
    return user

def clear_courses_from_user(user_id):
    user = User.objects.get(user_id=user_id)
    user.enrolled_courses.clear()
    user.save()