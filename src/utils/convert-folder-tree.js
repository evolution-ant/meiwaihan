export function convertFolderTree(rawData) {
  // 初始处理，将所有attributes下面的属性提升到顶级，并添加一个children空数组
  const initialProcessed = rawData.map(({ id, attributes }) => ({
    id,
    ...attributes,
    children: [],
  }));

  // 构建一个字典，以路径作为键，引用作为值，方便后续快速查找
  const pathDict = initialProcessed.reduce((acc, cur) => {
    acc[cur.path] = cur;
    return acc;
  }, {});

  // 进行关系构建
  initialProcessed.forEach((node) => {
    const pathArr = node.path.split('/');
    if (pathArr.length > 2) {
      // 如果路径长度大于2，说明有父节点
      const parentPath = pathArr.slice(0, pathArr.length - 1).join('/'); // 找到父节点路径
      const parent = pathDict[parentPath]; // 通过路径找到父节点
      if (parent) {
        // 如果父节点存在
        parent.children.push(node); // 将当前节点加入到父节点的children中
      }
    }
  });

  // 过滤出顶层节点
  const result = initialProcessed.filter((node) => node.path.split('/').length === 2);
  return result;
}
