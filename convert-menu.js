const responseData = {
    "data": {
        "id": 1,
        "attributes": {
            "title": "AdminMenu",
            "slug": "AdminMenu",
            "items": {
                "data": [
                    {
                        "id": 34,
                        "attributes": {
                            "order": 0,
                            "title": "overview v5.0.0",
                            "url": "",
                            "target": null,
                            "isGroupName": true,
                            "children": {
                                "data": [
                                    {
                                        "id": 36,
                                        "attributes": {
                                            "order": 0,
                                            "title": "Post",
                                            "url": "/dashboard/",
                                            "target": null,
                                            "isGroupName": null,
                                            "children": {
                                                "data": []
                                            }
                                        }
                                    },
                                    {
                                        "id": 37,
                                        "attributes": {
                                            "order": 1,
                                            "title": "Two",
                                            "url": "/dashboard/joke-manager/",
                                            "target": null,
                                            "isGroupName": null,
                                            "children": {
                                                "data": []
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "id": 35,
                        "attributes": {
                            "order": 1,
                            "title": "management",
                            "url": "",
                            "target": null,
                            "isGroupName": true,
                            "children": {
                                "data": [
                                    {
                                        "id": 39,
                                        "attributes": {
                                            "order": 0,
                                            "title": "User",
                                            "url": "/dashboard/group/",
                                            "target": null,
                                            "isGroupName": null,
                                            "children": {
                                                "data": [
                                                    {
                                                        "id": 40,
                                                        "attributes": {
                                                            "order": 0,
                                                            "title": "Three",
                                                            "url": "/dashboard/group/three/",
                                                            "target": null,
                                                            "isGroupName": null,
                                                            "children": {
                                                                "data": []
                                                            }
                                                        }
                                                    },
                                                    {
                                                        "id": 41,
                                                        "attributes": {
                                                            "order": 1,
                                                            "title": "five",
                                                            "url": "/dashboard/group/five/six/",
                                                            "target": null,
                                                            "isGroupName": null,
                                                            "children": {
                                                                "data": [
                                                                    {
                                                                        "id": 42,
                                                                        "attributes": {
                                                                            "order": 0,
                                                                            "title": "Six",
                                                                            "url": "/dashboard/group/five/six/",
                                                                            "target": null,
                                                                            "isGroupName": null,
                                                                            "children": {
                                                                                "data": []
                                                                            }
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        }
    },
    "meta": {}
};  // 原始数据


function transformData(originalData) {
    const result = originalData.data.attributes.items.data.sort((a, b) => a.attributes.order - b.attributes.order).map(item => ({
        ...transformItem(item, true),
    }));
  
    return result;
  }
  
  function transformItem(item, isRoot = false) {
    const res = {};
    if (item.attributes.isGroupName) {
      res.subheader = item.attributes.title;
    } else {
      res.title = item.attributes.title;
      res.path = item.attributes.url;
    }
  
    if (item.attributes.children.data.length > 0) {
        const childrenItems = item.attributes.children.data.sort((a, b) => a.attributes.order - b.attributes.order).map(subItem => ({
            ...transformItem(subItem),
        }
        ));
  
      // 在根层使用 "items"，在其他层使用 "children"
      if (isRoot) {
        res.items = childrenItems;
      } else {
        res.children = childrenItems;
      }
    }
  
    return res;
  }
  
  // 假设 responseData 是从接口获取的数据
  const transformedData = transformData(responseData);
  console.log(JSON.stringify(transformedData, null, 2));
  