import sqlite3

#データベース読み込み
db = sqlite3.connect(
    "db.sqlite3",
    isolation_level=None,
)

#テーブルを削除
table = "question_board_category"

sql = f"DROP TABLE {table}"
db.execute(sql) #sql文を実行
db.close()      #データベースを閉じる