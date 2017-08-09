/**
 * Created by CY on 2016/2/19.
 */
import axios from 'axios'
import { createAction } from 'redux-actions'
import { handleActions } from 'redux-actions'


import { GET_USERSHOP_DATA_REQUEST, GET_USERSHOP_DATA_SUCCESS, GET_USERSHOP_DATA_FAILURE,
  GET_USERSHOP_TODAY_REQUEST, GET_USERSHOP_TODAY_SUCCESS, GET_USERSHOP_TODAY_FAILURE,
  GET_USERSHOP_SCORE_REQUEST, GET_USERSHOP_SCORE_SUCCESS, GET_USERSHOP_SCORE_FAILURE,
  GET_USERSHOP_PEOPLE_REQUEST, GET_USERSHOP_PEOPLE_SUCCESS, GET_USERSHOP_PEOPLE_FAILURE,
  GET_SHOP_CLICKSOURCE_REQUEST, GET_SHOP_CLICKSOURCE_SUCCESS, GET_SHOP_CLICKSOURCE_FAILURE,
  GET_LOCATION_REPORT_REQUEST, GET_LOCATION_REPORT_SUCCESS, GET_LOCATION_REPORT_FAILURE,
  GET_HOURLY_REPORT_REQUEST, GET_HOURLY_REPORT_SUCCESS, GET_HOURLY_REPORT_FAILURE
} from './const'
import { GetUserChartData, GetUserShopToday, GetUserShopScore, GetPeopleGroup, GetClickFromSourceSite, GetHourlyCost, GetLocationReport, GetRenQiChartReport, GetDeviceTypeChart, GetDeviceBrandChart } from 'help/url'
import { addDate, FormateNum } from 'help/formate'

//import { locationChartRedux } from 'redux/settings/shareChart'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

export const getUserShopDataRequest = createAction(GET_USERSHOP_DATA_REQUEST, (state) => state)
export const getUserShopDataFailure = createAction(GET_USERSHOP_DATA_FAILURE, (state) => state)
export const getUserShopDataSuccess = createAction(GET_USERSHOP_DATA_SUCCESS, (items) => {
  return items
})
export function loadUserAllChartDataAction (query) {
  return function (dispatch, getState) {
    dispatch(getUserShopDataRequest())
    let today = null
    let startDay = null
    if (!query) {
      today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
      startDay = addDate(today, -30)
    } else {
      today = query.to
      startDay = query.from
    }
    return axios.get(GetUserChartData + '&start_date=' + startDay + '&end_date=' + today)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getUserShopDataFailure())
        } else {
          dispatch(getUserShopDataSuccess({data: data.res}))
        }
      })
  }
}
//获取用户整体推广报表-今天
export const getUserShopTodayRequest = createAction(GET_USERSHOP_TODAY_REQUEST, (state) => state)
export const getUserShopTodayFailure = createAction(GET_USERSHOP_TODAY_FAILURE, (state) => state)
export const getUserShopTodaySuccess = createAction(GET_USERSHOP_TODAY_SUCCESS, (items) => {
  return items
})
export function loadUserShopTodayAction () {
  return function (dispatch, getState) {
    dispatch(getUserShopTodayRequest())
    return axios.get(GetUserShopToday)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getUserShopTodayFailure())
        } else {
          dispatch(getUserShopTodaySuccess({today: data.res, isFetching: false}))
        }
      })
  }
}
//获取用户整体推广报表-得分情况
export const getUserShopScoreRequest = createAction(GET_USERSHOP_SCORE_REQUEST, (state) => state)
export const getUserShopScoreFailure = createAction(GET_USERSHOP_SCORE_FAILURE, (state) => state)
export const getUserShopScoreSuccess = createAction(GET_USERSHOP_SCORE_SUCCESS, (items) => {
  return items
})
export function loadUserShopScoreAction () {
  return function (dispatch, getState) {
    dispatch(getUserShopScoreRequest())
    return axios.get(GetUserShopScore)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getUserShopScoreFailure())
        } else {
          dispatch(getUserShopScoreSuccess({score: data.res, isFetching: false}))
        }
      })
  }
}

//获取店铺人群画像
export const getPeopleGroupRequest = createAction(GET_USERSHOP_PEOPLE_REQUEST, (state) => state)
export const getPeopleGroupFailure = createAction(GET_USERSHOP_PEOPLE_FAILURE, (state) => state)
export const getPeopleGroupSuccess = createAction(GET_USERSHOP_PEOPLE_SUCCESS, (items) => {
  return items
})
export function loadUserShopPeopleAction (items) {
  return function (dispatch, getState) {
    dispatch(getPeopleGroupRequest())
    return axios.post(GetPeopleGroup, items)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getPeopleGroupFailure())
        } else {
          if (!data.res) {
            data.res = {data: []}
          }
          data.res.show = items.show
          dispatch(getPeopleGroupSuccess(data.res))
        }
      })
  }
}


