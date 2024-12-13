from django.contrib import admin
from guilds.models import Course, CourseWork, Submission

admin.site.register(Course)
admin.site.register(CourseWork)
admin.site.register(Submission)

from guilds.models import CustomSocialAccount

admin.site.register(CustomSocialAccount)

from guilds.models import Post, Thread

admin.site.register(Thread)
admin.site.register(Post)