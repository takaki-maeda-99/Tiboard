from django.apps import AppConfig


class TaskBoardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'task_board'
    
    def ready(self):
        import task_board.signals
        from task_board.update import start
        start()
