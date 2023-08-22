from meilisearch import Client

# 连接到 MeiliSearch 实例
client = Client("http://127.0.0.1:7700", "T2A0BRSf_sNrLe5zQPvHwyKclt-UWmekaGr2mGB-hds")

# 指定索引名称
index_name = "Level8luan_2"

# 获取索引对象
index = client.index(index_name)

# 获取当前索引的设置
settings = index.get_settings()

# 添加 "headWord" 到可过滤属性列表中
filterable_attributes = settings["filterableAttributes"]
filterable_attributes.append("headWord")

# 更新索引设置
resutl = index.update_settings({"filterableAttributes": filterable_attributes})
print(resutl)
