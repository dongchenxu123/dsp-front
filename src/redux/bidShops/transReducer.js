/**
 * Created by CY on 2016/2/4.
 */
import { handleActions } from 'redux-actions'
import { setshops_id as APPID } from 'help/appid'
import { FormateNum } from 'help/formate'

const initsetitems = {
  items: {
    list: [],
    data: {}
  },
  page: 1,
  totalItems: 0,
  todayChart: {},
  totalChart: {},
  settings: {dayHours: [], categories: [], catePrice: 0},
  transSize: {},
  transCats: {
    data: [],
    isFetching: false
  },
  tags: [],
  fetching: false,
  isFetching: false,
  editFetching: false,
  delFetching: false
}
export default handleActions({
  ['SET_ALLLOCATIONS_SUCCESS']: (state, { payload }) => {
    if (parseInt(payload.campaign_type, 10) !== APPID) {
      return state
    }
    var loc = payload.locations
    return Object.assign({}, state, {settings: Object.assign({}, state.settings, {locations: loc})})
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
  ['GET_SETSHOPS__REQUEST']: (state, { payload }) => {
    return state
  },
  ['GET_SETSHOPS_SUCCESS']: (state, { payload }) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: payload.items,
      page: payload.page,
      totalItems: payload.totalItems
    })
  },
  ['ADD_SETSHOPS_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {addFetching: true})
  },
  ['ADD_SETSHOPS_SUCCESS']: (state, { payload }) => {
    var newItem = [payload]
    return Object.assign({}, state, {items: newItem.concat(state.items), addFetching: false})
  },
  ['ADD_SETSHOPS_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {addFetching: false})
  },
  ['DEL_SETSHOPS_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {delFetching: true})
  },
  ['DEL_SETSHOPS_SUCCESS']: (state, { payload }) => {
    var id = payload.id
    var index = 0
    for (var i = 0; i < state.items.length; i++) {
      if (id === state.items[i].pid) {
        index = i
        break
      }
    }
    return Object.assign({}, state, {delFetching: false, items: [...state.items.slice(0, index), ...state.items.slice(index + 1)]})
  },
  ['DEL_SETSHOPS_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {delFetching: false})
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
    return Object.assign({}, state, {transSize: Object.assign({}, payload, {isFetching: false})})
  },
  ['EDIT_TRANS_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {editFetching: true})
  },
  ['EDIT_TRANS_SUCCESS']: (state, { payload }) => {
    var id = payload.pid + ''
    var index = 0
    for (var i = 0; i < state.items.length; i++) {
      if (id === state.items[i].pid) {
        index = i
        break
      }
    }
    return Object.assign({}, state, {editFetching: false, items: [...state.items.slice(0, index), Object.assign({}, state.items[index], payload), ...state.items.slice(index + 1)]})
  },
  ['EDIT_TRANS_FAILURE']: (state, { payload }) => {
    return Object.assign({}, state, {editFetching: false})
  },
  ['GET_TRANS_CATS_REQUEST']: (state, { payload }) => {
    return Object.assign({}, state, {transCats: Object.assign({}, state.transCats, {isFetching: true})})
  },
  ['GET_TRANS_CATS_SUCCESS']: (state, { payload }) => {
    return Object.assign({}, state, {transCats: Object.assign({}, state.transCats, {isFetching: false, data: payload})})
  },
  ['GET_TRANS_CATS_FAILURE']: (state, { payload }) => {
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
