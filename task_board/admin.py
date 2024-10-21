from django.contrib import admin
from .models import Course, CourseWork, Submission

admin.site.register(Course)
admin.site.register(CourseWork)
admin.site.register(Submission)

from .models import CustomSocialAccount

admin.site.register(CustomSocialAccount)