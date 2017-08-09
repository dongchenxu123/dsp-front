import { combineReducers } from 'redux'
//import { routeReducer as router } from 'redux-simple-router'
import { routeReducer as router } from 'react-router-redux'

//import counter from './modules/counter'
//import chart from './chart/chartReducer'
import auth from './user/userReducer'
import setitems from './setitems/setItemsReducer'
import log from './log/logReducer'
import recharge from './recharge/recharge'
import shoptrans from './bidShops/transReducer'
import userShopChart from './userShopChart'
import activity from './activity/activityReducer'
import finance from './finance/finance'
import suggestmedia from './mediasource/media'
import select from './select/selectReducer'
import invoice from './invoice/invoiceReducer'
import mobile from './mobile/mobileReducer'
import daren from './daren/daren_reducer'
import jifen from './jifen/jifenReducer'

//import settings from './settings/shareChart'

export default combineReducers({
  router,
  auth,
  setitems,
  recharge,
  shoptrans,
  userShopChart,
  activity,
  finance,
  invoice,
  suggestmedia,
  select,
  mobile,
  daren,
  log,
  jifen
})
/*export default function dspApp (state, action) {
  return {
    router: router(state.router, action),
    auth: auth(state.auth, action),
    setitems: setitems(state.setitems, action),
    recharge: recharge(state.recharge, action),
    shoptrans: shoptrans(state.shoptrans, action),
    userShopChart: userShopChart(state.userShopChart, action),
    activity: activity(state.activity, action),
    finance: finance(state.finance, action),
    invoice: invoice(state.invoice, action),
    suggestmedia: suggestmedia(state.suggestmedia, action),
    select: select(state.select, action),
    mobile: mobile(state.mobile, action),
    daren: daren(state.daren, action),
    log: log(state.log, action)
    //settings: settings(state, action)
  }
}*/
