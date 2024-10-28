from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views import View
from .models import Thread, Post
# from task_board.models import User
from django.contrib.auth.models import User
from .forms import PostForm
import urllib.parse

from django.contrib.auth.decorators import login_required

class IndexView(View):
    def get(self, request):
        threads = Thread.objects.all()
        return render(request, 'question_board/index.html', {'threads': threads})

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()

def thread_list(request):
    threads = Thread.objects.all()
    return JsonResponse({
        'threads': [
            {
                'id': thread.id,
                'name': thread.course.course_name,
            }
            for thread in threads
        ]
    })

def get_thread(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id)
    posts = thread.posts.all()
    return JsonResponse({
        'thread': {
            'id': thread.id,
            'name': thread.course.course_name,
            'description': thread.description,
            'posts': [
                {
                    'id': post.id,
                    'content': post.content,
                    'created_at': post.created_at,
                    'author': post.author.username,
                    'attachment': post.attachment.url if post.attachment else None,
                }
                for post in posts
            ]
        }
    })

@login_required
def thread_detail(request, thread_id):
    thread = get_object_or_404(Thread, id=thread_id)
    threads = Thread.objects.all()
    posts = thread.posts.all()
    # user_id = request.COOKIES.get('user_id')

    threads = Thread.objects.all()


    if request.method == 'POST':
        content = request.POST.get('content')
        file = request.FILES.get('attachment')
        print(1)
        
        if (content and content.strip()) or file:
            form = PostForm(request.POST, request.FILES)
            print(2)
            if form.is_valid():
                post = form.save(commit=False)
                post.thread = thread
                # post.author = User.objects.get(user_id=user_id)
                post.author = request.user
                print(3)

                if post.attachment:
                    original_file_name = post.attachment.name
                    encoded_file_name = urllib.parse.quote(original_file_name)
                    post.attachment.name = encoded_file_name
                    print(4)
                    
                post.save()
            else:
                # post = Post(thread=thread, author=User.objects.get(user_id=user_id))
                post = Post(thread=thread, author=request.user)
                print(11)

                if file:
                    post.attachment = file
                    post.save()
                    print(12)
        return redirect('question_board:thread_detail', thread_id=thread_id)

    else:
        form = PostForm()
    return render(request, 'question_board/thread_detail.html', {
        'thread': thread,
        'posts': posts,
        'form': form,
        'threads': threads
    })

from django import template
import os

register = template.Library()

@register.filter
def filename(value):
    # パスを取り除き、識別子を削除してファイル名のみを返す
    return os.path.basename(value).split('_')[0]
