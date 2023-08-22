from meilisearch import Client
import json
import os
import time

# 连接到 MeiliSearch 实例
client = Client("http://127.0.0.1:7700", "T2A0BRSf_sNrLe5zQPvHwyKclt-UWmekaGr2mGB-hds")


# 指定要查询的目录
directory = "./data"

# 遍历指定目录下的所有文件
for filename in os.listdir(directory):
    # 检查是否是 JSON 文件
    if filename.endswith(".json") and filename.startswith("authors.song."):
        # 构造完整的文件路径
        filepath = os.path.join(directory, filename)
        # 读取文件并解析 JSON
        with open(filepath, "r") as f:
            documents = json.load(f)
            # for document in documents:
            #     # 把其中的 paragraphs 数组 join 成字符串
            #     content = "\r\n".join(document["paragraphs"])
            #     document["content"] = content
            #     # 删除 paragraphs
            #     document.pop("paragraphs")
        # 延迟 3 秒
        time.sleep(0.5)
        index = client.index("songci_authors")
        # 将文档添加到索引中
        update = index.add_documents(documents)
        print(f"数据插入 {filename} 成功！")
