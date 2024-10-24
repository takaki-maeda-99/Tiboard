
from apscheduler.schedulers.background import BackgroundScheduler

# from functions.function import update_polling
# from functions.function import update_courses_data
from functions import database

from django.conf import settings

def start():
    
    # users = database.get_users_from_db()
    # for user in users:
    #     update_courses_data(user_id=user.user_id)

    print("start")
    # scheduler = BackgroundScheduler()
    # scheduler.add_job(update_polling, 'interval', seconds= settings.POLLING_INTERVAL)
    # scheduler.start()
