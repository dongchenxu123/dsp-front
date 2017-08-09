/**
 * Created by CY on 2016/2/1.
 */
import axios from 'axios'
import { createAction } from 'redux-actions'

import { BUDGET_REQUEST, BUDGET_SUCCESS, /*BUDGET_FAILURE,*/
  SET_CPC_REQUEST, SET_CPC_SUCCESS, /*SET_CPC_FAILURE,*/
  GET_ITEMSETTING_REQUEST, GET_ITEMSETTING_SUCCESS, /*GET_ITEMSETTING_FAILURE*/
  SET_HOURS_REQUEST, SET_HOURS_SUCCESS, SET_HOURS_FAILURE,
  GET_HOURS_REQUEST, GET_HOURS_SUCCESS, GET_HOURS_FAILURE,
  CHANGE_HOURS_SELECT, CHANGE_HOURS_SELECT_DAY,
  GET_ALLLOCATIONS_REQUEST, GET_ALLLOCATIONS_SUCCESS, GET_ALLLOCATIONS_FAILURE,
  SET_ALLLOCATIONS_REQUEST, SET_ALLLOCATIONS_SUCCESS, SET_ALLLOCATIONS_FAILURE,
  //GET_USERSHOP_PEOPLE_REQUEST, GET_USERSHOP_PEOPLE_SUCCESS, GET_USERSHOP_PEOPLE_FAILURE,
  GET_PEOPLE_TAGS_REQUEST, GET_PEOPLE_TAGS_SUCCESS, GET_PEOPLE_TAGS_FAILURE,
  SET_PEOPLE_TAGS_REQUEST, SET_PEOPLE_TAGS_SUCCESS, SET_PEOPLE_TAGS_FAILURE
} from '../const'

import { SetBudget, SetCPC, GetSetings, GetTargetHours, SetTargetHours, GetAllLocations, SetLocations, GetPeopleTags, SetPeopleTags } from 'help/url'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

export const setLocationsRequest = createAction(SET_ALLLOCATIONS_REQUEST, (auth) => auth.user)
export const setLocationsSuccess = createAction(SET_ALLLOCATIONS_SUCCESS, (items) => {
  return items
})
export const setLocationsFailure = createAction(SET_ALLLOCATIONS_FAILURE, (auth) => auth.user)
export function setLocationsAction (obj) {
  return function (dispatch, getState) {
    dispatch(setLocationsRequest(obj.campaign_type))
    return axios.post(SetLocations, obj)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        //console.log(data)
        if (data.msg) {
          //dispatch(itemsFailure())
        } else {
          dispatch(setLocationsSuccess({locations: obj.locations, campaign_type: obj.campaign_type}))
        }
        return data
      })
  }
}

export const getLocationsRequest = createAction(GET_ALLLOCATIONS_REQUEST, (auth) => auth.user)
export const getLocationsSuccess = createAction(GET_ALLLOCATIONS_SUCCESS, (items) => {
  return items
})
export const getLocationsFailure = createAction(GET_ALLLOCATIONS_FAILURE, (auth) => auth.user)

export function getLocationsAction () {
  return function (dispatch, getState) {
    dispatch(getLocationsRequest(getState().auth))
    return axios.get(GetAllLocations)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        //console.log(data)
        if (data.msg) {
          //dispatch(itemsFailure())
        } else {
          dispatch(getLocationsSuccess(data.res))
        }
        return data
      })
  }
}

export const setBudget = createAction(BUDGET_REQUEST, (auth) => auth.user)
export const setBugetSuccess = createAction(BUDGET_SUCCESS, (items) => {
  return items
})

export function setBudgetAction (budget) {
  return function (dispatch, getState) {
    dispatch(setBudget(getState().auth))
    return axios.post(SetBudget, budget)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        //console.log(data)
        if (data.msg) {
          //dispatch(itemsFailure())
        } else {
          dispatch(setBugetSuccess({budget: data.res, campaign_type: budget.campaign_type}))
        }
        return data
      })
  }
}

export const setCpcRequest = createAction(SET_CPC_REQUEST, (auth) => auth.user)
export const setCpcSuccess = createAction(SET_CPC_SUCCESS, (items) => {
  return items
})
export function setCPCAction (cpc) {
  return function (dispatch, getState) {
    dispatch(setCpcRequest(getState().auth))
    return axios.post(SetCPC, cpc)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          //dispatch(itemsFailure())
        } else {
          dispatch(setCpcSuccess({cpc: data.res, campaign_type: cpc.campaign_type}))
        }
        return data
      })
  }
}
//获取日限额和平均点击出价
export const get_itemSetting_request = createAction(GET_ITEMSETTING_REQUEST, (state, campaign_type) => {
  return {state, campaign_type}
})
export const get_itemSetting_success = createAction(GET_ITEMSETTING_SUCCESS, (data) => data)
export function loadCPCAndBudget (appid) {
  return (dispatch, getState) => {
    dispatch(get_itemSetting_request(getState(), appid))
    return axios({
      url: GetSetings,
      method: 'post',
      data: 'campaign_type=' + appid
    })
      .then(function (response) {
        return response.data
      })
      .then((data) => {
        data.res.campaign_type = appid
        dispatch(get_itemSetting_success(data.res))
      })
  }
}

