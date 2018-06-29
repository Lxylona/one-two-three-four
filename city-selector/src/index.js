import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducers from './components/withRedux/reducers';
import CitySelector from './components/withRedux/withRedux';

import './index.css';

const store = createStore(reducers);

class App extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <div className='selector-wrapper'>
                    <CitySelector />
                </div>
            </Provider>
        )

        // return (
        //     <div className='selector-wrapper'>
        //         <CitySelector />
        //     </div>
        // )
    }
}
        

if(module.hot) {
    module.hot.accept();
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)