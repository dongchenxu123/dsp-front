import React from 'react'

import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'
import Redirect from 'react-router/lib/Redirect'
import IndexRedirect from 'react-router/lib/IndexRedirect'

import {
  SetItemsUrl, SetItemsChartUrl, LogUrl, NavUserCenter,
  LoginUrl, RechargeUrl, SetShopUrl, ShopChartUrl,
  AllChartUrl,
  FinanceUrl, FinanceRecordUrl, FinanceGiftUrl, InvoiceAddressUrl, InvoiceInforUrl,
  FinanceInvoiceUrl, AskNewInvoiceUrl,
  AllShopClikUrl,
  NavMediaSource,
  SetMobileUrl, SetMobileChartUrl, EffectReportUrl

} from 'help/siteNav'

import HomeLayout from 'layouts/HomeLayout'
import ContentLayout from 'layouts/ContentLayout'

import LoginView from 'views/User/login'
import UserCenterView from 'views/User/userhome'

import SetItemsView from 'views/SetItems/SetItemsView'
import SetShopsView from 'views/SetShops/SetShopsView'

import ShareChart from 'views/share/chart'
import ClickSourceView from 'views/share/clicksource'
import EffectReportView from 'views/share/effectReport'

import UserShopChart from 'views/shopchart/shopchart'
import RechargeView from 'views/recharge/RechargeView'
import LogView from 'views/Log/Log'
import MediaSourceView from 'views/mediasource/mediasource'
import NotFoundView from 'views/NotFoundView/NotFoundView'

import FinanceLayout from 'views/finance/layout'
import FinanceRecordView from 'views/finance/financeRecord'
import GiftRecordView from 'views/finance/moneyGift'

import InvoiceView from 'views/finance/invoiceList'
import AskNewInvoice from 'views/finance/askInvoice'
import EditAddr from 'views/finance/editAddr'
import EditInfo from 'views/finance/editInvoice'

import MobileLayout from 'views/SetMobile/layout'
import MobileMainView from 'views/SetMobile/mobileMainView'

import { isLoaded as isAuthLoaded, getUserLoad as loadAuth } from 'redux/user/Auth'

import { pagedata } from 'help/pagedata'
import checkUser from '../userIntervalCheck'

export default function (store) {
  const requireAuth = (nextState, replace, cb) => {
    function checkAuth () {
      const user = store.getState().auth.user
      if (!user.id) {
        replace(__DEV__ ? __BASENAME__ + LoginUrl.replace('/', '') : LoginUrl)
      }
      checkUser(store.getState().auth.user)
      cb()
    }
    if (!isAuthLoaded(store.getState().auth.user)) {
      store.dispatch(loadAuth()).then(checkAuth)
    } else {
      checkAuth()
    }
  }
  return (
      <Route path='/' breadcrumbName='首页' >
        <IndexRedirect to={SetItemsUrl} />
        <Route component={HomeLayout}>
          <Route path={LoginUrl} component={LoginView} />
        </Route>
        <Route component={ContentLayout} onEnter={requireAuth} >
          <Route path={SetItemsUrl} component={SetItemsView} breadcrumbName='打造爆款' />
          <Route path={SetItemsChartUrl + '/:appid'} component={ShareChart} breadcrumbName='推宝贝报表'/>
          <Route path={AllShopClikUrl} component={ClickSourceView} breadcrumbName='点击来源' />
          <Route path={EffectReportUrl} component={EffectReportView} breadcrumbName='查看' />
          <Route path={FinanceUrl} component={FinanceLayout} breadcrumbName='财务'>
            <IndexRoute component={FinanceRecordView} breadcrumbName='财务报表' />
            <Route path={FinanceRecordUrl} component={FinanceRecordView} breadcrumbName='财务报表' />
            <Route path={FinanceGiftUrl} component={GiftRecordView} breadcrumbName='红包记录' />
            <Route path={FinanceInvoiceUrl} component={InvoiceView} breadcrumbName='发票记录' />
            <Route path={AskNewInvoiceUrl} component={AskNewInvoice} breadcrumbName='申请发票' />
            <Route path={InvoiceAddressUrl} component={EditAddr} breadcrumbName='编辑发票地址'/>
            <Route path={InvoiceInforUrl} component={EditInfo} breadcrumbName='编辑发票信息' />
          </Route>
          <Route path={NavMediaSource} component={MediaSourceView} breadcrumbName='投放媒体资源' />
          <Route path={LogUrl} component={LogView} breadcrumbName='操作记录' />
          <Route path={RechargeUrl} component={RechargeView} breadcrumbName='充值' />
          <Route path={NavUserCenter} component={UserCenterView} breadcrumbName='用户中心' />
          <Route path={AllChartUrl} component={UserShopChart} breadcrumbName='店铺推广报表' />

          <Route path={SetShopUrl} component={SetShopsView} breadcrumbName='推店铺'/>
          <Route path={ShopChartUrl + '/:appid'} component={ShareChart} breadcrumbName='推店铺报表' />

          <Route path={SetMobileUrl} component={MobileLayout} breadcrumbName={pagedata.mobile.title} >
            <IndexRoute component={MobileMainView} breadcrumbName={pagedata.mobile.title + '列表'}/>
            <Route path={SetMobileUrl} component={MobileMainView} breadcrumbName='移动推广列表' />
            <Route path={SetMobileChartUrl + ':appid'} component={ShareChart} breadcrumbName='移动推广报表' />
          </Route>
        </Route>
        <Route path='404' component={NotFoundView} />
        <Redirect from='*' to='404' />
      </Route>
    )
}
