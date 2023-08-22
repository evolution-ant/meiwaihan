from meilisearch import Client

# 连接到 MeiliSearch 实例，包括 API 密钥（如果需要）
client = Client("http://127.0.0.1:7700", "T2A0BRSf_sNrLe5zQPvHwyKclt-UWmekaGr2mGB-hds")

client.index("songci").delete()

print("索引删除成功！")
