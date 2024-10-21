import requests
import asyncio

COMMON = "https://classroom.googleapis.com/v1/"
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
            print(response)
            return {"error": response.get("error", {}).get("message", "An error occurred"), "url": url}
        return response
    
    def request_courses(self):
        response = self.request(f"{COMMON}courses?fields={COURSE_INFO_FIELDS}")
        return response.get("courses", [])
    
    def request_courseWork(self, courseId=""):
        response = self.request(f"{COMMON}courses/{courseId}/courseWork?fields={COURSEWORK_INFO_FIELDS}")
        return response.get("courseWork", [])
    
    def reqeust_submissions(self, course_and_courseWork_ids):
        courseId = course_and_courseWork_ids[0]
        courseWorkId = course_and_courseWork_ids[1]
        response = self.request(f"{COMMON}courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions?fields={SUBMISSION_INFO_FIELDS}")
        return response.get("studentSubmissions", [])[0]
    
    def async_requests(self, function, args):
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