from django import forms
from guilds.models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content', 'attachment']
