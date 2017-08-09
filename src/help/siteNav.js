/**
 * Created by CY on 2016/7/25.
 */
//import { pagedata } from './pagedata'
//静态文件前缀
export const STUrpPrefix = __DEV__ ? '/media/img/dsp/site/dsp_n/' : '//xbcdn-ssl.xibao100.com/media/img/dsp/site/dsp_n/'

/******************************站点导航url**************************************/
export const IndexUrl = '/'
export const SetItemsUrl = '/items'
export const SetShopUrl = '/shop'
export const SetMobileUrl = '/mobile'
export const SetMobileChartUrl = '/mobile/chart/'
export const SetSelectedUrl = '/select'

export const ActivityIndexUrl = '/activity'
export const SetActivityUrl = '/activity/all'
export const MyActivityNavUrl = '/activity/my'
export const UnionActivityUrl = '/activity/union'
export const ActivityDetailUrl = '/activity/detail/'
export const UnionDetailUrl = '/union/detail/'

export const SetItemsChartUrl = '/items/chart'
export const SetSelectChartUrl = '/select/chart'
export const ShopChartUrl = '/shop/chart'

export const AllChartUrl = '/chart'
export const AllShopClikUrl = '/chart/click'

export const LogUrl = '/log'
export const LoginUrl = '/login'
export const RechargeUrl = '/recharge'

export const FinanceUrl = '/finance'
export const FinanceRecordUrl = '/finance/record'
export const FinanceGiftUrl = '/finance/gift'
//发票
export const FinanceInvoiceUrl = '/finance/invoice'
export const AskNewInvoiceUrl = '/finance/invoice/new'
export const InvoiceAddressUrl = '/finance/invoice/addr'
export const InvoiceInforUrl = '/finance/invoice/info'

export const NavMediaSource = '/media'
export const NavUserCenter = '/user'

export const DaRen = '/daren'
export const DaRenTbzb = '/daren/tbzb'
export const DaRenTbtt = '/daren/tbtt'
export const DaRenOrder = '/daren/orders'

//export const JiFen = 'jifen'
//export const JiFenPlist = '/jifen/products'
//export const JiFenOrderlist = '/jifen/order/list'

//版本号
export const DSPVERSION = 'new'
export const EffectReportUrl = '/share/effectReport'

export const RegisterUrl = '/register'
/*{
 link: DaRen, text: pagedata.daren.title, key: 'setdaren', icon: 'icon-people'
 },
 {
 link: SetSelectedUrl, text: '精选推广', key: 'setselect'
 }
 */

export const siteNav = {
  menu: [
    {
      link: AllChartUrl, text: '推广报表', key: 'usershopchart'
    },
    {
      text: '快捷推广',
      key: 'dsp',
      links: [
        {
          link: SetMobileUrl, text: '无线推广', key: 'setmobiles'
        },
        {
          link: SetItemsUrl, text: '打造爆款', key: 'setitems'
        },
        {
          link: SetShopUrl, text: '聚合页推广', key: 'setshops'
        }
      ]
    },
    {
      link: ActivityIndexUrl, text: '活动报名', key: 'setactivity', icon: 'icon-event'
    },

    {
      link: FinanceUrl, text: '财务报表', key: 'finance'
    },
    {
      link: NavMediaSource, text: '投放媒体资源', key: 'mediasource'
    },
    {
      link: LogUrl, text: '操作记录', key: 'logs'
    }
  ],
  simpleMenu: [
    {
      link: AllChartUrl, text: '推广报表', key: 'usershopchart'
    },
    {
      link: SetItemsUrl, text: '打造爆款', key: 'setitems', icon: 'icon-target'
    },
    {
      link: FinanceUrl, text: '财务报表', key: 'finance'
    },
    {
      link: NavMediaSource, text: '投放媒体资源', key: 'mediasource'
    },
    {
      link: LogUrl, text: '操作记录', key: 'logs'
    }
  ]
}
const darenMenu = {link: DaRen, text: '找网红', key: 'wanghong', icon: 'icon-185070microrecordstreamline'}
//const jifen = {link: JiFen, text: '积分兑换', key: 'JiFen'}

const xbmenu = [...siteNav.menu.slice(0, 3), darenMenu, ...siteNav.menu.slice(3, 4), ...siteNav.menu.slice(4, 6)] /*jifen*/
const xbsmenu = [...siteNav.simpleMenu.slice(0, 2), darenMenu, ...siteNav.simpleMenu.slice(2, 3), ...siteNav.simpleMenu.slice(3, 5)]  /*jifen*/
export const nav_menu = {
  xb: xbmenu,
  xbs: xbsmenu,
  mjk: siteNav.menu.filter((item) => item.key !== 'setactivity'),
  mjkss: siteNav.simpleMenu,
  sx: siteNav.menu,
  llwy: xbsmenu
}
