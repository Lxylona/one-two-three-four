import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import { MobileSelector, PCSelector } from './selector';

// 用来模拟AJAX请求
var dataSource = {
    count: 0,
    get: function (key) { // 模拟get请求
        let data = [];
        for (let i = this.count * 50; i < (this.count + 1) * 50; i++) {
            const o = {value: i, title: i};
            data.push(o);
        }
        this.count ++;
        setTimeout(() => {
            this.trigger('success', {data: data, isEnd: this.count >= 10 ? true : false});
        }, 300);
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
        const data = {data: [], isEnd: false};
        this.state = {
            dataSource: data,
            currentObj: null,
            lastObj: null,
        }
    }
    componentDidMount () {
        let that = this;

        dataSource.success = function (data) {
            const oldData = that.state.dataSource;
            const newData = {data: oldData.data.concat(data.data), isEnd: data.isEnd}
            that.setState({
                dataSource: newData,
            });
            // console.log(that.state.dataSource)
        }
        dataSource.get();
    }
    lazyLoadData (searchKey) {
        dataSource.get(searchKey);
    }
    handleConfirm (last,current) {
        this.setState({
            currentObj: Object.assign({}, current),
            lastObj: Object.assign({}, last),
        })
    }
    handleChange (current) {
        this.setState({
            currentObj: Object.assign({}, current),
        })
    }
    handleCancel (last) {
        this.setState({
            currentObj: Object.assign({}, last),
        })
    }
    render () {
        const {currentObj, lastObj} = this.state;
        return (
            <div>
                <p>
                    current: {JSON.stringify(currentObj)}
                    <br/>
                    last: {JSON.stringify(lastObj)}
                </p>

                
                <div className='wrapper'>
                    <MobileSelector 
                    listLength={50} 
                    dataSource={this.state.dataSource}
                    onChange={this.handleChange.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    onConfirm={this.handleConfirm.bind(this)}
                    lazyLoadData={this.lazyLoadData.bind(this)}
                    ></MobileSelector>
                    
                    <hr/>

                    <PCSelector 
                    listLength={50} 
                    dataSource={this.state.dataSource}
                    onChange={this.handleChange.bind(this)}
                    lazyLoadData={this.lazyLoadData.bind(this)}
                    ></PCSelector>             
                </div>
            </div>
        )
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('root')
);