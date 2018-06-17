import React from 'react';

class Search extends React.Component { // 搜索框
    render () {
        return (
                <input 
                type="text" 
                placeholder='搜索' 
                className={this.props.className}
                value={this.props.value} 
                onFocus={this.props.onFocus}
                onChange={this.props.onChange} />
        )
    }
}

function Option (props) { // 列表项
    return (
        <div className={props.className ? props.className : 'option'} index={props.index} title={props.title}>{props.title}</div>
    )
}

class OptionsBoard extends React.Component { // 不知道怎么称呼他，他是一个列表，上下有两个占位的div
    
    handleScroll (e) {
        this.props.onScroll(e);
    }

    renderMobileBoard () {
        const dataSource = this.props.dataSource;
        return (
            <div 
            className='scroll-wrapper' 
            onScroll={this.handleScroll.bind(this)}>
                <div className='board-placeholder'></div>
                <div className='options-wrapper' ref={this.props.forwardedRef} >
                    {dataSource.map((item, index) => (
                        <Option 
                        title={item.title} 
                        key={index} />
                    ))}
                </div> 
                <div className='board-placeholder'></div>
            </div>
        )
    }

    renderPCBoard () {
        const dataSource = this.props.dataSource;
        return (
            <div 
            className='scroll-wrapper' 
            ref={this.props.forwardedRef}
            onClick={this.props.onClick}
            onScroll={this.handleScroll.bind(this)}>
                {dataSource.map((item, index) => (
                    <Option 
                    className={item.value === this.props.currentItem.value ? 'option  active-option' : 'option'}
                    title={item.title} 
                    index={index}
                    key={index} />
                ))}
            </div>
        )
    }
    render () {
        if (this.props.mode === 'PC') {
            return this.renderPCBoard();
        }
        return this.renderMobileBoard();
    }
}

function BoardRef (props, ref) { // 引用列表
    return <OptionsBoard {...props} forwardedRef={ref} />
}

let Board = React.forwardRef(BoardRef);

export class Selector extends React.Component {  

    constructor (props) {
        super(props);
        const current = JSON.parse(localStorage.getItem('currentData') || null);
        this.state = {
            searchKey: '', // 搜索关键词
            currentData: current ? current : this.props.dataSource, // 要展示的列表
            currentSelectedItem: localStorage.getItem('currentItem') || {}, // 当前选中的选项
            lastSelectedItem: {}, // 上次选中的item，点取消的时候要用到
            offset: 0, // 列表的偏移量，用来调整列表的位置，计算当前选中的元素下标
            isShowOptionsBoard: false, // 是否显示下拉列表
            isLoading: false, // 是否正在进行异步请求
            isEnd: false, // 数据已经加载完成
        }
        this.timer = null;
        this.board = React.createRef();
    }

    componentDidMount () {
        const current = JSON.parse(localStorage.getItem('currentData') || null);
        const index = localStorage.getItem('selectedIndex');
        if (current && index) {
            this.setState({
                currentData: current,
                currentSelectedItem: current[index],
            });
            if (this.props.mode === 'mobile') {
                this.board.current.parentNode.scrollTop = 40 * index;
            }
        }
    }

    // 更新currentData
    componentWillReceiveProps (nextprops) {
        if (nextprops.dataSource !== this.props.dataSource) {
            this.setState({
                isLoading: false,
                currentData: this.getRenderData(this.state.searchKey, nextprops.dataSource), 
            })
        }
    }
    // 获取要渲染的数据列表currentData
    getRenderData (filter,data) {
        let dataSource = data || this.props.dataSource;
        if (filter) {
            dataSource = dataSource.filter((item) => item.title.toString().includes(filter));
        }
        if (dataSource.length < this.props.listLength && !this.state.isEnd) {
            this.lazyLoadData(filter);
        }
        return dataSource;
    }
    // 异步加载数据处理函数
    lazyLoadData (searchKey) {
        // 防止重复发送请求
        if (this.state.isLoading) {
            return;
        }
        console.log('loading')
        // 标识正在加载数据中
        this.setState({
            isLoading: true,
        });
        const key = searchKey || this.state.searchKey;
        this.props.lazyLoadData && this.props.lazyLoadData(key);
    }
    // input处理函数，修改 searchKey 的值，并把滚动条移到最上面
    changeSearchKey (e) { 
        console.log('changeSearchKey')
        const searchKey = e.target.value;
        const currentData = this.getRenderData(searchKey);
        this.setState({
            searchKey: searchKey,
            currentData: currentData,
        })
        // 滚动条置0, 这里。。。。。。。。。。。。救命，感觉不应该这样做的*********************************************
        if (this.props.mode === 'PC') {
            this.board.current && (this.board.current.scrollTop = 0);
        } else {
            this.board.current && this.board.current.parentNode && (this.board.current.parentNode.scrollTop = 0); 
            
            const o = this.getCurrentItem(0, currentData);
            this.props.onChange && this.props.onChange(o);
        }
    }
    // 滚动到底部更新 toIndex 和 currentData
    handleScroll (e) { 

        if (this.props.mode === 'mobile') {
            clearTimeout(this.timer);
        }

        const target = e.target;
        const currentScrollTop = target.scrollTop;
        const maxScrollTop = target.scrollHeight - target.clientHeight;

        // 滑到底部，小于40px
        if (maxScrollTop - currentScrollTop < 40) { 
            // this.setState({
            //     toIndex: this.state.toIndex + this.props.listLength,
            //     currentData: this.getRenderData(this.state.fromIndex, this.state.toIndex + this.props.listLength, this.state.searchKey),
            // });
            this.lazyLoadData();
            console.log('haha')
            this.props.onScrollBottom && this.props.onScrollBottom(this.state.toIndex, this.state.toIndex + this.props.listLength);
        }

        if (this.props.mode === 'mobile') {
            // 监听scroll结束
            this.timer = setTimeout(() => { 
                const t =  currentScrollTop % 40;
                let offset = 0;

                // 设置偏移量，为了匹配蓝色边框
                this.board.current.style.webkitTransform = t > 20 
                    ? `translate3d(0, ${offset = - 40 + t}px, 0)` 
                    : `translate3d(0, ${offset = t}px, 0)`;

                const currentIndex = (this.board.current.parentNode.scrollTop - offset) / 40;
                // 记录offset，计算选中的元素的下标的时候要用到
                this.setState({
                    offset: offset, 
                    currentSelectedItem: this.state.currentData[currentIndex],
                })
                const o = this.getCurrentItem(currentIndex);
                this.props.onChange && this.props.onChange(o);
            }, 25);
        }
    }
    // 得到当前被选中的item
    getCurrentItem (currentIndex, data) {
        let currentData = data || this.state.currentData;
        if (currentData.length < currentIndex) {
            return {};
        }
        const o = currentData[currentIndex];

        // 边滚动边输入会出现 o 为 undefined 的错误，是什么原因呢……**************************************
        if (o) {
            return o;
        }
        return {};
    }
    // 存储数据
    storeData (index, searchKey, data) {
        localStorage.setItem('selectedIndex', index);
        localStorage.setItem('searchKey', searchKey);
        localStorage.setItem('currentData', JSON.stringify(data));
    }


