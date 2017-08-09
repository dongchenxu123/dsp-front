/**
 * Created by CY on 2016/6/27.
 */
import axios from 'axios'
import { createAction } from 'redux-actions'

import {
  FansCategories, FansMedia, FansCreateActivity, FansGetActivity, FansComplaint
} from 'help/url'
import {
  /*GET_FANSCATES_REQUEST, */GET_FANSCATES_SUCCESS, /*GET_FANSCATES_FAILURE,*/ FANS_CATEGORIES_CHANGE,
  GET_FANSMEDIA_REQUEST, GET_FANSMEDIA_SUCCESS, /*GET_FANSMEDIA_FAILURE,*/
  FANS_SELECT_MEDIA, FANS_MEDIATYPE_CHANGE,
  GET_FANSACTIVITY_REQUEST, GET_FANSACTIVITY_SUCCESS, GET_FANSACTIVITY_FAILURE
} from 'redux/const'

function dispactchAction (dispatch, type, data) {
  var tmpFunction = createAction(type, (data) => data)
  dispatch(tmpFunction(data))
}

export function sendFansRemarks (obj) {
  return (dispatch, getState) => {
    return axios.post(FansComplaint, obj)
      .then((response) => {
        var data = response.data
        return data
      })
      .then((data) => {
        return data
      }).catch()
  }
}

export function getFansActivity (obj) {
  return (dispatch, getState) => {
    dispactchAction(dispatch, GET_FANSACTIVITY_REQUEST, obj)
    const newObj = {
      limit: 15,
      skip: (obj.page - 1) * 15,
      service_scope: obj.service_scope
    }
    return axios.get(FansGetActivity, {params: newObj})
      .then((response) => {
        var data = response.data
        return data
      })
      .then((data) => {
        if (data.msg) {
          dispactchAction(dispatch, GET_FANSACTIVITY_FAILURE, {query: obj})
        }
        if (!data.msg) {
          dispactchAction(dispatch, GET_FANSACTIVITY_SUCCESS, {items: data.res.data, query: obj, total: parseInt(data.res.total, 10)})
        }
        return data
      }).catch()
  }
}

export function mediaTypeChange (type) {
  return (dispatch, getState) => {
    dispactchAction(dispatch, FANS_MEDIATYPE_CHANGE, type)
  }
}

export function createFansActivity (obj) {
  return (dispatch, getState) => {
    //dispactchAction(dispatch, GET_FANSMEDIA_REQUEST, obj)
    return axios.post(FansCreateActivity, obj)
      .then((response) => {
        var data = response.data
        return data
      })
      .then((data) => {
        if (!data.msg) {
          //dispactchAction(dispatch, GET_FANSMEDIA_SUCCESS, {items: data.res.data, query: obj, total: data.res.total})
        }
        return data
      }).catch()
  }
}


export function selectedItem (id) {
  return (dispatch, getState) => {
    dispactchAction(dispatch, FANS_SELECT_MEDIA, id)
  }
}

export function loadFansMedia (obj) {
  return (dispatch, getState) => {
    const newobj = {
      m_type: obj.m_type,
      category_id: obj.cate,
      price: obj.fprice,
      followers: obj.ffollowers,
      gender: obj.fgender,
      service_scope: obj.service_scope,
      limit: 15,
      skip: (parseInt(obj.page, 10) - 1) * 15
    }
    dispactchAction(dispatch, GET_FANSMEDIA_REQUEST, obj)
    return axios.get(FansMedia, {params: newobj})
      .then((response) => {
        var data = response.data
        return data
      })
      .then((data) => {
        if (!data.msg) {
          dispactchAction(dispatch, GET_FANSMEDIA_SUCCESS, {items: data.res.data, query: obj, total: data.res.total})
        }
        return data
      }).catch()
  }
}

export function categoryChange (obj) {
  return (dispatch, getState) => {
    dispactchAction(dispatch, FANS_CATEGORIES_CHANGE, {id: obj.category_id})
    return axios.get(FansMedia, {params: Object.assign({}, obj, {limit: 15, service_scope: 2})})
      .then((response) => {
        var data = response.data
        return data
      })
      .then((data) => {
        if (!data.msg) {
          dispactchAction(dispatch, GET_FANSMEDIA_SUCCESS, {items: data.res.data, query: obj, total: data.res.total})
        }
        return data
      }).catch()
  }
}

export function getFansCates (obj) {
  return function (dispatch, getState) {
    return axios.post(FansCategories, obj)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (!data.msg) {
          dispactchAction(dispatch, GET_FANSCATES_SUCCESS, {items: data.res.data, mtype: obj.m_type})
        }
        return data
      }).catch()
  }
}


export const actions = {
  getFansCates,
  categoryChange,
  loadFansMedia,
  selectedItem,
  createFansActivity,
  mediaTypeChange,
  getFansActivity,
  sendFansRemarks
}
