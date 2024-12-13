from django.contrib import admin
from .models.task_board_models import Course, CourseWork, Submission

admin.site.register(Course)
admin.site.register(CourseWork)
admin.site.register(Submission)

from .models.task_board_models import CustomSocialAccount

admin.site.register(CustomSocialAccount)

from .models.question_board_models import Post, Thread

admin.site.register(Thread)
admin.site.register(Post)