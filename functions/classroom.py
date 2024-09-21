import requests
import asyncio

def request_person_info(headers):
    response = requests.get(f"https://people.googleapis.com/v1/people/me?personFields=emailAddresses", headers=headers).json()
    if response.get("error", None):
        raise Exception(response.get("error", {}).get("message", "An error occurred"))
    
    person_info = response.get("emailAddresses", [])[0]
    person_extracted_info = {"user_id": person_info.get("metadata", {}).get("source", {}).get("id", ""), "user_email": person_info.get("value", "")}
    
    return person_extracted_info
    
    # person_info
    # [{'metadata': {'primary': True, 
    #                'verified': True, 
    #                'source': {'type': 'DOMAIN_PROFILE', 'id': '100529591481232043303'}, 
    #                'sourcePrimary': True}, 
    #   'value': 'sd23097@toyota-ti.ac.jp', 
    #   'type': 'work', 
    #   'formattedType': 'Work'}]

    # person_extracted_info
    # {'user_id': '100529591481232043303',
    #   'user_email': 'sd23097@toyota-ti.ac.jp'}

def request_courses_info(headers):
    COURSE_INFO_FIELDS = "courses(name,id,alternateLink)"
    
    response = requests.get(f"https://classroom.googleapis.com/v1/courses?fields={COURSE_INFO_FIELDS}", headers=headers).json()
    if response.get("error", None):
        raise Exception(response.get("error", {}).get("message", "An error occurred"))
    return response.get("courses", [])
    
    # course
    # {'id': '645150769353', 
    #  'name': 'B4001401 力学1および演習_2024', 
    #  'descriptionHeading': '力学1および演習', 
    #  'ownerId': '113475215912356661228', 
    #  'creationTime': '2023-12-08T05:54:18.416Z', 
    #  'updateTime': '2023-12-08T06:14:37.241Z', 
    #  'courseState': 'ACTIVE', 
    #  'alternateLink': 'https://classroom.google.com/c/NjQ1MTUwNzY5MzUz', 
    #  'teacherGroupEmail': 'B4001401_1_2024_teachers_8b9d779e@tti-j.net', 
    #  'courseGroupEmail': 'B4001401_1_2024_b525fd4f@tti-j.net', 
    #  'guardiansEnabled': False, 
    #  'calendarId': 'c_classroomfd9d28fb@group.calendar.google.com', 
    #  'gradebookSettings': {'calculationType': 'TOTAL_POINTS', 'displaySetting': 'SHOW_OVERALL_GRADE'}}

    # example
    # {'id': '645150769353', 'name': 'B4001401 力学1および演習_2024'}, 
    # {'id': '646077438079', 'name': 'B4000801 線形代数1および演習_2024'}, 
    # {'id': '645123571677', 'name': 'B4004901 CP1基礎および実習１_2024'}, 
    # {'id': '645149533627', 'name': 'B1003101 論理学(教養ｺｱ1) _2024'}, 
    # {'id': '660563281411', 'name': '化学1（学習サポ ーター用）_2024'}, 
    # {'id': '672945024951', 'name': '【授業ｱﾝｹｰﾄ】工学基礎実験1'}, 
    # {'id': '660559087240', 'name': '2024主専攻分野配属(学部2年生）'}, 
    # {'id': '662142411872', 'name': 'B5_3015 基実1_光の性質(干渉・回折・偏光)_2024'}, 
    # {'id': '662141458389', 'name': 'B5_3016 基実1_真空工学_2024'}, 
    # {'id': '662140540578', 'name': 'B5_3012 基実1_変位・速度・加速度_2024'}, 
    # {'id': '662140031150', 'name': 'B5_3011 基実1_熱電対および測温抵抗体による温度測定_2024'}, 
    # {'id': '648304373802', 'name': 'B5_3014 基実1_電磁誘導現象_2024'}, 
    # {'id': '648304189357', 'name': 'B5_3013 基実1_ｱﾅﾛｸﾞ・ﾃﾞｼﾞﾀﾙ基本回路_2024'}, 
    # {'id': '646078231111', 'name': 'B5005401 材料力学基礎_2024'}, 
    # {'id': '646078127450', 'name': 'B5008601 量子力学入門_2024'}, 
    # {'id': '646077178130', 'name': 'B2010302 基礎英語3(b)_2024'}, 
    # {'id': '645160475784', 'name': 'B5050701 現代工学概論１_2024'}, 
    # {'id': '645157191953', 'name': 'B5003401 電気回路工学1_2024'}, 
    # {'id': '645154670819', 'name': 'B5001701 ｼｽﾃﾑ工学_2024'}, 
    # {'id': '645154192598', 'name': 'B4004601 複素関数(旧解析2ab)_2024'}, 
    # {'id': '645153763177', 'name': 'B4004701 応用数学1_2024'}, 
    # {'id': '645153417206', 'name': 'B2070101 ﾄﾞｲﾂ語1_2024'}, 
    # {'id': '645152979812', 'name': 'B3020301 基礎ｽﾎﾟｰﾂ3_2024'}, 
    # {'id': '645152856315', 'name': 'B4003601 電磁気学2_2024'}, 
    # {'id': '645152646271', 'name': 'B4003701 熱力学_2024'}, 
    # {'id': '645152263954', 'name': 'B2040102 英語ｺﾐｭﾆｹｰｼｮﾝ3(b)_2024'}, 
    # {'id': '645148519590', 'name': 'B1003201 経済学入門(教養ｺｱ3)_2024'}, 
    # {'id': '645124643094', 'name': 'B5008501 CP応用および実習 / ﾌﾟﾛｸﾞﾗﾐﾝｸﾞ技法_2024'}, 
    # {'id': '315705912737', 'name': '全サポーターClassroom'}, 
    # {'id': '522592418126', 'name': '海外英語演習_2023'}, 
    # {'id': '314053235042', 'name': '久方寮Classroom（全体のお知らせ）'}

