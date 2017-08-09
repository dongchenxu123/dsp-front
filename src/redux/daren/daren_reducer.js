/**
 * Created by CY on 2016/6/27.
 */
import { handleActions } from 'redux-actions'
const initsetitems = {
  mediaType: 1, //1：达人 ，2：直播
  categories: 0, //频道类别，潮女，帅哥。。。
  fprice: -1,
  ffollowers: -1,
  fgender: -1,
  service_scope: 2,
  toutiaoCate: [],
  zhiboCate: [],
  selected: [],
  zhibolist: [],
  zhibodata: {},
  toutiaolist: [],
  toutiaodata: {},
  page: 1,
  total: 0,
  isFetching: false,
  order: {
    total: 0,
    page: 1,
    loading: false,
    data: []
  }
}
export default handleActions({
  ['GET_FANSACTIVITY_FAILURE']: (state, {payload}) => {
    return Object.assign({}, state, {order: Object.assign({}, state.order, {loading: false})})
  },
  ['GET_FANSACTIVITY_REQUEST']: (state, {payload}) => {
    return Object.assign({}, state, {order: Object.assign({}, state.order, {loading: true})})
  },
  ['GET_FANSACTIVITY_SUCCESS']: (state, {payload}) => {
    return Object.assign({}, state, {order: Object.assign({}, state.order, {data: payload.items, total: payload.total, page: payload.query.page, loading: false})})
  },
  ['FANS_MEDIATYPE_CHANGE']: (state, {payload}) => {
    return Object.assign({}, state, {page: 1, total: 0, categories: 0, fprice: -1, service_scope: 2, ffollowers: -1, fgender: -1, selected: []})
  },
  ['FANS_SELECT_MEDIA']: (state, {payload}) => {
    //console.log('FANS_SELECT_MEDIA', payload)
    let id = payload.id
    let selected = state.selected
    let index
    let bool = false
    for (let i = 0; i < selected.length; i++) {
      if (id === selected[i].id) {
        index = i
        bool = true
      }
    }

    if (bool) {
      return Object.assign({}, state, {selected: [...state.selected.slice(0, index), ...state.selected.slice(index + 1)]})
    }

    return Object.assign({}, state, {selected: [payload].concat(state.selected)})
  },
  ['GET_FANSMEDIA_SUCCESS']: (state, {payload}) => {
    const items = payload.items
    let list = []
    let flatItems = {}
    for (var i = 0; i < items.length; i++) {
      list.push(items[i].id)
      flatItems[items[i].id] = items[i]
    }
    if (payload.query.m_type === 1) {
      return Object.assign({}, state, {isFetching: false, toutiaolist: list, toutiaodata: flatItems, total: payload.total, selected: []})
    }
    return Object.assign({}, state, {isFetching: false, zhibolist: list, zhibodata: flatItems, total: payload.total, selected: []})
  },
  ['GET_FANSMEDIA_REQUEST']: (state, {payload}) => {
    payload.isFetching = true
    return Object.assign({}, state, payload)
  },
  ['FANS_CATEGORIES_CHANGE']: (state, {payload}) => {
    return Object.assign({}, state, {categories: parseInt(payload.id, 10), fprice: -1, service_scope: 2, ffollowers: -1, fgender: -1, page: 1})
  },
  ['GET_FANSCATES_SUCCESS']: (state, { payload }) => {
    let ctype = 'toutiaoCate'
    if (payload.mtype === 2) {
      ctype = 'zhiboCate'
    }
    return Object.assign({}, state, {[ctype]: payload.items})
  }
}, initsetitems)
