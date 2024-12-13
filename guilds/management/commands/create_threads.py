from django.core.management.base import BaseCommand

from guilds.models.question_board_models import Thread
from guilds.models.task_board_models import Course

class Command(BaseCommand):
    help = 'Create threads for all existing courses if not already created.'

    def handle(self, *args, **kwargs):
        courses = Course.objects.all()
        for course in courses:
            if not Thread.objects.filter(course=course).exists():
                Thread.objects.create(course=course, description=f"Thread for {course.course_name}")
                self.stdout.write(self.style.SUCCESS(f"Created Thread for course: {course.course_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Thread already exists for course: {course.course_name}"))