    // 下面是移动端的控制函数
  
     // 点击确认按钮触发该事件
    onConfirm () {
        const last = this.state.lastSelectedItem || {};
        const current = this.state.currentSelectedItem;

        // 更新 lastSelectedItem
        this.setState({
            lastSelectedItem: current,
        })
        const index = (this.board.current.parentNode.scrollTop - this.state.offset) / 40;
        // console.log(index)
        this.storeData(index, this.state.searchKey, this.state.currentData);
        this.props.onConfirm && this.props.onConfirm(last, current);
    }

    // 点击取消按钮触发该事件
    onCancel () {
        const last = this.state.lastSelectedItem;
        this.setState({
            currentSelectedItem: last,
        })
        console.log('last', last)
        this.props.onCancel && this.props.onCancel(last)
    }

    // 渲染移动端的selector
    renderMobileSelector () {
        return (
            <div className='selector' style={this.props.style ? this.props.style.selector : {} }>
                <div className='selector-header'>
                    <button 
                    className='cancel-btn btn' 
                    onClick={this.onCancel.bind(this)}>取消</button>
                    <Search 
                    value={this.state.searchKey}
                    onChange={this.changeSearchKey.bind(this)} />
                    <button 
                    className='verify-btn btn' 
                    onClick={this.onConfirm.bind(this)}>确定</button>
                </div>
                <div className='selector-body'>
                    <Board 
                    mode='mobile'
                    ref={this.board} 
                    dataSource={this.state.currentData} 
                    onScroll={this.handleScroll.bind(this)} />
                    <div className='mask'></div>
                </div>
            </div>
        )
    }

    // PC端的控制函数

    // 点击列表项， 触发onChange函数
    onClickOption (e) {
        // 这里，应该不能用 e.target.getAttribute 的，想想有没有别的方法 ********************
        const index = parseInt(e.target.getAttribute('index'));
        const current = this.state.currentData[index];
        const last = this.state.currentSelectedItem;
        this.setState({
            currentSelectedItem: current,
            lastSelectedItem: last,
            searchKey: current.title,
        })
        this.hideOptionsBoard();
        this.storeData(index, current.title, this.state.currentData); // 存储状态
        this.props.onChange && this.props.onChange(current);
    }
    // 隐藏下拉列表
    hideOptionsBoard () {
        this.setState({
            isShowOptionsBoard: false,
        })
    }
    // 显示下拉列表
    showOptionsBoard () {
        this.setState({
            isShowOptionsBoard: true
        })
        const index = localStorage.getItem('selectedIndex');
        const searchKey = localStorage.getItem('searchKey');

        setTimeout(() => {
            this.board.current && (this.board.current.scrollTop = 40 * (index - 2));
        }, 0);
    }
    // 点击箭头触发该函数
    handleClickArrow () {
        this.state.isShowOptionsBoard ? this.hideOptionsBoard() : this.showOptionsBoard();
    }
    // 渲染PC端的selector
    renderPCSelector () {
        return (
            <div className='PC-selector' style={this.props.style ? this.props.style.selector : {} }>
                <div className='PC-selector-header'>
                    <Search 
                    className='PC-search-input'
                    onFocus={this.showOptionsBoard.bind(this)}
                    value={this.state.searchKey}
                    onChange={this.changeSearchKey.bind(this)} />
                    <i className='arrow' onClick={this.handleClickArrow.bind(this)}></i>
                </div>
                {this.state.isShowOptionsBoard && <div className='PC-selector-body'>
                    <Board 
                    mode='PC'
                    ref={this.board} 
                    dataSource={this.state.currentData}
                    currentItem={this.state.currentSelectedItem} // 用来判断列表项是否高亮
                    onClick={this.onClickOption.bind(this)} 
                    onScroll={this.handleScroll.bind(this)} />
                </div>}
            </div>
        )
    }

    render () {
        const mode = this.props.mode || 'PC';
        if (mode === 'PC') {
            return this.renderPCSelector();
        } else {
            return this.renderMobileSelector();
        }
    }
}
 
Selector.defaultProps = {
    listLength: 50, 
    mode: 'PC',
}

