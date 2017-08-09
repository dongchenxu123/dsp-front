/**
 * Created by CY on 2016/2/4.
 */
import axios from 'axios'
import { createAction } from 'redux-actions'

import { GetValidSize } from 'help/url'
import { loadThirtyDayChartAction, loadCPCAndBudget, setBudgetAction, setCPCAction, setPeopleTagsAction } from 'redux/bidseting/setingAction'
import { loadUserShopPeopleAction, loadUserShopScoreAction } from 'redux/userShopChart'
import { loadTodayDataAction } from 'redux/chart/chartAction'
import { getBidTrans, addBidItemTrans, delBidItemTrans, setBidItemStatus, editBidItemTrans } from '../share/actions'
import {GET_TRANS_SIZE_REQUEST, GET_TRANS_SIZE_SUCCESS, GET_TRANS_SIZE_FAILURE} from '../const'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

//获取自定义推广尺寸
export const requestTransSize = createAction(GET_TRANS_SIZE_REQUEST, (items) => items)
export const getTransSizeSuccess = createAction(GET_TRANS_SIZE_SUCCESS, (payload) => {
  return payload
})
export const getTransSizeFailure = createAction(GET_TRANS_SIZE_FAILURE, (items) => items)

//获取类目
export function getValidTransSize () {
  return (dispatch, getState) => {
    dispatch(requestTransSize())
    return axios.get(GetValidSize)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getTransSizeFailure())
        } else {
          dispatch(getTransSizeSuccess({data: data.res}))
        }
      }).catch()
  }
}


import { getTransCatsAction } from '../mobile/mobileAction'

export const actions = {
  addBidItemTrans,
  delBidItemTrans,
  editBidItemTrans,
  getBidTrans,
  setBidItemStatus,
  getValidTransSize,
  loadCPCAndBudget,
  setBudgetAction,
  setCPCAction,
  getTransCatsAction,
  loadTodayDataAction,
  loadUserShopScoreAction,
  loadUserShopPeopleAction,
  loadThirtyDayChartAction,
  setPeopleTagsAction
}
