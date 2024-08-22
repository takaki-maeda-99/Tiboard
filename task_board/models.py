from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user_id}"

class Course(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course_id = models.CharField(max_length=100)
    course_name = models.CharField(max_length=100)
    update_time = models.CharField (max_length=100)
    Link = models.URLField(max_length=100)
    
    def __str__(self):
        return f"{self.course_name} ({self.course_id})"