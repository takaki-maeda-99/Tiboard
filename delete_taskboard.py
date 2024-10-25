import sqlite3

# データベース読み込み
db = sqlite3.connect(
    "db.sqlite3",
    isolation_level=None,
)

try:
    cursor = db.cursor()
    
    # 外部キー制約を無効にする
    cursor.execute("PRAGMA foreign_keys = OFF;")
    
    # task_boardアプリケーションに関連するすべてのテーブルを特定
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'task_board_%';")
    tables = cursor.fetchall()
    
    # 特定したテーブルをすべて削除
    for table in tables:
        table_name = table[0]
        sql = f"DROP TABLE IF EXISTS {table_name}"
        cursor.execute(sql)
        print(f"Table {table_name} dropped successfully.")
    
    # 外部キー制約を再度有効にする
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    db.commit()
except sqlite3.Error as e:
    print(f"An error occurred: {e}")
finally:
    db.close()  # データベースを閉じる