//获取设置时段
export const getTargetHoursQuest = createAction(GET_HOURS_REQUEST, (state, campaign_type) => {
  return {state, campaign_type}
})
export const getTargetHoursFailuer = createAction(GET_HOURS_FAILURE, (items) => items)
export const getTargetHoursSuccess = createAction(GET_HOURS_SUCCESS, (items) => {
  return items
})
export function GetTargetHoursSetting (appid) {
  return (dispatch, getState) => {
    dispatch(getTargetHoursQuest(getState(), appid))
    return axios.get(GetTargetHours + appid)
      .then(function (response) {
        return response.data
      })
      .then((data) => {
        data.res.campaign_type = appid
        //console.log(data)
        dispatch(getTargetHoursSuccess(data.res))
      })
  }
}
export const setTargetHoursQuest = createAction(SET_HOURS_REQUEST, (state, campaign_type) => {
  return {state, campaign_type}
})
export const setTargetHoursFailuer = createAction(SET_HOURS_FAILURE, (items) => items)
export const setTargetHoursSuccess = createAction(SET_HOURS_SUCCESS, (items) => {
  return items
})
export function SetTargetHoursSetting (obj) {
  return (dispatch, getState) => {
    dispatch(setTargetHoursQuest(getState(), obj.campaign_type))
    return axios.post(SetTargetHours, {hours: JSON.stringify(obj.hours), campaign_type: obj.campaign_type})
      .then(function (response) {
        return response.data
      })
      .then((data) => {
        if (data.msg) {
          dispatch(setTargetHoursFailuer())
        } else {
          dispatch(setTargetHoursSuccess({hours: obj.hours, campaign_type: obj.campaign_type}))
        }
        return data
      })
  }
}

//设置人物标签
export const getPeopleTagsQuest = createAction(GET_PEOPLE_TAGS_REQUEST, (state, campaign_type) => {
  return {state, campaign_type}
})
export const getPeopleTagsFailuer = createAction(GET_PEOPLE_TAGS_FAILURE, (items) => items)
export const getPeopleTagsSuccess = createAction(GET_PEOPLE_TAGS_SUCCESS, (items) => {
  return items
})
export function GetPeopleTagsSetting (appid) {
  return (dispatch, getState) => {
    dispatch(getPeopleTagsQuest(getState(), appid))
    return axios.get(GetPeopleTags + appid)
      .then(function (response) {
        return response.data
      })
      .then((data) => {
        data.res.campaign_type = appid
        //console.log(data)
        dispatch(getPeopleTagsSuccess(data.res))
      })
  }
}
export const setPeopleTagsRequest = createAction(SET_PEOPLE_TAGS_REQUEST, (state, campaign_type) => {
  return {state, campaign_type}
})
export const setPeopleTagsSuccess = createAction(SET_PEOPLE_TAGS_SUCCESS, (items) => {
  return items
})
export const setPeopleTagsFailure = createAction(SET_PEOPLE_TAGS_FAILURE, (items) => items)
export function setPeopleTagsAction (obj) {
  return function (dispatch, getState) {
    dispatch(setPeopleTagsRequest(obj.campaign_type))
    return axios.post(SetPeopleTags, obj)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        //console.log(data)
        if (data.msg) {
          //dispatch(itemsFailure())
        } else {
          dispatch(setPeopleTagsSuccess({categories: obj.categories, campaign_type: obj.campaign_type, catePrice: obj.bid_ratio}))
        }
        return data
      })
  }
}

//点击选择时间段
export const changeSelectHourItem = createAction(CHANGE_HOURS_SELECT, (item) => {
  return item
})
export function chengeSelectItem (obj) {
  return (dispatch, getState) => {
    dispatch(changeSelectHourItem(obj))
  }
}
export const changeSelectHourDay = createAction(CHANGE_HOURS_SELECT_DAY, (item) => {
  return item
})
export function selectAllDayHours (obj) {
  return (dispatch, getState) => {
    dispatch(changeSelectHourDay(obj))
  }
}
export const actions = {
  loadCPCAndBudget,
  setBudgetAction,
  setCPCAction,
  chengeSelectItem,
  selectAllDayHours,
  GetTargetHoursSetting,
  SetTargetHoursSetting,
  getLocationsAction,
  setLocationsAction,
  GetPeopleTagsSetting,
  setPeopleTagsAction
}
