from django.db import models

# Create your models here.
from .task_board_models import Course

from django.contrib.auth.models import User

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
    # reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    id = models.BigAutoField(primary_key=True)
    attachment = models.FileField(upload_to='attachments/', null=True, blank=True)

    def __str__(self):
        return self.thread.course.course_name
    
from django.db import models

class Message(models.Model):
    content = models.TextField()
    reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.CharField(max_length=100)  # 投稿者情報を追加

    def __str__(self):
        return f'{self.author}: {self.content[:50]}'  # メッセージの最初の50文字を表示
