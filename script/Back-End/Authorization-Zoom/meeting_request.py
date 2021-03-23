import json
import requests as r
with open ("zoomMeeting.txt") as file:
    data = json.load(file)

print(data)

response = r.post("https://webexapis.com/v1/meetings", data=data)
print(response.json())
print(response)
