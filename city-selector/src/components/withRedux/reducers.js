import { combineReducers } from 'redux';

import { province } from '../../datasource/province';
import { city } from '../../datasource/city';
import { area } from '../../datasource/area';
import { CHANGE_PROVINCE, CHANGE_CITY, CHANGE_AREA } from './actions';


const provinceData = province.map((item, index) => {
    return {title: item.name, value: item.id}
});

function currentProvince (state = {}, action) {
    switch (action.type) {
        case CHANGE_PROVINCE:
            return action.payload.province;
        default:
            return state;
    }
}
function currentCity (state = {}, action) {
    switch (action.type) {
        case CHANGE_CITY:
            return action.payload.city;
        default:
            return state;
    }
}
function currentArea (state = {}, action) {
    switch (action.type) {
        case CHANGE_AREA:
            return action.payload.area;
        default:
            return state;
    }
}

function provinceList (state = {data: provinceData, isEnd: true}, action) {
    return state;
}

function setCityList (state, id) {
    let cities;
    if (city.hasOwnProperty(id)) {
        cities = city[id].map((item, index) => {
            return {value: item.id, title: item.name};
        })
    } else {
        cities = [];
    }
    const shouldRefreshSelector = 
    ( id === state.province || !state.province ) 
    ? false
    : true;

    return {
        data: cities, 
        isEnd: true, 
        province: id, 
        shouldRefreshSelector: shouldRefreshSelector
    };
}

function cityList (state = {data: [], isEnd: true, province: undefined}, action) {
    switch (action.type) {
        case CHANGE_PROVINCE:
            return setCityList(state, action.payload.province.value)
        default:
            return state;
    }
}

function setAreaList (state, id) {
    let areas;
    if (area.hasOwnProperty(id)) {
        areas = area[id].map((item, index) => {
            return {value: item.id, title: item.name};
        })
    } else {
        areas = [];
    }
    const shouldRefreshSelector = 
    ( id === state.city || !state.city ) 
    ? false
    : true;

    return { 
        data: areas, 
        isEnd: true, 
        city: id, 
        shouldRefreshSelector: shouldRefreshSelector 
    }
}

function areaList (state = {data: [], isEnd: true, city: undefined}, action) {
    switch (action.type) {
        case CHANGE_PROVINCE:
            return {
                data: [], 
                isEnd: true, 
                city: undefined, 
                shouldRefreshSelector: true
            };

        case CHANGE_CITY: 
            return setAreaList(state, action.payload.city.value);
        default:
            return state;
    }
}

export default combineReducers({
    provinceList,
    cityList,
    areaList,
    currentProvince,
    currentCity,
    currentArea
});