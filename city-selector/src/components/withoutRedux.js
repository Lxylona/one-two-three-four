import React from 'react';
import { PCSelector } from './selector';
import { province } from '../datasource/province';
import { city } from '../datasource/city';
import { area } from '../datasource/area';

const provinceData = province.map((item, index) => {
    return {title: item.name, value: item.id}
});
export default class CitySelector extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currentProvince: null,
            currentCity: null,
            currentArea: null,
            provinceData: {data: provinceData, isEnd: true},
            cityData: {data: [], isEnd: false},
            areaData: {data: [], isEnd: false},
        }
    }
    onProcvinceChange (o) {
        if (!o) {
            return;
        }
        this.setState({
            currentProvince: o,
        });
        this.setCityData(o.value);
    }
    setCityData (id) {
        const privince = this.state.cityData.privince;
        let cities;
        if (!city.hasOwnProperty(id) || !id) {
            cities = [];
        } else {
            cities = city[id].map((item, index) => {
                return {title: item.name,value: item.id}
            });
        }
        // 是否重置selecotr
        const shouldRefreshSelector = 
        (id === privince || !privince) 
        ? false 
        : true;
        this.setState({
            cityData: {
                data: cities, 
                isEnd: true, 
                privince: id, 
                shouldRefreshSelector: shouldRefreshSelector
            }
        })
    }
    onCityChange (o) {
        if (!o) {
            return;
        }
        this.setState({
            currentCity: o,
        })
        this.setAreaData(o.value);
    }
    setAreaData (id) {
        let areas;
        if(!area.hasOwnProperty(id) || !id) {
            areas = [];
        }  else {
            areas = area[id].map((item, index) => {
                return {title: item.name, value: item.id}
            })
        }
        const shouldRefreshSelector = 
        (id === this.state.areaData.city || !this.state.areaData.city) 
        ? false 
        : true;
        this.setState({
            areaData: {
                data: areas, 
                isEnd: true,
                city: id, 
                shouldRefreshSelector: shouldRefreshSelector
            }
        })
    }

    onAreaChange (o) {
        if (!o) {
            return;
        }
        this.setState({
            currentArea: o,
        })
    }

    render () {
        const { currentProvince, currentCity, currentArea, provinceData, cityData, areaData } = this.state;
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
                    identity='province'
                    onChange={this.onProcvinceChange.bind(this)}
                    dataSource={provinceData} />
                </div>
                <div className='province-wrapper'>
                    <PCSelector
                    identity='city'
                    onChange={this.onCityChange.bind(this)}
                    dataSource={cityData} />
                </div>
                <div className='province-wrapper'>
                    <PCSelector
                    identity='area'
                    onChange={this.onAreaChange.bind(this)}
                    dataSource={areaData} />
                </div>
            </div>
        )
    }
}