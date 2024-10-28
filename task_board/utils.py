import time
from django.db import OperationalError

def retry_on_failure(retries=20, delay=0.1):
    def decorator(func):
        def wrapper(*args, **kwargs):
            attempts = retries
            while attempts > 0:
                try:
                    return func(*args, **kwargs)
                except OperationalError as e:
                    if 'database is locked' in str(e):
                        attempts -= 1
                        time.sleep(delay)
                    else:
                        raise
            raise OperationalError("Max retries exceeded")
        return wrapper
    return decorator