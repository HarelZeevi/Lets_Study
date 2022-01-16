import http.client
import json

conn = http.client.HTTPSConnection("api.zoom.us")

params = "{\"topic\":\"TeachMe\",\"type\":2,\"start_time\":\"2020-27-10T20:40:00Z\",\"duration\":\"60\",\"timezone\":\"Asia/Jerusalem\",\"password\":\"12qwer123\"}"

headers = {
    'content-type': "application/json",
    'authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Im5UQVgxS0xPVGtDY3AxWVB1NEJNbWciLCJleHAiOjI1NTE2MzAyNjAsImlhdCI6MTYwNDM0MDY4OX0.UNOb3bhzjqZYlHycb7JRRlMg6_0Cu8iLcjfXkVjSbCw"
    }

conn.request("POST", "/v2/users/zUZRppYtTpGJk7jlHeTTiA/meetings", params, headers)

res = conn.getresponse()
data = res.read().decode("utf-8")



print(data[data.find("id",data.find("user_id") + 10): data.find("host_id")-2])
print(data[data.find("password"): data.find("h323_password") -2])
print(data[data.find("join_url"): data.find("password") -2])
