from meilisearch import Client
import json
import os

# 连接到 MeiliSearch 实例
client = Client("http://127.0.0.1:7700", "T2A0BRSf_sNrLe5zQPvHwyKclt-UWmekaGr2mGB-hds")


def replaceFran(str):
    fr_en = [
        ["é", "e"],
        ["ê", "e"],
        ["è", "e"],
        ["ë", "e"],
        ["à", "a"],
        ["â", "a"],
        ["ç", "c"],
        ["î", "i"],
        ["ï", "i"],
        ["ô", "o"],
        ["ù", "u"],
        ["û", "u"],
        ["ü", "u"],
        ["ÿ", "y"],
    ]
    for i in fr_en:
        str = str.replace(i[0], i[1])
    return str


# 指定要查询的目录
directory = "./data"

# 遍历指定目录下的所有文件
for filename in os.listdir(directory):
    # 检查是否是 JSON 文件
    if filename.endswith(".json"):
        # 构造完整的文件路径
        filepath = os.path.join(directory, filename)
        # 读取文件并解析 JSON
        documents = []
        with open(filepath, "r") as f:
            for line in f:
                # 移除行尾的换行符，并将行内容解析为 JSON 对象
                line = replaceFran(line)  # 如果你有此函数
                json_object = json.loads(line.strip())
                json_object["id"] = json_object["wordRank"]
                # 移除bookId
                json_object.pop("bookId")
                documents.append(json_object)

        # 创建或获取一个与文件名对应的索引
        index_name = os.path.splitext(filename)[0]  # 使用文件名（不包括扩展名）作为索引名称
        index = client.index(index_name)

        # 将文档添加到索引中
        update = index.add_documents(documents)
        print(f"数据插入 {index_name} 成功！")
