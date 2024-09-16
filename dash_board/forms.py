from django import forms
from task_board.models import User

class EmailForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['user_email']  # コメント内容のみを入力
        widgets = {
            'user_email': forms.Textarea(attrs={
                'class': 'form-control', 
                'placeholder': 'Enter your email here',
                }),
        }
