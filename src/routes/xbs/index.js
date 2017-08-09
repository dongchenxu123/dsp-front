import React from 'react'

import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'
import Redirect from 'react-router/lib/Redirect'
import IndexRedirect from 'react-router/lib/IndexRedirect'
import {
  SetItemsUrl, SetItemsChartUrl, LogUrl, NavUserCenter,
  LoginUrl, RechargeUrl,
  AllChartUrl,
  FinanceUrl, FinanceRecordUrl, FinanceGiftUrl, InvoiceAddressUrl, InvoiceInforUrl, FinanceInvoiceUrl, AskNewInvoiceUrl,
  AllShopClikUrl,
  NavMediaSource, DaRen, DaRenTbzb, DaRenTbtt, DaRenOrder,
  JiFen, JiFenPlist, JiFenOrderlist, EffectReportUrl
} from 'help/siteNav'
import HomeLayout from 'layouts/HomeLayout'
import ContentLayout from 'layouts/ContentLayout'

import LoginView from 'views/User/login'
import UserCenterView from 'views/User/userhome'

import SetItemsView from 'views/SetItems/SetItemsView'

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

import DarenLayout from 'views/daren/layout'
import TaobaoToutiaoView from 'views/daren/TaobaoTouTiao'
import TaoBaoZhiboView from 'views/daren/TaobaoZhibo'
import DarenOrderView from 'views/daren/order'

import JiFenLayoutView from 'views/jifen/jifenLayout'
import JiFenProductListView from 'views/jifen/productList'
import JiFenOrderListView from 'views/jifen/orderList'
import JiFenProductDetailView from 'views/jifen/productDetail'

import { isLoaded as isAuthLoaded, getUserLoad as loadAuth } from 'redux/user/Auth'
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
          <IndexRoute component={SetItemsView}/>
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
          <Route component={DarenLayout} path={DaRen} breadcrumbName='找网红'>
            <IndexRoute component={TaoBaoZhiboView} breadcrumbName='淘宝直播' />
            <Route component={TaobaoToutiaoView} path={DaRenTbtt} breadcrumbName='头条达人' />
            <Route component={TaoBaoZhiboView} path={DaRenTbzb} breadcrumbName='淘宝直播' />
            <Route component={DarenOrderView} path={DaRenOrder} breadcrumbName='活动管理' />
          </Route>

          <Redirect from={JiFen} to={JiFenPlist} />
          <Route component={JiFenLayoutView} path={JiFen} breadcrumbName='积分兑换'>
            <Route component={JiFenProductListView} path={JiFenPlist} breadcrumbName='积分商城' />
            <Route component={JiFenProductDetailView} path={JiFenPlist + '/:id'} breadcrumbName='详情' />
            <Route component={JiFenOrderListView} path={JiFenOrderlist} breadcrumbName='我的订单' />
          </Route>
        </Route>
        <Route path='404' component={NotFoundView} />
        <Redirect from='*' to='404' />
      </Route>
    )
}
