from django import template
import os

register = template.Library()

@register.filter
def filename(value):
    # パスを取り除き、識別子（最後のアンダースコア以降）を削除してファイル名のみを返す
    base_name = os.path.basename(value)  # パスを取り除く
    parts = base_name.split('_')  # アンダースコアで分割
    return '_'.join(parts[:-1])  # 最後の識別子部分を除いて結合