from django.db import models

# Create your models here.
from allauth.socialaccount.models import SocialAccount

class CustomSocialAccount(models.Model):
    social_account = models.OneToOneField(SocialAccount, on_delete=models.CASCADE, default=None, related_name='custom_account')
    enrolled_courses = models.ManyToManyField('Course', blank=True)
    assignment_courseworks = models.ManyToManyField('CourseWork', blank=True)
    
    def __str__(self):
        return f"{self.social_account}"

class Course(models.Model):
    course_id = models.CharField(max_length=100, default="", unique=True)
    
    course_name = models.CharField(max_length=100, default="")
    link = models.URLField(max_length=100, default="")
    
    def __str__(self):
        return f"{self.course_name}"

class CourseWork(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default="")
    coursework_id= models.CharField(max_length=100, default="")
    
    coursework_title = models.CharField(max_length=100)
    description = models.CharField(default='No description', max_length=100)
    materials = models.TextField(blank=True, default="")
    link = models.URLField(blank=True, default="")
    update_time = models.DateTimeField(null=True, blank=True)
    due_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.coursework_title} ({self.coursework_id})"
    
    class Meta:
        unique_together = ('course', 'coursework_id')
        
class Submission(models.Model):
    user = models.ForeignKey(CustomSocialAccount, on_delete=models.CASCADE, default="")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, default="")
    coursework = models.ForeignKey(CourseWork, on_delete=models.CASCADE, default="")
    
    submission_state = models.CharField(max_length=50, blank=True, default="")
    submission_created_time = models.DateTimeField(null=True, blank=True)
    submission_updated_time = models.DateTimeField(null=True, blank=True)
    
    score_rate = models.FloatField(default=0)
    score_max = models.IntegerField(default=0)
    score = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.coursework} ({self.submission_state})"
    
    class Meta:
        unique_together = ('user', 'course', 'coursework')


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
