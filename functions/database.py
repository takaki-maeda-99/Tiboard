from task_board.models import User, Course, CourseWork

def insert_user_to_db(user_id, user_email):
    try:
        user = User(user_id=user_id, user_email=user_email)
        user.save()
        
    except Exception as e:
        print(f"An error occurred: {e}")
        
def insert_course_to_db(user_id, course_dict):
    try:
        user = User.objects.get(user_id=user_id)
        course = Course(
            user_id=user, 
            course_id=course_dict['id'], 
            course_name=course_dict['name'], 
            link=course_dict['alternateLink'])
        course.save()
        
    except Exception as e:
        print(f"An error occurred: {e}")

def insert_coursework_to_db(user_id, course_id, coursework_dict):
    try:
        user = User.objects.get(user_id=user_id)
        course = Course.objects.get(user_id=user, course_id=course_id)
        course_work = CourseWork(
            user_id=user, 
            course_id=course, 
            coursework_id=coursework_dict['id'], 
            coursework_title=coursework_dict['title'], 
            description=coursework_dict['description'], 
            materials=coursework_dict['materials'], 
            link=coursework_dict['alternateLink'], 
            update_time=coursework_dict['updateTime'], 
            due_time=coursework_dict['dueTime'], 
            submission_created_time="2024-07-18T01:05:33.759Z",
            submission_state="NEW")
        course_work.save()
        
    except Exception as e:
        print(f"An error occurred: {e}")

def update_submission_state(user_id, course_id, coursework_id, submission_dict):
    try:
        user = User.objects.get(user_id=user_id)
        course = Course.objects.get(user_id=user, course_id=course_id)
        coursework = CourseWork.objects.get(user_id=user, course_id=course, coursework_id=coursework_id)
        coursework.submission_state = submission_dict['state']
        coursework.submission_created_time = submission_dict['creationTime']
        coursework.save()
    
    except Exception as e:
        print(f"An error occurred: {e}")