from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from .models import Category, Post, Comment
from task_board.models import User


class IndexView(View):
    def get(self, request):
        categories = Category.objects.all()
        return render(request, 'question_board/index.html', {'categories': categories})

#Viewクラスを継承したIndexViewをas_viewメソッドでビュー関数に変換
index = IndexView.as_view()

def category_detail(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    posts = Post.objects.filter(category=category)
    return render(request, 'question_board/category_detail.html', {'category': category, 'posts': posts})

def post_detail(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    comments = post.comments.all()

    if request.method == 'POST':
        content = request.POST.get('content')
        if content:
            user_id_str = request.COOKIES.get('user_id')
            if user_id_str:
                try:
                    user_id = int(user_id_str)
                    user = User.objects.get(user_id=user_id)
                    Comment.objects.create(
                        post=post,
                        content=content,
                        author=user
                    ).save()
                except ValueError:
                    print('ValueError: Invalid user ID format')
                    return redirect('question_board:post_detail', post_id=post_id)
                except User.DoesNotExist:
                    print('User.DoesNotExist: User not found')
                    return redirect('question_board:post_detail', post_id=post_id)
            else:
                print('User ID not found in cookies')
                return redirect('question_board:post_detail', post_id=post_id)
        return redirect('question_board:post_detail', post_id=post_id)

    return render(request, 'question_board/post_detail.html', {'post': post, 'comments': comments})
