import React from 'react';

// 搜索框
class Search extends React.Component { 
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

// 列表项
function Option (props) {
    return (
        <div className={props.className ? props.className : 'option'} index={props.index} title={props.title}>{props.title}</div>
    )
}

// 放列表项的列表
class OptionsBoard extends React.Component { 

    handleScroll (e) {
        // console.log('scroll')
        this.props.onScroll(e);
    }

    handleTouchStart (e) {
        this.props.handleTouchStart(e.changedTouches[0].clientY);
    }
    handleTouchMove (e) {
        this.props.handleTouchMove(e.changedTouches[0].clientY);
    }
    handleTouchEnd (e) {
        this.props.handleTouchEnd();
    }
    

    renderMobileBoard () {
        const dataSource = this.props.dataSource;
        return (
            <div className='mobile-scroll-wrapper'>
                <div 
                className='mobile-touchboard'
                onTouchStart={this.handleTouchStart.bind(this)}
                onTouchMove={this.handleTouchMove.bind(this)}
                onTouchEnd={this.handleTouchEnd.bind(this)}></div>
                <div 
                style={{transform: 'translate3d(0,80px,0)'}}
                className='options-wrapper' 
                ref={this.props.forwardedRef} >
                    {dataSource.map((item, index) => (
                        <Option 
                        title={item.title} 
                        key={index} />
                    ))}
                </div> 
            </div>
        )
    }

