from django import forms
from .models.question_board_models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content', 'attachment']
