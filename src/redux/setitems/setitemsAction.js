/**
 * Created by CY on 2016/1/25.
 */
import axios from 'axios'
import { createAction } from 'redux-actions'
import { GetItemsUrl, SetItemsOnline, SetItemsOffline, OptSetItemsUrl, GetOnlineItemsUrl, wordCloud, GetRenQiPkgs, AddRenQiTrans, GetRenQiChartData } from 'help/url'
import { setitems_id } from 'help/appid'
import { ITEMS_REQUEST, ITEMS_SUCCESS, ITEMS_FAILURE,
  BID_ITEMS_REQUEST, BID_ITEMS_SUCCESS, BID_ITEMS_FAILURE,
  EDITBID_ITEMS_REQUEST, EDITBID_ITEMS_SUCCESS, EDITBID_ITEMS_FAILURE,
  STOPBID_ITEMS_REQUEST, STOPBID_ITEMS_SUCCESS, STOPBID_ITEMS_FAILURE,
  GET_WORDCLOUD_REQUEST, GET_WORDCLOUD_SUCCESS, GET_WORDCLOUD_FAILURE,
  GET_ITEM_RENQIPKGS_REQUEST, GET_ITEM_RENQIPKGS_SUCCESS, GET_ITEM_RENQIPKGS_FAILURE,
  ADD_ITEM_RENQIPKGS_REQUEST, ADD_ITEM_RENQIPKGS_SUCCESS, ADD_ITEM_RENQIPKGS_FAILURE
} from '../const'

import { setBudgetAction, setCPCAction, loadCPCAndBudget, GetTargetHoursSetting, getLocationsAction, setLocationsAction, GetPeopleTagsSetting } from 'redux/bidseting/setingAction'
import { loadTodayDataAction } from 'redux/chart/chartAction'
import {loadUserShopPeopleAction} from 'redux/userShopChart'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

//renqi chart
export function getRenQiChartAction (renqi_id) {
  return function (dispatch, getState) {
    return axios.post(GetRenQiChartData + renqi_id)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        return data
      }).catch(() => { alert('网络错误') })
  }
}

//add renqi
export const requestAddRenQi = createAction(ADD_ITEM_RENQIPKGS_REQUEST, (items) => items)
export const requestAddRenQiSuccess = createAction(ADD_ITEM_RENQIPKGS_SUCCESS, (payload) => {
  return payload
})
export const requestAddRenQiFailure = createAction(ADD_ITEM_RENQIPKGS_FAILURE, (items) => items)
export function addRenQiPkgsAction (obj) {
  return function (dispatch, getState) {
    dispatch(requestAddRenQi(getState().auth))
    return axios.post(AddRenQiTrans, {item_id: obj.item_id, package_id: obj.pid})
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(requestAddRenQiFailure())
        } else {
          dispatch(requestAddRenQiSuccess({pid: data.res, item_id: obj.item_id}))
        }
        return data
      }).catch(() => { alert('网络错误') })
  }
}
//renqi
export const requestRenQipkgs = createAction(GET_ITEM_RENQIPKGS_REQUEST, (items) => items)
export const requestRenQipkgsSuccess = createAction(GET_ITEM_RENQIPKGS_SUCCESS, (payload) => {
  return {
    items: payload
  }
})
export const requestRenQipkgsFailure = createAction(GET_ITEM_RENQIPKGS_FAILURE, (items) => items)
export function getRenQiPkgsAction () {
  return function (dispatch, getState) {
    dispatch(requestRenQipkgs(getState().auth))
    return axios.get(GetRenQiPkgs)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        //console.log(data)
        if (data.msg) {
          dispatch(requestRenQipkgsFailure())
        } else {
          dispatch(requestRenQipkgsSuccess(data.res))
        }
        return data
      }).catch(() => { alert('网络错误') })
  }
}



export const requestWordcloud = createAction(GET_WORDCLOUD_REQUEST, (items) => items)
export const requestWordcloudSuccess = createAction(GET_WORDCLOUD_SUCCESS, (payload) => {
  return {
    items: payload.tags
  }
})
export const requestWordcloudFailure = createAction(GET_WORDCLOUD_FAILURE, (items) => items)
export function getWordCloudAction (titles) {
  return function (dispatch, getState) {
    dispatch(requestWordcloud(getState().auth))
    return axios.post(wordCloud, {words: titles})
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(requestWordcloudFailure())
        } else {
          dispatch(requestWordcloudSuccess({tags: data.res.Tags}))
        }
        return data
      })
  }
}


