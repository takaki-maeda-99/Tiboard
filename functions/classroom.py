import requests
import asyncio

COURSE_INFO_FIELDS = "courses(name,id,alternateLink)"
COURSEWORK_INFO_FIELDS = "courseWork(courseId,id,title,description,materials,updateTime,dueDate,dueTime,alternateLink)"
SUBMISSION_INFO_FIELDS = "studentSubmissions(courseWorkId,creationTime,updateTime,state)"

class Classroom:
    def __init__(self, creds):
        headers = {"Authorization": f"Bearer {creds.token}"}
        self.headers = headers
    
    def request(self, url):
        response = requests.get(url, headers=self.headers).json()
        if response.get("error", None):
            return {"error": response.get("error", {}).get("message", "An error occurred"), "url": url}
        return response

    def request_person(self):
        return self.request("https://people.googleapis.com/v1/people/me?personFields=emailAddresses")
    
    def request_courses(self):
        return self.request(f"https://classroom.googleapis.com/v1/courses?fields={COURSE_INFO_FIELDS}")
    
    def request_courseWork(self, courseId=""):
        return self.request(f"https://classroom.googleapis.com/v1/courses/{courseId}/courseWork?fields={COURSEWORK_INFO_FIELDS}")
    
    def reqeust_submissions(self, courseId="", courseWorkId=""):
        return self.request(f"https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions?fields={SUBMISSION_INFO_FIELDS}")

    def async_requests(self, function, *args):
        tasks = []
        for arg in args:
            tasks.append(async_function(function, arg))
        return asyncio.run(async_functions(tasks))
    
    def request_courseworks(self, course_ids):
        return self.async_requests(self.request_courseWork, course_ids)
    
    def request_submissions(self, course_and_courseWork_ids):
        return self.async_requests(self.reqeust_submissions, course_and_courseWork_ids)

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

def async_request_courseWork_info(headers, course_ids):
    tasks = []
    for course_id in course_ids:
        tasks.append(async_function(request_courseWork_info, headers, course_id))
    return asyncio.run(async_functions(tasks))

def async_request_submissions_info(headers, course_and_courseWork_ids):
    tasks = []
    for course_id, courseWork_id in course_and_courseWork_ids:
        tasks.append(async_function(reqeust_submissions_info, headers, course_id, courseWork_id))
    return asyncio.run(async_functions(tasks))


def request_person_info(headers):
    response = requests.get(f"https://people.googleapis.com/v1/people/me?personFields=emailAddresses", headers=headers).json()
    if response.get("error", None):
        return {"error": response.get("error", {}).get("message", "An error occurred")}
    
    person_info = response.get("emailAddresses", [])[0]
    person_extracted_info = {"user_id": person_info.get("metadata", {}).get("source", {}).get("id", ""), "user_email": person_info.get("value", "")}
    
    return person_extracted_info

def request_courses_info(headers):
    COURSE_INFO_FIELDS = "courses(name,id,alternateLink)"
    
    response = requests.get(f"https://classroom.googleapis.com/v1/courses?fields={COURSE_INFO_FIELDS}", headers=headers).json()
    if response.get("error", None):
        return {"error": response.get("error", {}).get("message", "An error occurred")}
    return response.get("courses", [])

def request_courseWork_info(headers, courseId=""):
    COURSEWORK_INFO_FIELDS = "courseWork(courseId,id,title,description,materials,updateTime,dueDate,dueTime,alternateLink)"
    
    response = requests.get(f"https://classroom.googleapis.com/v1/courses/{courseId}/courseWork?fields={COURSEWORK_INFO_FIELDS}", headers=headers).json()
    if response.get("error", None):
        return [{"error": response.get("error", {}).get("message", "An error occurred"), "courseId": courseId }]
    return response.get("courseWork", [])

def reqeust_submissions_info(headers, courseId="", courseWorkId=""):
    SUBMISSION_INFO_FIELDS = "studentSubmissions(courseWorkId,creationTime,updateTime,state)"
    
    response = requests.get(f"https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions?fields={SUBMISSION_INFO_FIELDS}", headers=headers).json()
    if response.get("error", None):
        return {"error": response.get("error", {}).get("message", "An error occurred"), "courseId": courseId, "courseWorkId": courseWorkId}
    return response.get("studentSubmissions", [])[0]