//获取点击来源网站
export const getClickSourceRequest = createAction(GET_SHOP_CLICKSOURCE_REQUEST, (state) => state)
export const getClickSourceFailure = createAction(GET_SHOP_CLICKSOURCE_FAILURE, (state) => state)
export const getClickSourceSuccess = createAction(GET_SHOP_CLICKSOURCE_SUCCESS, (items) => {
  return {clicksource: items}
})
export function loadShopClickSourceAction () {
  return function (dispatch, getState) {
    dispatch(getClickSourceRequest())
    const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    const startDay = addDate(today, -30)
    return axios.get(GetClickFromSourceSite + '&start_date=' + startDay + '&end_date=' + today)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getClickSourceFailure())
        } else {
          dispatch(getClickSourceSuccess({data: data.res}))
        }
      })
  }
}


//实时数据
export const getHourlyReportRequest = createAction(GET_HOURLY_REPORT_REQUEST, (state) => state)
export const getHourlyReportFailure = createAction(GET_HOURLY_REPORT_FAILURE, (state) => state)
export const getHourlyReportSuccess = createAction(GET_HOURLY_REPORT_SUCCESS, (payload) => {
  return {hours: payload.items, campaign_type: payload.campaign_type}
})
export function loadHourCostAction (campaign_type) {
  let url = GetHourlyCost
  if (campaign_type !== undefined) {
    url = GetHourlyCost + '&campaign_type=' + campaign_type
  }
  return function (dispatch, getState) {
    dispatch(getHourlyReportRequest())
    return axios.get(url)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getHourlyReportFailure())
        } else {
          if (campaign_type === undefined) {
            campaign_type = -1
          }
          dispatch(getHourlyReportSuccess({items: data.res, campaign_type: campaign_type}))
        }
      })
  }
}

//地域热力图
export const getLocationReportRequest = createAction(GET_LOCATION_REPORT_REQUEST, (state) => state)
export const getLocationReportFailure = createAction(GET_LOCATION_REPORT_FAILURE, (state) => state)
export const getLocationReportSuccess = createAction(GET_LOCATION_REPORT_SUCCESS, (payload) => {
  return {location: payload.items, campaign_type: payload.campaign_type}
})
export function loadLocationReportAction (campaign_type) {
  let url = GetLocationReport
  if (campaign_type !== undefined) {
    url = GetLocationReport + '&campaign_type=' + campaign_type
  }
  return function (dispatch, getState) {
    dispatch(getLocationReportRequest())
    return axios.get(url)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getLocationReportFailure())
        } else {
          if (campaign_type === undefined) {
            campaign_type = -1
          }
          dispatch(getLocationReportSuccess({items: data.res, campaign_type: campaign_type}))
        }
      })
  }
}

export function loadRenQiChartReportAction () {
  return function (dispatch, getState) {
    return axios.get(GetRenQiChartReport)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        return data
      }).catch(() => {
        alert('网络错误')
      })
  }
}
//购买倾向
export function loadWillBuyItemsAction (obj) {
  return function (dispatch, getState) {
    return axios.get(GetPeopleGroup, {params: obj})
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        return data
      }).catch(() => {
        alert('网络错误')
      })
  }
}

//购买人群设备
export function loadPeopleDeviceType (campaign_type) {
  let url = GetDeviceTypeChart
  if (campaign_type !== undefined) {
    url = GetDeviceTypeChart + '&campaign_type=' + campaign_type
  }
  return function (dispatch, getState) {
    return axios.get(url)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        return data
      }).catch(() => {
        alert('网络错误')
      })
  }
}
//购买人群设备品牌
export function loadPeopleDeviceBrand (campaign_type) {
  let url = GetDeviceBrandChart
  if (campaign_type !== undefined) {
    url = GetDeviceBrandChart + '&campaign_type=' + campaign_type
  }
  return function (dispatch, getState) {
    return axios.get(url)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        return data
      }).catch(() => {
        alert('网络错误')
      })
  }
}

export const actions = {
  loadUserAllChartDataAction,
  loadUserShopScoreAction,
  loadUserShopPeopleAction,
  loadShopClickSourceAction,
  loadUserShopTodayAction,
  loadHourCostAction,
  loadLocationReportAction,
  loadRenQiChartReportAction,
  loadWillBuyItemsAction,
  loadPeopleDeviceType,
  loadPeopleDeviceBrand
}



