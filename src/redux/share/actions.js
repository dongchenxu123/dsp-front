/*
*getBidTrans (获取无线推广和店铺推广)
*
*/

import { createAction } from 'redux-actions'
import axios from 'axios'

import { GetTrans, AddTrans, DelTrans, EditTrans, SetTransStatus } from 'help/url'

import {
  GET_CUS_BID_ITEMS_SUCCESS, GET_CUS_BID_ITEMS_R,
  EDIT_CUS_BID_ITEM, EDIT_CUS_BID_ITEM_R, EDIT_CUS_BID_ITEM_F,
  ADD_CUS_BID_ITEM, ADD_CUS_BID_ITEM_R, ADD_CUS_BID_ITEM_F,
  DEL_CUS_BID_ITEM, DEL_CUS_BID_ITEM_F, DEL_CUS_BID_ITEM_R,
  SET_CUSBID_STATUS, SET_CUSBID_STATUS_R, SET_CUSBID_STATUS_F
} from '../const'

//获取自定义推广
const requestItems = createAction(GET_CUS_BID_ITEMS_R, (payload) => {
  return payload
})
const itemsSuccess = createAction(GET_CUS_BID_ITEMS_SUCCESS, (payload) => {
  return payload
})
export function getBidTrans ({campaign_type, page}) {
  return (dispatch, getState) => {
    dispatch(requestItems({campaign_type: campaign_type}))
    const limit = 25
    const skip = (page - 1) * limit
    return axios.get(GetTrans + skip + '&campaign_type=' + campaign_type + '&limit=' + limit)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          //dispatch(itemsFailure({campaign_type: campaign_type}))
        } else {
          let obj = {
            campaign_type: campaign_type,
            page: page,
            items: data.res.trans,
            totalItems: data.res.total
          }
          dispatch(itemsSuccess(obj))
        }
      })
  }
}

//删除自定义推广
export const requestDelTrans = createAction(DEL_CUS_BID_ITEM_R, (payload) => {
  return {
    campaign_type: payload.campaign_type
  }
})
export const delTransSuccess = createAction(DEL_CUS_BID_ITEM, (payload) => {
  return {
    id: payload.pid,
    campaign_type: payload.campaign_type
  }
})
export const delTransFailure = createAction(DEL_CUS_BID_ITEM_F, (payload) => {
  return {
    campaign_type: payload.campaign_type
  }
})
export function delBidItemTrans ({campaign_type, id}) {
  return (dispatch, getState) => {
    dispatch(requestDelTrans({campaign_type: campaign_type}))
    return axios.post(DelTrans, {pid: id, campaign_type: campaign_type})
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(delTransFailure({campaign_type: campaign_type}))
        } else {
          dispatch(delTransSuccess({pid: id, campaign_type: campaign_type}))
        }
        return {data, dispatch}
      })
  }
}

//添加自定义推广
export const requestAddTrans = createAction(ADD_CUS_BID_ITEM_R, (payload) => {
  return {
    campaign_type: payload.campaign_type
  }
})
export const addTransFailure = createAction(ADD_CUS_BID_ITEM_F, () => null)
export const addTransSuccess = createAction(ADD_CUS_BID_ITEM, (payload) => {
  return {
    item: payload.item,
    campaign_type: payload.campaign_type
  }
})
export function addBidItemTrans (trans) {
  return (dispatch, getState) => {
    var data = new FormData()
    data.append('file', trans.file)
    data.append('url', trans.url)
    data.append('title', trans.title)
    data.append('cid', trans.cid)
    data.append('campaign_type', trans.campaign_type)
    if (trans.creative_type) {
      data.append('creative_type', trans.creative_type)
    }
    dispatch(requestAddTrans({campaign_type: trans.campaign_type}))
    return axios.post(AddTrans, data)
      .then(function (response) {
        return response.data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(addTransFailure())
        }
        if (!data.msg) {
          //dispatch(addTransFailure())
          dispatch(addTransSuccess({campaign_type: trans.campaign_type, item: data.res}))
        }
        return data
      })
  }
}

//自定义推广状态
export const requestSetTrans = createAction(SET_CUSBID_STATUS_R, (payload) => {
  return {
    campaign_type: payload.campaign_type
  }
})
export const setTransStatusSuccess = createAction(SET_CUSBID_STATUS, (payload) => {
  return {
    id: payload.pid,
    itemState: payload.itemState,
    campaign_type: payload.campaign_type
  }
})
export const setTransFailure = createAction(SET_CUSBID_STATUS_F, (payload) => {
  return {
    campaign_type: payload.campaign_type
  }
})
export function setBidItemStatus ({campaign_type, item}) {
  return (dispatch, getState) => {
    dispatch(requestSetTrans({campaign_type: campaign_type}))
    let sendStatus = item.state === '1' ? '0' : '1'
    return axios.post(SetTransStatus, {pid: item.pid, state: sendStatus, campaign_type: campaign_type})
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(setTransFailure({campaign_type: campaign_type}))
        } else {
          dispatch(setTransStatusSuccess({pid: item.pid, itemState: sendStatus, campaign_type: campaign_type}))
        }
        return {data, dispatch}
      })
  }
}

//编辑自定义推广
const requestEditTrans = createAction(EDIT_CUS_BID_ITEM_R, (payload) => {
  return {
    campaign_type: payload.campaign_type
  }
})
const editTransSuccess = createAction(EDIT_CUS_BID_ITEM, (payload) => {
  return payload
})
const editTransFailure = createAction(EDIT_CUS_BID_ITEM_F, (payload) => {
  return {
    campaign_type: payload.campaign_type
  }
})
export function editBidItemTrans (trans) {
  return (dispatch, getState) => {
    var data = new FormData()
    data.append('file', trans.file)
    data.append('url', trans.url)
    data.append('title', trans.title)
    data.append('cid', trans.cid)
    data.append('pid', trans.pid)
    data.append('campaign_type', trans.campaign_type)
    if (trans.creative_type) {
      data.append('creative_type', trans.creative_type)
    }
    dispatch(requestEditTrans({campaign_type: trans.campaign_type}))
    return axios.post(EditTrans, data)
      .then(function (response) {
        return response.data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(editTransFailure({campaign_type: trans.campaign_type}))
          return
        }
        dispatch(editTransSuccess({campaign_type: trans.campaign_type, item: data.res}))
        return data
      })
  }
}
