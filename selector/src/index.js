import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import {Selector} from './selector';

function generateData () {
    let data = [];
    for (let i = 0; i < 5000; i++) {
        data.push({
            title: i,
            value: i,
        });
    }
    return data;
}


const dataSource = generateData();

class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            title: '',
            value: '',
        }
    }
    changeData (obj) {
        console.log('changeData')
        this.setState({
            value: obj.value,
            title: obj.title,
        })
    }
    handleCancel () {
        console.log('handleCancle')
    }
    scrollBottom (preTo, newTo) {
        console.log('scrollBottom')
        // console.log(preTo, newTo);
    }
    render () {
        return (
            <div>
                <p>
                    value: {this.state.value}
                    <br/>
                    title: {this.state.title}
                </p>
                <div>
                    <Selector 
                    dataSource={dataSource} 
                    listLength={150} // 一次渲染的列表长度，默认50
                    onConfirm={this.changeData.bind(this)}  // 确认按钮
                    onCancel={this.handleCancel.bind(this)} // 取消按钮
                    onScrollBottom={this.scrollBottom.bind(this)} />
                </div>
            </div>
        )
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('root')
);