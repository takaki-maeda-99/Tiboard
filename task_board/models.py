from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user_id}"

class Course(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    course_id = models.CharField(max_length=100)
    course_name = models.CharField(max_length=100)
    update_time = models.CharField (max_length=100)
    link = models.URLField(max_length=100)
    
    def __str__(self):
        return f"{self.course_name} ({self.course_id})"

class CourseWork(models.Model):
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_ids')
    course_work_id= models.CharField(max_length=100)
    course_work_title = models.CharField(max_length=100)
    description= models.CharField(default='No description', max_length=100)
    materials = models.TextField(blank=True, default="")
    link = models.URLField(blank=True, default="")
    update_time = models.DateTimeField(null=True, blank=True)
    due_time = models.DateTimeField(null=True, blank=True)
    creation_time = models.DateTimeField(null=True, blank=True)
    state = models.CharField(max_length=50, blank=True, default="")
    late = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.course_work_title} ({self.course_work_id})"