def request_courseWork_info(headers, courseId=""):
    COURSEWORK_INFO_FIELDS = "courseWork(courseId,id,title,description,materials,updateTime,dueDate,dueTime,alternateLink)"
    
    response = requests.get(f"https://classroom.googleapis.com/v1/courses/{courseId}/courseWork?fields={COURSEWORK_INFO_FIELDS}", headers=headers).json()
    if response.get("error", None):
        raise Exception(response.get("error", {}).get("message", "An error occurred"))
    return response.get("courseWork", [])

    # courseWork
    # {'courseId': '645150769353', 
    #  'id': '645150769545', 
    #  'title': '第１５回', 
    #  'materials': [{'driveFile': {'driveFile': {'id': '13k8Ull6LFHeBr-WHBTR5mEYg5wa7d75V', 
    #                                             'title': '第15回2024.pdf', 
    #                                             'alternateLink': 'https://drive.google.com/file/d/13k8Ull6LFHeBr-WHBTR5mEYg5wa7d75V/view?usp=drive_web', 
    #                                             'thumbnailUrl': 'https://lh3.googleusercontent.com/drive-storage/AJQWtBPtykk8ZANpP0v8eyIXvSwc63ELv8eog8IU1SE5_enxNiIY7tM3ZRtFx8BuTUpQsFeIwB4n2qNGmaMFv41JuW7RTzv2VnTjmGYMuV9vlHEJ_oo=s200'}, 
    #                               'shareMode': 'VIEW'}}, 
    #                {'driveFile': {'driveFile': {'id': '1KFaiZKjBDw18RbX9k6wa8X8kpjwDOOfy', 
    #                                             'title': '第15回2024（解答）.pdf', 
    #                                             'alternateLink': 'https://drive.google.com/file/d/1KFaiZKjBDw18RbX9k6wa8X8kpjwDOOfy/view?usp=drive_web', 
    #                                             'thumbnailUrl': 'https://lh3.googleusercontent.com/drive-storage/AJQWtBM57xmSQHii3p7FgGaNepIMhu1BXMsbT9VagYs--Yv-8LYA6TfM-0oi6FrgPnYPldHrmEWRqoMM3yAq-_IFy_opbVdlfMquuBSqjJJODZr3__E=s200'}, 
    #                               'shareMode': 'VIEW'}}], 
    #  'state': 'PUBLISHED', 
    #  'alternateLink': 'https://classroom.google.com/c/NjQ1MTUwNzY5MzUz/a/NjQ1MTUwNzY5NTQ1/details', 
    #  'creationTime': '2023-12-08T05:54:31.519Z', 
    #  'updateTime': '2024-07-19T01:06:08.133Z', 
    #  'dueDate': {'year': 2024, 'month': 7, 'day': 18}, 
    #  'dueTime': {'hours': 3, 'minutes': 10}, 
    #  'maxPoints': 4, 
    #  'workType': 'ASSIGNMENT', 
    #  'submissionModificationMode': 'MODIFIABLE_UNTIL_TURNED_IN', 
    #  'creatorUserId': '113475215912356661228', 
    #  'topicId': '672848748871'},

    # example
    # {'id': '645154192625', 'title': '複素関数_第15回_アンケート', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjI1/details', 'updateTime': '2024-07-18T01:04:37.827Z', 'dueDate': {'year': 2024, 'month': 7, 'day': 18}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192627', 'title': '複素関数_第15回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjI3/details', 'updateTime': '2024-07-18T01:02:56.312Z', 'dueDate': {'year': 2024, 'month': 7, 'day': 21}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192764', 'title': '【複素関数論）】授業アンケート', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzY0/details', 'updateTime': '2024-07-18T00:52:59.274Z', 'dueDate': {'year': 2024, 'month': 7, 'day': 19}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192765', 'title': '複素関数_第14回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzY1/details', 'updateTime': '2024-07-12T08:33:27.527Z', 'dueDate': {'year': 2024, 'month': 7, 'day': 16}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '698449756213', 'title': '複素関数_第14回_クイズ', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/Njk4NDQ5NzU2MjEz/details', 'updateTime': '2024-07-12T07:21:19.666Z', 'dueDate': {'year': 2024, 'month': 7, 'day': 12}, 'dueTime': {'hours': 7, 'minutes': 32}}
    # {'id': '645154192750', 'title': '複素関数_第13回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzUw/details', 'updateTime': '2024-07-11T01:02:43.370Z', 'dueDate': {'year': 2024, 'month': 7, 'day': 15}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192741', 'title': '複素関数_第12回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzQx/details', 'updateTime': '2024-06-27T01:03:00.956Z', 'dueDate': {'year': 2024, 'month': 7, 'day': 1}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192748', 'title': '複素関数_第12回_クイズ', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzQ4/details', 'updateTime': '2024-06-27T00:49:30.693Z', 'dueDate': {'year': 2024, 'month': 6, 'day': 27}, 'dueTime': {'minutes': 53}}
    # {'id': '645154192729', 'title': '複素関数_第11回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzI5/details', 'updateTime': '2024-06-20T01:01:35.569Z', 'dueDate': {'year': 2024, 'month': 6, 'day': 24}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '696371297281', 'title': '複素関数_第11回_クイズ', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/Njk2MzcxMjk3Mjgx/details', 'updateTime': '2024-06-19T23:49:18.711Z', 'dueDate': {'year': 2024, 'month': 6, 'day': 20}, 'dueTime': {'hours': 1, 'minutes': 20}}
    # {'id': '645154192717', 'title': '複素関数_第10回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzE3/details', 'updateTime': '2024-06-13T01:03:20.849Z', 'dueDate': {'year': 2024, 'month': 6, 'day': 17}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192725', 'title': '複素関数_第10回_クイズ', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzI1/details', 'updateTime': '2024-06-13T00:20:49.153Z', 'dueDate': {'year': 2024, 'month': 6, 'day': 13}, 'dueTime': {'hours': 1, 'minutes': 20}}
    # {'id': '645154192709', 'title': '複素関数_第09回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNzA5/details', 'updateTime': '2024-06-06T01:02:58.737Z', 'dueDate': {'year': 2024, 'month': 6, 'day': 10}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '693505023565', 'title': '複素関数_第08回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjkzNTA1MDIzNTY1/details', 'updateTime': '2024-05-30T01:01:47.862Z', 'dueDate': {'year': 2024, 'month': 6, 'day': 3}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192685', 'title': '複素関数_第06回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjg1/details', 'updateTime': '2024-05-16T01:05:26.329Z', 'dueDate': {'year': 2024, 'month': 5, 'day': 19}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192695', 'title': '複素関数_第06回_アンケート', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjk1/details', 'updateTime': '2024-05-16T01:05:15.390Z', 'dueDate': {'year': 2024, 'month': 5, 'day': 16}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192677', 'title': '複素関数_第05回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjc3/details', 'updateTime': '2024-05-09T01:05:50.612Z', 'dueDate': {'year': 2024, 'month': 5, 'day': 13}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192675', 'title': '複素関数_第05回_クイズ', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjc1/details', 'updateTime': '2024-05-09T00:19:51.884Z', 'dueDate': {'year': 2024, 'month': 5, 'day': 9}, 'dueTime': {'hours': 1, 'minutes': 20}}
    # {'id': '645154192667', 'title': '複素関数_第04回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjY3/details', 'updateTime': '2024-05-02T01:09:48.984Z', 'dueDate': {'year': 2024, 'month': 5, 'day': 6}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192665', 'title': '複素関数_第04回_クイズ', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjY1/details', 'updateTime': '2024-05-02T00:31:28.755Z'}
    # {'id': '645154192657', 'title': '複素関数_第03回_クイズ', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjU3/details', 'updateTime': '2024-04-24T23:48:16.425Z', 'dueDate': {'year': 2024, 'month': 4, 'day': 25}, 'dueTime': {'hours': 1, 'minutes': 20}}
    # {'id': '645154192649', 'title': '複素関数_第02回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjQ5/details', 'updateTime': '2024-04-18T00:55:30.968Z', 'dueDate': {'year': 2024, 'month': 4, 'day': 22}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '678232855515', 'title': '複素関数_第02回_アンケート', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/Njc4MjMyODU1NTE1/details', 'updateTime': '2024-04-18T00:55:17.175Z', 'dueDate': {'year': 2024, 'month': 4, 'day': 18}, 'dueTime': {'hours': 1, 'minutes': 20}}
    # {'id': '645154192640', 'title': '複素関数_第01回_演習問題', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjQw/details', 'updateTime': '2024-04-11T01:03:15.204Z', 'dueDate': {'year': 2024, 'month': 4, 'day': 15}, 'dueTime': {'hours': 14, 'minutes': 59}}
    # {'id': '645154192638', 'title': '複素関数_第01回_クイズ', 'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjM4/details', 'updateTime': '2024-04-11T00:20:01.186Z', 'dueDate': {'year': 2024, 'month': 4, 'day': 11}, 'dueTime': {'hours': 1, 'minutes': 20}}

