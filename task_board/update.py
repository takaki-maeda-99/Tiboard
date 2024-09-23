
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler

from functions.function import update_polling

from django.conf import settings

def start():
    """
    Scheduling data update
    Run update function once every 12 seconds
    """
    scheduler = BackgroundScheduler()
    
    scheduler.add_job(update_polling, 'interval', seconds= settings.POLLING_INTERVAL)
    scheduler.start()

