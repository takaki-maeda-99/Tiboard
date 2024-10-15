from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from .models import Thread, Post
from task_board.models import User

class IndexView(View):
    def get(self, request):
        threads = Thread.objects.all()
        return render(request, 'question_board/index.html', {'threads': threads})

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()

def thread_list(request):
    threads = Thread.objects.all()
    return render(request, 'question_board/thread_list.html', {'threads': threads})

def thread_detail(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id)
    posts = thread.posts.all()
    user_id = request.COOKIES.get('user_id')
    print(user_id)

    if request.method == 'POST':
        content = request.POST.get('reply_content')
        post_id = request.POST.get('post_id')
        if content:
            Post.objects.create(
                thread=thread,
                content=content,
                author=User.objects.get(user_id=user_id)
            )
        return redirect('question_board:thread_detail', thread_id=thread_id)

    return render(request, 'question_board/thread_detail.html', {
        'thread': thread,
        'posts': posts,
    })
    
# from django.shortcuts import json_response
    
# def get_thread(request, thread_id):
#     thread = get_object_or_404(Thread, id=thread_id)
#     posts = thread.posts.all()
#     return json_response({
#         'thread': {
#             'id': thread.id,
#             'title': thread.title,
#             'content': thread.content,
#         },
#         'posts': [
#             {
#                 'id': post.id,
#                 'content': post.content,
#                 'author': post.author.user_id,
#             }
#             for post in posts
#         ]
#     })
