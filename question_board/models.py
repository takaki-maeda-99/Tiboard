from django.db import models
from task_board.models import User, Course

class Thread(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    description = models.TextField(max_length=500, null=True, blank=True)
    
    @property
    def name(self):
        return self.course.course_name

    def __str__(self):
        return self.name

class Post(models.Model):
    thread = models.ForeignKey(Thread, related_name='posts', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    id = models.BigAutoField(primary_key=True)

    def __str__(self):
        return self.thread.course.course_name