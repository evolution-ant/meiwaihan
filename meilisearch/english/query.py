from meilisearch import Client


def translate(head_word_to_search):
    # 连接到 MeiliSearch 实例
    client = Client(
        "http://127.0.0.1:7700", "T2A0BRSf_sNrLe5zQPvHwyKclt-UWmekaGr2mGB-hds"
    )

    index_name = "Level8luan_2"
    index = client.index(index_name)
    filter = f"headWord='{head_word_to_search}'"
    search_results = index.search(
        head_word_to_search,
        {
            "filter": filter,
        },
    )
    hits = search_results["hits"]
    if len(hits) == 0:
        return None
    hit = hits[0]
    content = hit["content"]["word"]["content"]
    head_word = hit["headWord"]
    sentence = content["sentence"]["sentences"][0]
    ch_sentence = sentence["sCn"]
    en_sentence = sentence["sContent"]
    trans = content["trans"]
    # 遍历trans，取出所有的 pos 和 tranCn
    tansStr = ""
    for tran in trans:
        tansStr += f"{tran['pos']}. {tran['tranCn']}\n"
    # 去除最后一个换行符
    tansStr = tansStr[:-1]
    ukphone = content["ukphone"]
    ukspeech = content["ukspeech"]
    return {
        "head_word": head_word,
        "tansStr": tansStr,
        "ukphone": ukphone,
        "en_sentence": en_sentence,
        "ch_sentence": ch_sentence,
        "ukspeech": ukspeech,
    }


head_word_to_search = "good"

translatedWord = translate(head_word_to_search)
print(translatedWord)
