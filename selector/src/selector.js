import React from 'react';

class Search extends React.Component { // 搜索框
    render () {
        return (
                <input 
                type="text" 
                placeholder='搜索' 
                className='search-input' 
                value={this.props.value} 
                onChange={this.props.onChange} />
        )
    }
}

function Option (props) { // 列表项
    return (
        <div className='option'>{props.title}</div>
    )
}

class OptionsBoard extends React.Component { // 不知道怎么称呼他，他是一个列表，上下有两个占位的div
    constructor (props) {
        super(props);
        this.board = React.createRef();
    }
    handleScroll (e) {
        this.props.onScroll(e);
    }
    render () {
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
                        key={item.value} />
                    ))}
                </div> 
                <div className='board-placeholder'></div>
            </div>
        )
    }
}

function BoardRef (props, ref) { // 引用列表
    return <OptionsBoard {...props} forwardedRef={ref} />
}

let Board = React.forwardRef(BoardRef);

export class Selector extends React.Component {  

    constructor (props) {
        super(props);
        this.state = {
            fromIndex: 0,
            toIndex: this.props.listLength,
            searchKey: '', // 搜索关键词
            currentData: this.getRenderData(0, this.props.listLength), // 要展示的列表
            offset: 0, // 列表的偏移量，用来调整列表的位置，计算当前选中的元素下标
        }
        this.timer = null;
        this.board = React.createRef();
    }
    
    // input处理函数，修改 searchKey 的值，并把滚动条移到最上面
    changeSearchKey (e) { 
        const searchKey = e.target.value;
        this.setState({
            searchKey: searchKey,
            currentData: this.getRenderData(0, this.props.listLength, searchKey),
            toIndex: this.props.listLength,
        })
        this.board.current && this.board.current.parentNode && (this.board.current.parentNode.scrollTop = 0); // 滚动条置0
    }

    // 获取要渲染的数据列表currentData
    getRenderData (from, to, filter) {
        let dataSource = this.props.dataSource;
        if (filter) {
            dataSource = dataSource.filter((item) => item.title.toString().includes(filter));
        }
        return dataSource.slice(from, to);
    }

    // 滚动到底部更新 toIndex 和 currentData
    handleScroll (e) { 

        clearTimeout(this.timer);

        const target = e.target;
        const currentScrollTop = target.scrollTop;
        const maxScrollTop = target.scrollHeight - target.clientHeight;

        // 滑到底部，小于40px
        if (maxScrollTop - currentScrollTop < 40) { 
            this.setState({
                toIndex: this.state.toIndex + this.props.listLength,
                currentData: this.getRenderData(this.state.fromIndex, this.state.toIndex + this.props.listLength, this.state.searchKey),
            });

            this.props.onScrollBottom && this.props.onScrollBottom(this.state.toIndex, this.state.toIndex + this.props.listLength);
        }

        // 监听scroll结束
        this.timer = setTimeout(() => { 
            const t =  currentScrollTop % 40;
            let offset = 0;

            // 设置偏移量，为了匹配蓝色边框
            this.board.current.style.webkitTransform = t > 20 
                ? `translate3d(0, ${offset = - 40 + t}px, 0)` 
                : `translate3d(0, ${offset = t}px, 0)`;

            // 记录offset，计算选中的元素的下标的时候要用到
            this.setState({
                offset: offset, 
            })
        }, 25);
    }

    // 点击确认按钮触发该函数
    handleSelectOption () {
        const currentIndex = (this.board.current.parentNode.scrollTop - this.state.offset) / 40;
        if (this.state.currentData.length <= 0) {
            return;
        }
        const o = this.state.currentData[currentIndex];
        this.props.onConfirm && this.props.onConfirm(o);
    }

    render () {
        return (
            <div className='selector' style={this.props.style ? this.props.style.selector : {} }>
                <div className='selector-header'>
                    <button 
                    className='cancel-btn btn' 
                    onClick={this.props.onCancel}>取消</button>
                    <Search 
                    value={this.state.searchKey}
                    onChange={this.changeSearchKey.bind(this)} />
                    <button 
                    className='verify-btn btn' 
                    onClick={this.handleSelectOption.bind(this)}>确定</button>
                </div>
                <div className='selector-body'>
                    <Board 
                    ref={this.board} 
                    dataSource={this.state.currentData} 
                    onScroll={this.handleScroll.bind(this)} />
                    <div className='mask'></div>
                </div>
            </div>
        )
    }
}
 
Selector.defaultProps = {
    listLength: 50, 
}

