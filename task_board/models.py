from django.db import models


# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=100 ,default="", unique=True)
    user_email = models.EmailField(max_length=100 ,default="")

    def __str__(self):
        return f"{self.user_id}"

class Course(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, default="")
    course_id = models.CharField(max_length=100, default="")
    course_name = models.CharField(max_length=100, default="")
    link = models.URLField(max_length=100, default="")
    
    def __str__(self):
        return f"{self.course_id} ({self.course_name})"

class CourseWork(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, default="")
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE, default="")
    coursework_id= models.CharField(max_length=100, default="")
    coursework_title = models.CharField(max_length=100)
    
    description = models.CharField(default='No description', max_length=100)
    materials = models.TextField(blank=True, default="")
    link = models.URLField(blank=True, default="")
    
    update_time = models.DateTimeField(null=True, blank=True)
    due_time = models.DateTimeField(null=True, blank=True)
    
    submission_created_time = models.DateTimeField(null=True, blank=True)
    submission_state = models.CharField(max_length=50, blank=True, default="")
    
    def __str__(self):
        return f"{self.course_work_title} ({self.course_work_id})"