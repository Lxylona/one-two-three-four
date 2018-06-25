### 移动端事件支持

`onChange(currentObj)`: 滚动停止的时候会触发，传入的参数为被选中的列表项对象`{value:value, title: title}`

`onConfirm(lastObj, currentObj)`: 点击确认按钮会触发，传入的参数为当前被选中的列表项和上一次被选中的列表项

`onCancel(lastObj)`: 点击取消按钮触发，传入的参数为上次选中的列表项。

`lazyLoadData(searchKey)`: 异步加载数据的函数，传入的参数为当前用户输入的搜索关键词。


### PC端事件支持

`onChange(currentObj)`: 点击某一列表项的时候会触发，传入的参数为被选中的列表项对象`{value:value, title: title}`

`lazyLoadData(searchKey)`: 异步加载数据的函数，传入的参数为当前用户输入的搜索关键词。


### 其他参数

`mode`: `mobile` 或者 `PC`，移动端或者PC端渲染。。

`dataSource`: 数据源，接受一个数组，每一个元素的形式为`{value: value, title: title}`

`identit1`: 用来缓存数据，如果一个页面存在多个selector，identity保证每个selector的缓存不会被覆盖

`listLength`: 一次渲染的列表长度，默认为50，根据搜索关键词过滤列表的时候如果列表长度小于`listLength`，会继续调用`lazyLoadData`来加载更多数据



### [demo](https://jsfiddle.net/n5u2wwjg/49749/)