//加载宝贝
export const requestItems = createAction(ITEMS_REQUEST, (items) => items)
export const itemsSuccess = createAction(ITEMS_SUCCESS, (payload) => {
  return {
    items: payload.items,
    totalPage: payload.total,
    type: payload.type,
    page: payload.page
  }
})
export const itemsFailure = createAction(ITEMS_FAILURE, (items) => items)

export function loadItemsAction (query) {
  return function (dispatch, getState) {
    dispatch(requestItems(getState().setitems))
    var url = query.type === 0 ? GetItemsUrl : GetOnlineItemsUrl
    return axios.get(url + '&page=' + query.page + '&q=' + query.q)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(itemsFailure())
        } else {
          let obj = {
            page: query.page,
            type: query.type,
            items: data.res.items,
            total: data.res.total
          }
          dispatch(itemsSuccess(obj))
        }
      }).catch(() => {
        alert('网络错误')
      })
  }
}

//设置 推广宝贝
export const bidItemsRequest = createAction(BID_ITEMS_REQUEST, (items) => items)
export const bidItemsSuccess = createAction(BID_ITEMS_SUCCESS, (items) => items)
export const bidItemsFailure = createAction(BID_ITEMS_FAILURE, (msg) => msg)
export function startBidItemsOnlineAction (items) {
  return (dispatch, getState) => {
    dispatch(bidItemsRequest(getState().setitems))
    return axios.post(SetItemsOnline, {items: JSON.stringify(items)})
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(bidItemsFailure())
        } else {
          if (data.res === 'no-balance') {
            dispatch(bidItemsFailure())
            return {data, dispatch}
          }
          dispatch(bidItemsSuccess(data.res))
        }
        return {data, dispatch}
      })
  }
}
//设置 暂停推广
export const stopBidItemsRequest = createAction(STOPBID_ITEMS_REQUEST, (items) => items)
export const stopBidItemsSuccess = createAction(STOPBID_ITEMS_SUCCESS, (items) => items)
export const stopBidItemsFailure = createAction(STOPBID_ITEMS_FAILURE, (msg) => msg)

//暂停推广
export function stopBidItemsOnlineAction (items) {
  return (dispatch, getState) => {
    dispatch(stopBidItemsRequest(getState().setitems))
    return axios.post(SetItemsOffline, {item_ids: items.join(',')})
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(stopBidItemsFailure())
        } else {
          dispatch(stopBidItemsSuccess(data.res))
        }
        return data
      })
  }
}
//修改创意
export const editItemsRequest = createAction(EDITBID_ITEMS_REQUEST, (items) => items)
export const edittemsSuccess = createAction(EDITBID_ITEMS_SUCCESS, (payload) => payload)
export const editItemsFailure = createAction(EDITBID_ITEMS_FAILURE, (msg) => msg)

export function editBidItemsAction (items) {
  return (dispatch, getState) => {
    dispatch(editItemsRequest(getState().setitems))
    var data = new FormData()
    data.append('file', items.file)
    data.append('title', items.title)
    data.append('item_id', items.id)
    data.append('price', items.price)
    data.append('campaign_type', setitems_id)
    var opts = {
      transformRequest: function (data) { return data }
    }
    return axios.post(OptSetItemsUrl, data, opts)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(editItemsFailure())
        }
        dispatch(edittemsSuccess(data.res))
        return data
      })
  }
}

export const actions = {
  loadItemsAction,
  startBidItemsOnlineAction,
  stopBidItemsOnlineAction,
  editBidItemsAction,
  loadCPCAndBudget,
  setBudgetAction,
  setCPCAction,
  loadTodayDataAction,
  loadUserShopPeopleAction,
  GetTargetHoursSetting,
  //getWordCloudAction,
  getLocationsAction,
  setLocationsAction,
  getRenQiPkgsAction,
  addRenQiPkgsAction,
  getRenQiChartAction,
  GetPeopleTagsSetting
}
