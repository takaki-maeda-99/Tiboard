def info_and_posts(request):
    from task_board.models import CourseWork, Course
    from question_board.models import Category, Post
    courses = Course.objects.all()
    courseworks = CourseWork.objects.all()
    tasks = {
        'courses': courses,
        'courseworks': courseworks,
    }
    categories = Category.objects.all()
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
