from flask import Flask, request, Response
from flask_cors import CORS
from flask_caching import Cache
import requests
import json

app = Flask(__name__)
CORS(app)

BASE_URL = "http://23.20.36.148:1337"
MIDDLEWARE_URL = "http://23.20.36.148:1338"


def upload_middleware(path, headers, files_dict):
    print("custom upload")
    for file in files_dict["upload"]:
        img_byte_arr = file.read()
        file.seek(0)
    url = MIDDLEWARE_URL + "/api/upload"

    headers = {"Authorization": headers["Authorization"]}
    files = {"files": ("image.png", img_byte_arr, "image/png")}
    response = requests.post(url, headers=headers, files=files)
    return Response(response.content, response.status_code, headers)


@app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def proxy(path):
    headers = {key: value for (key, value) in request.headers if key != "Host"}
    data = request.get_data()
    files_dict = request.files.to_dict(flat=False)
    if path == "api/upload" and "upload" in files_dict.keys():
        return upload_middleware(path, headers, files_dict)
    else:
        resp = requests.request(
            method=request.method,
            url=f"{BASE_URL}/{path}",
            headers=headers,
            data=data,
            cookies=request.cookies,
            params=request.args,
        )

        if path == "api/upload":
            resp_json = json.loads(resp.content)
            new_resp_json = {"url": MIDDLEWARE_URL + resp_json[0]["url"]}
            new_content = json.dumps(new_resp_json)
            return Response(new_content, resp.status_code, headers)
        else:
            response = Response(resp.content, resp.status_code, headers)
            return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1338)