def reqeust_submissions_info(headers, courseId="", courseWorkId=""):
    SUBMISSION_INFO_FIELDS = "studentSubmissions(courseWorkId,creationTime,state)"
    
    response = requests.get(f"https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions?fields={SUBMISSION_INFO_FIELDS}", headers=headers).json()
    if response.get("error", None):
        raise Exception(response.get("error", {}).get("message", "An error occurred"))
    return response.get("studentSubmissions", [])[0]

    # submission
    # [{'courseId': '645154192598', 
    #   'courseWorkId': '645154192627', 
    #   'id': 'Cg4InMi-lcMREPP5vrHjEg', 
    #   'userId': '100529591481232043303', 
    #   'creationTime': '2024-07-18T01:05:33.759Z', 
    #   'updateTime': '2024-07-22T07:07:32.937Z', 
    #   'state': 'RETURNED', 
    #   'assignedGrade': 100, 
    #   'alternateLink': 'https://classroom.google.com/c/NjQ1MTU0MTkyNTk4/a/NjQ1MTU0MTkyNjI3/submissions/by-status/and-sort-last-name/student/NjAyMTQ1NzkzMDUy', 
    #   'courseWorkType': 'ASSIGNMENT', 
    #   'assignmentSubmission': {'attachments': [{'driveFile': {'id': '1ZqQH1Hti3R1FIu4AVtdW3x7graplN_yQ', 
    #                                                           'title': 'CF-15_sd23097.pdf', 
    #                                                           'alternateLink': 'https://drive.google.com/file/d/1ZqQH1Hti3R1FIu4AVtdW3x7graplN_yQ/view?usp=drive_web', 
    #                                                           'thumbnailUrl': 'https://lh3.googleusercontent.com/drive-storage/AJQWtBMYk2wnjr2ys-hcfEdd_0uQ7bkSOTqM77-3j-eSbEFXluZblD5QTT5497yx6ZOUbmAmZHjjXiZDWh6hJIdgpost1fCJTPHYWvd09kDvmOayjQI=s200'}
    #                                             }]
    #                            }
    #   }]

