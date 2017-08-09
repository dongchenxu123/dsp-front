/**
 * Created by CY on 2016/1/25.
 */
import { handleActions } from 'redux-actions'
import { setitems_id as APPID } from 'help/appid'
import { FormateNum } from 'help/formate'

const initsetitems = {
  items: [],
  errMsg: null,
  page: 0,
  totalPage: 0,
  settings: {dayHours: [], tags: [], catePrice: 0, userCates: []},
  todayChart: {},
  totalChart: {},
  type: 0,
  tags: [],
  pkgtypes: [],
  pkgs: {},
  pkgdays: [],
  isFetching: false,
  bidFetching: false,
  pkgsFetching: false
}

export default handleActions({
  ['ADD_ITEM_RENQIPKGS_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {pkgsFetching: true})
  },
  ['ADD_ITEM_RENQIPKGS_SUCCESS']: (state, { payload }) => {
    const itemId = payload.item_id
    const items = state.items
    let idx = 0
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === itemId) {
        idx = i
        break
      }
    }
    return Object.assign(
      {},
      state,
      {
        pkgsFetching: false,
        items: [...state.items.slice(0, idx), Object.assign({}, state.items[idx], {renqi_id: payload.pid + ''}), ...state.items.slice(idx + 1)]
      }
    )
  },
  ['ADD_ITEM_RENQIPKGS_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {pkgsFetching: false})
  },
  ['GET_ITEM_RENQIPKGS_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {pkgsFetching: true})
  },
  ['GET_ITEM_RENQIPKGS_SUCCESS']: (state, { payload }) => {
    const items = payload.items
    let pkgtypes = []
    let pkgtypeids = []
    let pkgs = {}
    let pkgdays = []
    if (items.length > 0) {
      let len = items.length
      for (let i = 0; i < len; i++) {
        if (pkgtypeids.indexOf(items[i].promote_type) < 0) {
          pkgtypeids.push(items[i].promote_type)
          pkgtypes.push({id: items[i].promote_type, name: items[i].promote_desc})
        }
        if (pkgdays.indexOf(items[i].days) < 0) {
          pkgdays.push(items[i].days)
        }
        pkgs[items[i].promote_type + '_' + items[i].days] = items[i]
      }
    }
    return Object.assign({}, state, {pkgtypes: pkgtypes, pkgs: Object.assign({}, state.pkgs, pkgs), pkgdays: pkgdays, pkgsFetching: false})
  },
  ['GET_ITEM_RENQIPKGS_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {pkgsFetching: false})
  },
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
  ['ITEMS_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {isFetching: true})
  },
  ['ITEMS_SUCCESS']: (state, { payload }) => {
    return Object.assign({}, state, {isFetching: false, type: payload.type, items: payload.items, totalPage: payload.totalPage, page: payload.page})
  },
  ['ITEMS_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {isFetching: false})
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
      //payload.categories = []
      payload.catePrice = 100
    } else {
      let obj = JSON.parse(str)[0]
      //payload.categories = obj.Categories
      payload.catePrice = obj.Price
    }

    return Object.assign({}, state, {settings: Object.assign({}, state.settings, payload)})
  },
  ['BID_ITEMS_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {bidFetching: true})
  },
  ['BID_ITEMS_SUCCESS']: (state, { payload }) => {
    var bidSuccess = []
    for (var key in payload) {
      if (payload[key].res) {
        bidSuccess.push(key)
      }
    }
    const items = state.items.slice(0, state.items.length)
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; j < bidSuccess.length; j++) {
        if (items[i].id + '' === bidSuccess[j]) {
          items[i].online = true
        }
      }
    }
    return Object.assign({}, state, {bidFetching: false, items: items})
  },
  ['BID_ITEMS_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {bidFetching: false, errMsg: payload})
  },
  ['STOPBID_ITEMS_REQUEST']: (state, { payload }) => {
    return state
  },
  ['STOPBID_ITEMS_SUCCESS']: (state, { payload }) => {
    const items = state.items.slice(0, state.items.length)
    for (var i = 0; i < items.length; i++) {
      for (var j = 0; j < payload.length; j++) {
        if (items[i].id + '' === payload[j]) {
          items[i].online = false
        }
      }
    }
    return Object.assign({}, state, {items: items})
  },
  ['STOPBID_ITEMS_FAILURE']: (state, { payload }) => {
    return state
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
  ['EDITBID_ITEMS_SUCCESS']: (state, { payload }) => {
    var id = payload.item_id + ''
    var index = 0
    for (var i = 0; i < state.items.length; i++) {
      if (state.items[i].id + '' === id) {
        index = i
        break
      }
    }
    let item = Object.assign({}, state.items[index])
    item.title = payload.title
    item.discount_price = payload.price
    item.pic_url = payload.pic_url || item.pic_url
    return Object.assign({}, state, {items: [...state.items.slice(0, index),
      item,
      ...state.items.slice(index + 1)
    ]})
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
