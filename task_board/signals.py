from django.db.models.signals import post_save
from django.dispatch import receiver


from task_board.models import Course
from question_board.models import Thread

@receiver(post_save, sender=Course)
def create_thread_for_course(sender, instance, created, **kwargs):
    if created:
        Thread.objects.create(course=instance, description=f"Thread for {instance.course_name}")


from allauth.socialaccount.models import SocialAccount
from .models import CustomSocialAccount

@receiver(post_save, sender=SocialAccount)
def save_custom_social_account(sender, instance, **kwargs):
    try:
        instance.custom_account.save()
    except CustomSocialAccount.DoesNotExist:
        CustomSocialAccount.objects.create(social_account=instance)