async def async_function(function, *args):
    return await asyncio.get_running_loop().run_in_executor(None, function, *args)

async def async_functions(functions):
    return await asyncio.gather(*functions)

def async_request_all_courseWork_info(headerss, course_ids):
    tasks = []
    for headers, course_id in zip(headerss, course_ids):
        tasks.append(async_function(request_courseWork_info, headers, course_id))
    return asyncio.run(async_functions(tasks))

def async_request_user_and_course_info(headers):
    tasks = [
        async_function(request_person_info, headers),
        async_function(request_courses_info, headers)
    ]
    return asyncio.run(async_functions(tasks))

    # request_user_and_course_info(headers) -> (user_info, course_info)
    # user_info: [{'metadata': {'primary': True, 'verified': True, 'source': {'type': 'DOMAIN_PROFILE', 'id': '100529591481232043303'}, 'sourcePrimary': True}, 'value': '
    # course_info: [{'id': '645150769353', 'name': 'B4001401 力学1および演習_2024'}, {'id': '646077438079', 'name': 'B4000801 線形代数1および演習_2024'}, ...]

def async_request_courseWork_info(headers, course_ids):
    tasks = []
    for course_id in course_ids:
        tasks.append(async_function(request_courseWork_info, headers, course_id))
    return asyncio.run(async_functions(tasks))

    # async_request_courseWork_info(headers, course_ids) -> [courseWork_info]
    # courseWork_info: [{'id': '645150769545', 
    #                   'title': '第１５回', 
    #                   'alternateLink': 'https://classroom.google.com/c/NjQ1MTUwNzY5MzUz/a/NjQ1MTUwNzY5NTQ1/details', 
    #                   'updateTime': '2024-07-19T01:06:08.133Z', 
    #                   'dueDate': {'year': 2024, 'month': 7, 'day': 18}, 
    #                   'dueTime': {'hours': 3, 'minutes': 10}}, ...]

def async_request_submissions_info(headers, course_and_courseWork_ids):
    tasks = []
    for course_id, courseWork_id in course_and_courseWork_ids:
        tasks.append(async_function(reqeust_submissions_info, headers, course_id, courseWork_id))
    return asyncio.run(async_functions(tasks))

