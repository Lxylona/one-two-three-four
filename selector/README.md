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

`listLength`: 一次渲染的列表长度，默认为50，根据搜索关键词过滤列表的时候如果列表长度小于`listLength`，会继续调用`lazyLoadData`来加载更多数据

### 没有解决的问题

1. 缓存选择位置然后下次跳到这个位置，因为异步加载数据，可能每次加载的`dataSource`都是不一样的，所以没办法只存一个`index`，所以我存了两个数据：当前渲染的列表和选中的项在列表中的index。这个可能在数据很多的情况下不是很好但是我想不出别的解决方法。

2. 移动端滚动结束的时候我用`transform`来调整列表的位置，滚动用的`scroll`，所以滚动结束的时候会不连贯，我之前纠结了很久，似乎用`scroll`也确实没法解决这个问题。其实移动端应该都用`transform`的（我猜），这样才能让滚动连贯起来应该。我会尝试改成`transform`的。

### [demo](https://jsfiddle.net/n5u2wwjg/49749/)
