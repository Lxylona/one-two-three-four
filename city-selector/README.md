没用Redux的在 `./src/components/withoutRedux.js`中

使用了Redux的在`./src/components/withRedux/`中

然后我用了之前写的Selector来做选择框了


**感受到的区别:**

`withoutRedux`中，代码根据操作来块，比如修改了`province`，这个操作导致的后果都放在一个函数`onProcvinceChange`中。

`withRedux`中，代码根据数据来分块，比如修改了`province`，这个操作影响到了`currentProvince`, `cityList`, 'areaList`，这三个`state`都有自己的`reducer`，分别在自己的`reducer`中处理。让我觉得比较清晰。



**[demo](https://lxylona.github.io/)**
因为还有数据文件，感觉文件有点多，所以我就放gitpage上面了
