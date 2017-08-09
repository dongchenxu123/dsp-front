/**
 * Created by CY on 2016/2/4.
 */
import { handleActions } from 'redux-actions'
import { setmobile_id as APPID } from 'help/appid'
import { FormateNum } from 'help/formate'

const initsetitems = {
  items: {
    list: [],
    data: {}
  },
  page: 0,
  totalItems: 0,
  todayChart: {},
  totalChart: {},
  settings: {dayHours: [], tags: [], catePrice: 0, userCates: []},
  transSize: {},
  transCats: {
    data: [],
    isFetching: false
  },
  tags: [],
  fetching: false,
  isFetching: false,
  editFetching: false
}
export default handleActions({
  ['SET_ALLLOCATIONS_SUCCESS']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    var loc = payload.locations
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {locations: loc})})
  },
  ['SETTING/SET_HOURS_SUCCESS']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    const resq = [payload.hours.d0, payload.hours.d1, payload.hours.d2, payload.hours.d3, payload.hours.d4, payload.hours.d5, payload.hours.d6]
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {dayHours: resq})})
  },
  ['SETTING/GET_HOURS_REQUEST']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    return state
  },
  ['SETTING/GET_HOURS_SUCCESS']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    const resq = [payload.d0, payload.d1, payload.d2, payload.d3, payload.d4, payload.d5, payload.d6]
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {dayHours: resq})})
  },
  ['SETTING/GET_HOURS_FAILURE']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    return state
  },
  ['GET_TODAYDATA_SUCCESS']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    return Object.assign({}, state, {todayChart: Object.assign({}, state.todayChart, payload)})
  },
  ['GET_ALLDATA_SUCCESS']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    var i = 0
    var l = payload.data.length
    for (i; i < l; i++) {
      if (payload.data[i].roi) {
        payload.data[i].roi = FormateNum(payload.data[i].roi)
      }
      payload.data[i].pv = payload.data[i].impressions
    }
    return Object.assign({}, state, {totalChart: Object.assign({}, state.totalChart, payload)})
  },
  ['GET_ITEM_SETTING_REQUEST']: (state, {payload}) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {isFetching: true})})
  },
  ['GET_ITEM_SETTING_FAILURE']: (state, {payload}) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {isFetching: false})})
  },
  ['GET_ITEM_SETTING_SUCCESS']: (state, { payload }) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    payload.isFetching = false
    let str = payload.categories
    if (!str.length) {
      payload.categories = []
      payload.catePrice = 100
    } else {
      let obj = JSON.parse(str)[0]
      payload.categories = obj.Categories
      payload.catePrice = obj.Price
    }
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, payload)})
  },
  ['SETTING/BUDGET_SUCCESS']: (state, { payload }) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {budget: payload.budget})})
  },
  ['SETTING/SET_CPC_SUCCESS']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {cpc: payload.cpc})})
  },
  ['GET_TRANS_SIZE_SUCCESS']: (state, {payload}) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    return Object.assign({}, state, {transSize: Object.assign({}, payload, {isFetching: false})})
  },
  ['SET_TRANS_STATUS_SUCCESS']: (state, {payload}) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    var id = payload.pid + ''
    var index = 0
    for (var i = 0; i < state.items.length; i++) {
      if (id === state.items[i].pid) {
        index = i
        break
      }
    }
    return Object.assign(
      {},
      state,
      {items: [...state.items.slice(0, index),
        Object.assign({}, state.items[index], {state: payload.state}),
        ...state.items.slice(index + 1)]
      })
  },
  ['GET_MOBILETRANS_CATS_REQUEST']: (state, { payload }) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    return Object.assign({}, state, {transCats: Object.assign({}, state.transCats, {isFetching: true})})
  },
  ['GET_MOBILETRANS_CATS_SUCCESS']: (state, { payload }) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    var loadedData = []
    loadedData = payload.data.map((item) => {
      return {label: item.name, value: item.id, isLeaf: false}
    })
    if (!payload.cid) {
      payload.cid = 0
      return Object.assign({}, state, {transCats: Object.assign({}, state.transCats, {isFetching: false, data: loadedData})})
    }
    let index = 0
    for (var i = 0; i < state.transCats.data.length; i++) {
      if (state.transCats.data[i].value === payload.cid) {
        index = i
        break
      }
    }
    const data = state.transCats.data
    const notLeaf = payload.data.map((item) => {
      return {label: item.name, value: item.id, isLeaf: true}
    })
    let newData = [
      ...data.slice(0, index), Object.assign({}, data[index], {children: notLeaf}), ...data.slice(index + 1)
    ]
    return Object.assign({}, state, {transCats: Object.assign({}, state.transCats, {isFetching: false, data: newData})})
  },
  ['GET_MOBILETRANS_CATS_FAILURE']: (state, { payload }) => {
    if (payload.campaign_type !== APPID) {
      return state
    }
    return Object.assign({}, state, {transCats: Object.assign({}, state.transCats, {isFetching: false})})
  },
  ['GET_PEOPLE_TAGS_REQUEST']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    return state
  },
  ['GET_PEOPLE_TAGS_SUCCESS']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {tags: payload.all_cates}, {userCates: payload.user_cates})})
  },
  ['GET_PEOPLE_TAGS_FAILURE']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    return Object.assign({}, state, {isFetching: false})
  },
  ['SET_PEOPLE_TAGS_SUCCESS']: (state, {payload}) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    var newTags = state.settings.tags
    var userCate = JSON.parse(payload.categories)
    for (var j = 0; j < newTags.length; j++) {
      newTags[j].key = j
      if (!newTags[j].price) {
        newTags[j].price = 100
      }
      for (var i = 0; i < userCate.length; i++) {
        if (parseInt(userCate[i].cate_id, 10) === parseInt(newTags[j].id, 10)) {
          newTags[j].price = userCate[i].price
          break
        }
      }
    }
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {userCates: JSON.parse(payload.categories)}, {tags: newTags})})
  }
}, initsetitems)
