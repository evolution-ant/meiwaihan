from meilisearch import Client

# 连接到 MeiliSearch 实例，包括 API 密钥（如果需要）
client = Client("http://127.0.0.1:7700", "T2A0BRSf_sNrLe5zQPvHwyKclt-UWmekaGr2mGB-hds")

# 获取所有索引
indexes_response = client.get_indexes()

# 从结果中提取索引对象列表
indexes = indexes_response["results"]

# 定义你想要保留的索引列表
indexes_to_keep = [
    "Level8luan_2",
    "songci_authors",
    "songci",
    "tangshi_authors",
    "tangshi",
    "tangshi300",
    "TOEFL_2",
]

# 遍历索引对象
for index_obj in indexes:
    index_uid = index_obj.uid  # 从对象获取 UID
    print(index_uid)
    # 如果索引不在保留列表中，则删除
    if index_uid not in indexes_to_keep:
        client.index(index_uid).delete()
        print("delete:", index_uid)
