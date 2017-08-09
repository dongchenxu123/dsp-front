/**
 * Created by CY on 2016/1/20.
 */
//import { createAction, handleActions } from 'redux-actions'
import axios from 'axios'
import { createAction } from 'redux-actions'
//import { routeActions } from 'react-router-redux'

import { Loginurl, GetUser, GetSmsCode, SetUserPhone, SetWechatUrl, SetPassword } from 'help/url'
//import { IndexUrl } from 'help/siteNav'
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, STORE_RESET,
  GET_DSP_USER_REQUEST, GET_DSP_USER_SUCCESS, GET_DSP_USER_FAILURE,
  SET_USER_PHONE_REQUEST, SET_USER_PHONE_SUCCESS, SET_USER_PHONE_FAILURE,
  GET_WECHAT_PIC_REQUEST, GET_WECHAT_PIC_SUCCESS, GET_WECHAT_PIC_FAILURE,
  SET_USER_PASSWD_REQUEST, SET_USER_PASSWD_SUCCESS, SET_USER_PASSWD_FAILURE
} from '../const'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

export const requestLogin = createAction(LOGIN_REQUEST, (state) => state)
export const loginSuccess = createAction(LOGIN_SUCCESS, (user) => {
  return user
})
export const loginError = createAction(LOGIN_FAILURE, (user) => user)

export function loginAction (creds) {
  return function (dispatch, getState) {
    dispatch({
      type: STORE_RESET
    })
    dispatch(requestLogin())
    return axios.post(Loginurl, creds)
      .then((response) => {
        var data = response.data
        return data
      })
      .then((data) => {
        if (data.msg) {
          dispatch(loginError())
        } else {
          dispatch(loginSuccess(data.res))
          window.location.href = '/'
          //dispatch(routeActions.replace(IndexUrl))
        }
        return data
      })
      .catch(() => console.log('error'))
  }
}

//获取用户
export const requestUser = createAction(GET_DSP_USER_REQUEST, (state) => state)
export const requestUserSuccess = createAction(GET_DSP_USER_SUCCESS, (user) => {
  return user
})
export const requestUserError = createAction(GET_DSP_USER_FAILURE, (user) => user)
export function getDspUserAction () {
  return (dispatch, getState) => {
    dispatch(requestUser(getState()))
    return axios.get(GetUser)
      .then((response) => {
        var data = response.data
        return data
      })
      .then((data) => {
        if (data.msg) {
          dispatch(requestUserError())
        } else {
          dispatch(requestUserSuccess(data.res))
        }
        return data
      }).catch((err) => {
        console.log(err)
      })
  }
}
export function GetSmsCodeAction (telephone) {
  return (dispatch, getState) => {
    return axios.post(GetSmsCode, {telephone})
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        return data
      })
  }
}

//绑定手机号
export const setPhoneRequest = createAction(SET_USER_PHONE_REQUEST, (items) => items)
export const setPhoneSuccess = createAction(SET_USER_PHONE_SUCCESS, (telephone) => telephone)
export const setPhoneError = createAction(SET_USER_PHONE_FAILURE, (user) => user)

export function sendPhoneAction (phoneItmes) {
  return (dispatch, getState) => {
    if (!phoneItmes.telephone || !phoneItmes.code) {
      return
    }
    dispatch(setPhoneRequest())
    return axios.post(SetUserPhone, phoneItmes)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(setPhoneError())
          return
        }
        dispatch(setPhoneSuccess({telephone: phoneItmes.telephone}))
      })
  }
}


const getWechatPicRequest = createAction(GET_WECHAT_PIC_REQUEST, (items) => items)
const getWechatPicSuccess = createAction(GET_WECHAT_PIC_SUCCESS, (pic) => pic)
const getWechatPicError = createAction(GET_WECHAT_PIC_FAILURE, (user) => user)

export function GetWetChatPicAction () {
  return (dispatch, getState) => {
    dispatch(getWechatPicRequest())
    return axios.get(SetWechatUrl)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(getWechatPicError())
          return
        }
        //console.log(data)
        if (data.res.pic_url) {
          dispatch(getWechatPicSuccess(data.res.pic_url))
        }
      }).catch(() => {
        console.log('error')
      })
  }
}

//设置用户登录密码
const setUserPasswdRequest = createAction(SET_USER_PASSWD_REQUEST, (items) => items)
const setUserPasswdSuccess = createAction(SET_USER_PASSWD_SUCCESS, (pic) => pic)
const setUserPasswdError = createAction(SET_USER_PASSWD_FAILURE, (user) => user)

export function SetUserPasswdAction (query) {
  return (dispatch, getState) => {
    dispatch(setUserPasswdRequest())
    return axios.post(SetPassword, query)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {
          dispatch(setUserPasswdError())
          return data
        }
        dispatch(setUserPasswdSuccess())
        return data
      })
  }
}

export const actions = {
  loginAction,
  //logoutAction,
  getDspUserAction,
  GetSmsCodeAction,
  sendPhoneAction,
  GetWetChatPicAction,
  SetUserPasswdAction
}
