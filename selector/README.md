### 事件支持
`onConfirm(selectedObj)`: 点击确认按钮会触发，传入的参数为被选中的列表项对象`{value:value, title: title}`

`onCancel()`: 点击取消按钮触发

`onScrollBottom(preToIndex, newToIndex)`: 滚动到列表底部的时候触发，传入的参数为旧的`toIndex`, 新的`toIndex`，也就是列表最后一个子节点的index

### 其他参数
`dataSource`: 数据源，接受一个数组，每一个元素的形式为`{value: value, title: title}`

`listLength`: 一次渲染的列表长度，默认为50 

### [demo](https://jsfiddle.net/cbxh0o9L/)
