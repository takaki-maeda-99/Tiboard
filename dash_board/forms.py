from django import forms
from task_board.models import User

class EmailForm(forms.ModelForm):
    class Meta:
        model = User  # Userモデルに適応
        fields = ['user_email']  # 'user_email' フィールドのみをフォームに表示
        widgets = {
            'user_email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': '入力してください'
            }),
        }
