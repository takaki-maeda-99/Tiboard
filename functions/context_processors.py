def info_and_posts(request):
    from guilds.models import CourseWork, Course
    from guilds.models import Thread, Post
    courses = Course.objects.all()
    courseworks = CourseWork.objects.all()
    tasks = {
        'courses': courses,
        'courseworks': courseworks,
    }
    categories = Thread.objects.all()
    category_data = [
        {'id': category.id, 'name': category.name, 'description': category.description}
        for category in categories
    ]
    posts = Post.objects.all().prefetch_related('comments')
    context = {
        'categories': category_data,
        'posts': posts,
    }
    return {'tasks': tasks, 'context': context}
