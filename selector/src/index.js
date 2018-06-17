import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import {Selector} from './selector';

// 用来模拟AJAX请求
var dataSource = {
    count: 0,
    get: function (key) { // 模拟get请求
        let data = [];
        for (let i = this.count * 50; i < (this.count + 1) * 50; i++) {
            const o = key ? {value: i, title: `title contains ${key}`} : {value: i, title: i};
            data.push(o);
        }
        this.count ++;
        setTimeout(() => {
            this.trigger('success', data);
        }, 100);
    },
    trigger: function (name, data) {
        this[name] && this[name](data);
    },
    success: function (data) { // 回调函数
        console.log(data)
    }
}


class App extends React.Component {
    constructor (props) {
        super(props);
        const data = JSON.parse(localStorage.getItem('currentData')) || [];
        this.state = {
            dataSource: data,
            currentObj: null,
            lastObj: null,
        }
    }
    componentDidMount () {
        let that = this;

        dataSource.success = function (data) {
            that.setState({
                dataSource: that.state.dataSource.concat(data),
            });
            // console.log(that.state.dataSource)
        }
        dataSource.get();
    }
    lazyLoadData (searchKey) {
        console.log(searchKey);
        dataSource.get(searchKey);
    }
    handleConfirm (last,current) {
        this.setState({
            currentObj: JSON.parse(JSON.stringify(current)),
            lastObj: JSON.parse(JSON.stringify(last)),
        })
    }
    handleChange (current) {
        this.setState({
            currentObj: JSON.parse(JSON.stringify(current)),
        })
    }
    handleCancel (last) {
        this.setState({
            currentObj: JSON.parse(JSON.stringify(last)),
        })
    }
    scrollBottom (preTo, newTo) {
        console.log('scrollBottom')
        // console.log(preTo, newTo);
    }
    render () {
        return (
            <div>
                <p>
                    current: {JSON.stringify(this.state.currentObj)}
                    <br/>
                    last: {JSON.stringify(this.state.lastObj)}
                </p>
                <div className='wrapper'>
                    <Selector 
                    mode='mobile'
                    dataSource={this.state.dataSource} 
                    listLength={50} // 一次渲染的列表长度，默认50  
                    onConfirm={this.handleConfirm.bind(this)}            
                    onCancel={this.handleCancel.bind(this)} // 取消按钮
                    onChange={this.handleChange.bind(this)}
                    onScrollBottom={this.scrollBottom.bind(this)}
                    lazyLoadData={this.lazyLoadData.bind(this)} />
                    <hr/>
                    <Selector 
                    mode='PC'
                    listLength={150}
                    dataSource={this.state.dataSource} 
                    onChange={this.handleChange.bind(this)}
                    onScrollBottom={this.scrollBottom.bind(this)}
                    lazyLoadData={this.lazyLoadData.bind(this)} />
                </div>
            </div>
        )
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('root')
);