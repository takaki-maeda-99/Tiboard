from django.contrib import admin
from .models import User, Course, CourseWork, Submission

# Register your models here.

admin.site.register(User)
admin.site.register(Course)
admin.site.register(CourseWork)
admin.site.register(Submission)