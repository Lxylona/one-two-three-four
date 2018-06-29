import React from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';

import { PCSelector } from '../selector';
import { CHANGE_PROVINCE, CHANGE_CITY, CHANGE_AREA } from './actions';


export class CitySelector extends React.Component {
    
    render () {
        const {
            currentProvince, 
            currentCity, 
            currentArea, 
            provinceList, 
            cityList, 
            areaList
        } = this.props;

        return (
            <div>
                <div style={{height: '150px'}}>
                    <h4>选中城市</h4>
                    <span>{ currentProvince ? currentProvince.title : '' } </span>
                    <span>{ currentCity ? currentCity.title : '' } </span>
                    <span>{ currentArea ? currentArea.title : '' } </span>
                </div>
                <div className='province-wrapper'>
                    <PCSelector
                    identity='province02'
                    onChange={this.props.onProcvinceChange.bind(this)}
                    dataSource={provinceList} />
                </div>
                <div className='province-wrapper'>
                    <PCSelector
                    identity='city02'
                    onChange={this.props.onCityChange.bind(this)}
                    dataSource={cityList} />
                </div>
                <div className='province-wrapper'>
                    <PCSelector
                    identity='area02'
                    onChange={this.props.onAreaChange.bind(this)}
                    dataSource={areaList} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...state
    }
}
const mapDispatchToProps = (dispatch, ownProps) => ({
    onProcvinceChange: (o) => dispatch({
        type: CHANGE_PROVINCE,
        payload: {
            province: o
        }
    }),
    onCityChange: (o) => dispatch({
        type: CHANGE_CITY,
        payload: {
            city: o
        }
    }),
    onAreaChange: (o) => dispatch({
        type: CHANGE_AREA,
        payload: {
            area: o
        }
    })
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CitySelector);