    renderPCBoard () {
        const {dataSource, onClick, currentItem, forwardedRef, isLoading} = this.props;
        return (
            <div 
            className='PC-scroll-wrapper' 
            ref={forwardedRef}
            onClick={onClick}
            onScroll={this.handleScroll.bind(this)}>
                {dataSource.map((item, index) => (
                    <Option 
                    className={item.value === currentItem.value ? 'option  active-option' : 'option'}
                    title={item.title} 
                    index={index}
                    key={index} />
                ))}
                {isLoading && <div className='option' onClick={(e) => {e.stopPropagation();}}>loading...</div>}
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

const Board = React.forwardRef(BoardRef);

export class Selector extends React.Component {  

    constructor (props) {
        super(props);
        const {listLength, dataSource} = this.props;
        const renderData = dataSource.data.slice(0, listLength)
        const o = JSON.parse(this.getCachedCurrentItem());
        const searchKey = o ? o.title : '';
        const currentSelectedItem = o ? o : {};

        this.state = {
            searchKey: searchKey, // 搜索关键词
            renderData: renderData, // 要展示的列表
            currentSelectedItem: currentSelectedItem, // 当前选中的选项
            lastSelectedItem: {}, // 上次选中的item，点取消的时候要用到
            isShowOptionsBoard: false, // 是否显示下拉列表
            fromIndex: 0,
            toIndex: listLength,
            isLoading: false, // 是否正在进行异步请求
            isEnd: dataSource.isEnd, // 数据已经加载完成

            lastY: 0,
            speed: 0,
            offset: 0,
            direction: 1, // 1为向下， 0为向上
        }
        this.timer = null;
        this.board = React.createRef();
        this.props.onChange(currentSelectedItem);
    }

    // 更新renderData
    componentWillReceiveProps (nextprops) {
        
        if (nextprops.dataSource !== this.props.dataSource) {
            const {fromIndex, toIndex, searchKey} = this.state;
            const {data, isEnd} = nextprops.dataSource;
            const renderData = this.getRenderData(fromIndex, toIndex, data, searchKey);

            this.setState({
                isLoading: false,
                renderData: renderData,
                isEnd: isEnd,
            }, () => {
                if (renderData.length < this.props.listLength && !isEnd) {
                    this.lazyLoadData(this.state.searchKey);
                }
            })     
        }
    }
    // 更新展示数据
    refreshData () {
        const {fromIndex, toIndex, searchKey} = this.state; 
        const {listLength, dataSource} = this.props;
        const newToIndex = toIndex + listLength;
        const renderData = this.getRenderData(fromIndex, newToIndex, dataSource.data, searchKey);
        this.setState({
            toIndex: newToIndex,
            renderData: renderData,
        })
    }
    // 获取要渲染的数据列表renderData
    getRenderData (fromIndex, toIndex, dataSource, filter) {
        let renderData = dataSource;
        if (filter || filter === 0) {
            renderData = dataSource.filter((item) => item.title.toString().includes(filter));
        }
        if ((renderData.length < toIndex) && !this.state.isEnd) {
            this.lazyLoadData(filter);
        }
        return renderData.slice(fromIndex, toIndex);
    }
    // 异步加载数据
    lazyLoadData (filter) {
        const {isLoading} = this.state;

        // 防止重复发送请求
        if (isLoading) {
            return;
        }
        // 标识正在加载数据中
        this.setState({
            isLoading: true,
        });
        this.props.lazyLoadData && this.props.lazyLoadData(filter);
    }
    // 存储数据
    cacheCurrentItem (o) {
        const id = this.props.identity;
        const key = this.props.identity ? `${id}-selectedItem` : `selectedItem`;
        localStorage.setItem(key, JSON.stringify(o));
    }
    // 取出数据
    getCachedCurrentItem () {
        const key = this.props.identity ? `${this.props.identity}-selectedItem` : `selectedItem`;
        const o = localStorage.getItem(key);
        return o ? o : null;
    }
    // input处理函数，修改 searchKey 的值，并把滚动条移到最上面
    handleInput (e) { 
        const searchKey = e.target.value;
        const {fromIndex} = this.state;
        const {listLength, dataSource} = this.props;
        const renderData = this.getRenderData(fromIndex, listLength, dataSource.data, searchKey);
        this.setState({
            renderData: renderData,
            toIndex: listLength,
            searchKey: searchKey,
        })
        
        if (this.props.mode === 'PC') { // 滚动条置0
            this.board.current && (this.board.current.scrollTop = 0);
        } else { // 设置初始位移，选中第一个选项
            this.setOffset(80)
            const current = this.getCurrentItem(80, renderData);
            this.setState({
                currentSelectedItem: current,
            })
            this.props.onChange && this.props.onChange(current);
        }
    }


    // 移动端的控制函数

    // 得到当前被选中的item
    getCurrentItem (offset, data) {
        const index = parseInt(-offset / this.props.itemHeight) + 2;
        const item = data[index];
        if (item) {
            return item;
        }
        return {};
    }
    handleTouchStart (currentY) {
        this.setState({
            lastY: currentY,
        })
    }
    handleTouchMove (currentY) {
        const {renderData} = this.state;
        const speed = currentY - this.state.lastY;
        const direction = speed > 0 ? 1 : 0; // 上 or 下
        const offset = this.state.offset + speed;
        this.setState({
            speed: speed,
            lastY: currentY,
            offset: offset,
            direction: direction,
        });
        this.setOffset(offset);
        if (offset < -(renderData.length - 5) * this.props.itemHeight) {
            this.refreshData()
        }
    }
    handleTouchEnd () {
        const {itemHeight} = this.props;
        const {offset, direction, renderData} = this.state;
        let distance = offset % itemHeight;
        distance = direction === 0 ? distance + itemHeight : distance;
        // 设置偏移量
        this.setOffset(offset - distance);

        // 当前选中的元素
        const current = this.getCurrentItem(offset - distance, renderData);
        this.setState({
            currentSelectedItem: current,
        })
        this.props.onChange && this.props.onChange(current);
    }
    // 设置偏移量
    setOffset (offset) {
        let finalOffset = offset;
        const {renderData} = this.state;
        const {itemHeight} = this.props;
        if (offset > 80) {
            finalOffset = 80;
        }
        if (offset < -(renderData.length - 3) * itemHeight) {
            finalOffset = -(renderData.length - 3) * itemHeight;
        }
        this.board.current.style.webkitTransform = `translate3d(0, ${finalOffset}px, 0)`;
        this.setState({
            offset: offset,
        })
    }
     // 点击确认按钮触发该事件
    onConfirm () {
        const last = this.state.lastSelectedItem || {};
        const current = this.state.currentSelectedItem;


        this.cacheCurrentItem(current);

        // 更新 lastSelectedItem
        this.setState({
            lastSelectedItem: current,
        })

        this.props.onConfirm && this.props.onConfirm(last, current);
    }
    // 点击取消按钮触发该事件
    onCancel () {
        const last = this.state.lastSelectedItem;
        this.setState({
            currentSelectedItem: last,
        })
        this.props.onCancel && this.props.onCancel(last)
    }
    // 渲染移动端的selector
    renderMobileSelector () {
        return (
            <div className='mobile-selector'>
                <div className='mobile-selector-header'>
                    <button 
                    className='cancel-btn btn' 
                    onClick={this.onCancel.bind(this)}>取消</button>
                    <Search 
                    className='mobile-search-input'
                    value={this.state.searchKey}
                    onChange={this.handleInput.bind(this)} />
                    <button 
                    className='verify-btn btn' 
                    onClick={this.onConfirm.bind(this)}>确定</button>
                </div>
                <div className='mobile-selector-body'>
                    <Board 
                    mode='mobile'
                    ref={this.board} 
                    dataSource={this.state.renderData} 
                    handleTouchStart={this.handleTouchStart.bind(this)}
                    handleTouchMove={this.handleTouchMove.bind(this)}
                    handleTouchEnd={this.handleTouchEnd.bind(this)}/>
                    <div className='mask'></div>
                </div>
            </div>
        )
    }


    // PC端的控制函数

     // 滚动到底部更新 toIndex 和 renderData
    handleScroll (e) { 
        // console.log('scroll')
        if (this.props.mode === 'mobile') {
            clearTimeout(this.timer);
        }

        const target = e.target;
        const currentScrollTop = target.scrollTop;
        const maxScrollTop = target.scrollHeight - target.clientHeight;

        // 滑到底部，小于itemHeight，请求新数据
        if (maxScrollTop - currentScrollTop < this.props.itemHeight) {
            this.refreshData()
        }
    }  
    // 点击列表项， 触发onChange函数
    onClickOption (e) {
        // 这里，应该不能用 e.target.getAttribute 的 T T
        const index = parseInt(e.target.getAttribute('index'));
        const last = this.state.currentSelectedItem;
        const current = this.state.renderData[index];
        const {listLength, dataSource} = this.props;
        const renderData = this.getRenderData(0, listLength, dataSource.data, current.title);

        this.setState({
            currentSelectedItem: current,
            lastSelectedItem: last,
            searchKey: current.title,
            renderData: renderData,
            toIndex: this.props.listLength,
        })
        this.hideOptionsBoard();
        this.cacheCurrentItem(current);
        this.props.onChange && this.props.onChange(current);
    }
    // 隐藏下拉列表
    hideOptionsBoard () {
        if (!this.state.isShowOptionsBoard) {
            return;
        }
        this.setState({
            isShowOptionsBoard: false,
        })
    }
    // 显示下拉列表
    showOptionsBoard () {
        if (this.state.isShowOptionsBoard) {
            return;
        }
        this.setState({
            isShowOptionsBoard: true
        })

    }
    // 点击箭头触发该函数
    handleClickArrow () {
        this.state.isShowOptionsBoard ? this.hideOptionsBoard() : this.showOptionsBoard();
    }
    // 渲染PC端的selector
    renderPCSelector () {
        const {searchKey, isLoading, renderData, currentSelectedItem} = this.state;
        return (
            <div className='PC-selector'>                
                <div className='PC-selector-header'>
                    <Search 
                    className='PC-search-input'
                    onFocus={this.showOptionsBoard.bind(this)}
                    value={searchKey}
                    onChange={this.handleInput.bind(this)} />
                    <i className='arrow' onClick={this.handleClickArrow.bind(this)}></i>
                </div>
                {this.state.isShowOptionsBoard && <div className='PC-selector-body'>
                    <Board 
                    mode='PC'
                    ref={this.board} 
                    isLoading={isLoading}
                    dataSource={renderData}
                    currentItem={currentSelectedItem} // 用来判断列表项是否高亮
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
    itemHeight: 40,
}

