import React from 'react'

import Route from 'react-router/lib/Route'
import IndexRoute from 'react-router/lib/IndexRoute'
import Redirect from 'react-router/lib/Redirect'
//import { routeActions } from 'react-router-redux'
import { IndexUrl, SetItemsUrl, SetItemsChartUrl, LogUrl, NavUserCenter,
  LoginUrl, RechargeUrl, SetShopUrl, ShopChartUrl,
  ActivityIndexUrl, SetActivityUrl, MyActivityNavUrl, ActivityDetailUrl, UnionDetailUrl, UnionActivityUrl,
  AllChartUrl,
  FinanceUrl, FinanceRecordUrl, FinanceGiftUrl, InvoiceAddressUrl, InvoiceInforUrl,
  FinanceInvoiceUrl, AskNewInvoiceUrl,
  AllShopClikUrl,
  NavMediaSource,
  SetMobileUrl, SetMobileChartUrl,
  DaRen, DaRenTbzb, DaRenTbtt, DaRenOrder, EffectReportUrl
} from 'help/siteNav' /*SetSelectedUrl, SetSelectChartUrl,JiFen, JiFenPlist, JiFenOrderlist,*/
import HomeLayout from 'layouts/HomeLayout'
import ContentLayout from 'layouts/ContentLayout'

import LoginView from 'views/User/login'
import UserCenterView from 'views/User/userhome'

import HomeView from 'views/HomeView/xb/HomeView'
import SetItemsView from 'views/SetItems/SetItemsView'
import SetShopsView from 'views/SetShops/SetShopsView'

import ActivityLayout from 'views/activity/layout'
import UnionDetailView from 'views/activity/union/union-detail'
import MyUnionActivityView from 'views/activity/union/union'
import SetActivityView from 'views/activity/activity'
import MyActivityView from 'views/activity/myActivity'
import ActivityDetailView from 'views/activity/detail/detail'

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

//import SelectMainView from 'views/select/SelectMainView'
import MobileLayout from 'views/SetMobile/layout'
import MobileMainView from 'views/SetMobile/mobileMainView'

import DarenLayout from 'views/daren/layout'
import TaobaoToutiaoView from 'views/daren/TaobaoTouTiao'
import TaoBaoZhiboView from 'views/daren/TaobaoZhibo'
import DarenOrderView from 'views/daren/order'

//import JiFenLayoutView from 'views/jifen/jifenLayout'
//import JiFenProductListView from 'views/jifen/productList'
//import JiFenOrderListView from 'views/jifen/orderList'
//import JiFenProductDetailView from 'views/jifen/productDetail'
import { isLoaded as isAuthLoaded, getUserLoad as loadAuth } from 'redux/user/Auth'

import { pagedata } from 'help/pagedata'
import checkUser from '../userIntervalCheck'
//import RegisterView from 'views/User/register'
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
        <IndexRoute component={HomeView}/>
        <Route component={HomeLayout}>
          <Route path={IndexUrl} component={HomeView}/>
          <Route path={LoginUrl} component={LoginView} />
        </Route>
        <Route component={ContentLayout} onEnter={requireAuth} >
          <Route path={SetItemsUrl} component={SetItemsView} breadcrumbName='打造爆款' />
          <Route path={SetItemsChartUrl + '/:appid'} component={ShareChart} breadcrumbName='推宝贝报表'/>
          <Route path={AllShopClikUrl} component={ClickSourceView} breadcrumbName='点击来源' />
          <Route path={EffectReportUrl} component={EffectReportView} breadcrumbName='累计推广效果' /> //推广效果
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
          <Route component={ActivityLayout} path={ActivityIndexUrl } breadcrumbName='活动报名'>
            <IndexRoute breadcrumbName='全部活动' components={SetActivityView}/>
            <Route path={SetActivityUrl} breadcrumbName='全部活动' components={SetActivityView} />
            <Route path={MyActivityNavUrl} breadcrumbName='我参加的活动' components={MyActivityView} />
            <Route path={UnionActivityUrl} breadcrumbName='我参加的组合活动' components={MyUnionActivityView} />
            <Route path={ActivityDetailUrl + ':id'} breadcrumbName='活动详情' components={ActivityDetailView} />
            <Route path={UnionDetailUrl + ':id'} breadcrumbName='活动详情' components={UnionDetailView} />
          </Route>

          <Route component={DarenLayout} path={DaRen} breadcrumbName='找网红'>
            <IndexRoute component={TaoBaoZhiboView} breadcrumbName='淘宝直播' />
            <Route component={TaobaoToutiaoView} path={DaRenTbtt} breadcrumbName='头条达人' />
            <Route component={TaoBaoZhiboView} path={DaRenTbzb} breadcrumbName='淘宝直播' />
            <Route component={DarenOrderView} path={DaRenOrder} breadcrumbName='活动管理' />
          </Route>

          {/*<Redirect from={JiFen} to={JiFenPlist} />
          <Route component={JiFenLayoutView} path={JiFen} breadcrumbName='积分兑换'>
            <Route component={JiFenProductListView} path={JiFenPlist} breadcrumbName='积分商城' />
            <Route component={JiFenProductDetailView} path={JiFenPlist + '/:id'} breadcrumbName='详情' />
            <Route component={JiFenOrderListView} path={JiFenOrderlist} breadcrumbName='我的订单' />
          </Route>*/}
        </Route>
        <Route path='404' component={NotFoundView} />
        <Redirect from='*' to='404' />
      </Route>
    )
}
/*
* <Route path={SetSelectedUrl} component={SelectMainView} breadcrumbName='精选推广'/>
 <Route path={SetSelectChartUrl + '/:appid'} component={ShareChart} breadcrumbName='精选推广报表'/>
* */