//reducer
const initsetitems = {
  errMsg: null,
  page: 0,
  totalPage: 0,
  todayChart: {},
  totalChart: {},
  sexChart: {},
  ageChart: {},
  focusChart: {},
  score: {},
  clicksource: {},
  locations: {},
  hours: {},
  isFetching: false
}
export default handleActions({
  ['GET_USERSHOP_DATA_REQUEST']: (state, { payload }) => {
    return state
  },
  ['GET_USERSHOP_DATA_SUCCESS']: (state, { payload }) => {
    var i = 0
    var l = payload.data.length
    for (i; i < l; i++) {
      if (payload.data[i].roi) {
        payload.data[i].roi = FormateNum(payload.data[i].roi)
      }
      payload.data[i].cost = payload.data[i].cost / 100
    }
    return Object.assign({}, state, {totalChart: Object.assign({}, state.totalChart, payload)})
  },
  ['GET_USERSHOP_DATA_FAILURE']: (state, { payload }) => {
    return state
  },
  ['GET_USERSHOP_TODAY_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {todayChart: Object.assign({}, state.todayChart, {isFetching: true})})
  },
  ['GET_USERSHOP_TODAY_SUCCESS']: (state, { payload }) => {
    if (payload.today) {
      var cost = (payload.today.cost / 100).toFixed(2)
      payload.today.cost = parseFloat(cost)
    }
    return Object.assign({}, state, {todayChart: Object.assign({}, state.todayChart, payload)})
  },
  ['GET_USERSHOP_TODAY_FAILURE']: (state, { payload }) => {
    return state
  },
  ['GET_USERSHOP_SCORE_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {score: Object.assign({}, state.score, {isFetching: true})})
  },
  ['GET_USERSHOP_SCORE_SUCCESS']: (state, { payload }) => {
    return Object.assign({}, state, {score: Object.assign({}, state.score, payload.score)})
  },
  ['GET_USERSHOP_SCORE_FAILURE']: (state, { payload }) => {
    return state
  },
  ['GET_USERSHOP_PEOPLE_REQUEST']: (state, { payload }) => {
    return state
  },
  ['GET_USERSHOP_PEOPLE_SUCCESS']: (state, { payload }) => {
    var show = payload.show
    //1 sex  2 age   3: focus
    if (show === 1) {
      let sexData = []
      for (var key in payload.data) {
        sexData.push({
          name: key,
          value: payload.data[key]

        })
      }
      payload.data = sexData
      return Object.assign({}, state, {sexChart: Object.assign({}, state.sexChart, payload)})
    }
    if (show === 2) {
      let ageData = {
        legend: [], value: []
      }
      for (var ageKey in payload.data) {
        ageData.legend.push(ageKey)
        ageData.value.push({
          name: ageKey,
          value: payload.data[ageKey]
        })
      }
      payload.data = ageData
      return Object.assign({}, state, {ageChart: Object.assign({}, state.ageChart, payload)})
    }
    if (show === 3) {
      let tmpdata = {legend: [], value: []}
      for (var focusKey in payload.data) {
        tmpdata.value.push({name: focusKey, value: payload.data[focusKey]})
      }
      tmpdata.value.sort((a, b) => {
        return a.value - b.value
      })
      for (var i = 0; i < tmpdata.value.length; i++) {
        tmpdata.legend.push(tmpdata.value[i].name)
      }
      payload.data = tmpdata
      return Object.assign({}, state, {focusChart: Object.assign({}, state.focusChart, payload)})
    }
    return state
  },
  ['GET_USERSHOP_PEOPLE_FAILURE']: (state, { payload }) => {
    return state
  },
  ['GET_SHOP_CLICKSOURCE_REQUEST']: (state, { payload }) => {
    return state
  },
  ['GET_SHOP_CLICKSOURCE_SUCCESS']: (state, { payload }) => {
    return Object.assign({}, state, {clicksource: Object.assign({}, state.clicksource, payload.clicksource)})
  },
  ['GET_SHOP_CLICKSOURCE_FAILURE']: (state, { payload }) => {
    return state
  },
  ['GET_LOCATION_REPORT_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {locations: Object.assign({}, state.locations, {fetching: true})})
  },
  ['GET_LOCATION_REPORT_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {locations: Object.assign({}, state.locations, {fetching: false})})
  },
  ['GET_HOURLY_REPORT_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {hours: Object.assign({}, state.hours, {fetching: true})})
  },
  /*['GET_HOURLY_REPORT_SUCCESS']: (state, { payload }) => {
    let cost = []
    let pv = []
    let clicks = []
    let ax = []
    if (payload.hours && payload.hours.length > 0) {
      //return Object.assign({}, state, {hours: Object.assign({}, state.hours, {fetching: false, data: []})})
      for (let i = 0; i < payload.hours.length; i++) {
        cost.push((payload.hours[i].cost / 100).toFixed(2, 10))
        pv.push(payload.hours[i].pv)
        clicks.push(payload.hours[i].clicks)
        ax.push(payload.hours[i].h)
      }
    }
    return Object.assign({}, state, {
      hours: Object.assign(
        {}, state.hours,
        {
          fetching: false,
          cost: cost,
          pv: pv,
          clicks: clicks,
          ax: ax
        }
      )})
  },*/
  ['GET_HOURLY_REPORT_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {hours: Object.assign({}, state.hours, {fetching: false})})
  }
}, initsetitems)
