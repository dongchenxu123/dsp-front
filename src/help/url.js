/**
 * Created by CY on 2016/1/28.
 */
//==========================api===============================

export const Loginurl = '/login?is_ajax=1'
export const checkUser = '/user?do=verify&v='
export const GetUser = '/user?do=get-dsp-user&version=new'
export const ChartDateUrl = '/report?do=get-shop-report'
export const LogDataUrl = '/user?do=get-operation-logs&limit=25'
export const GetSetings = '/user?do=get-campaign-type-settings' //获取日限额和平均点击出价
export const GetTargetHours = '/user?do=get-targeting-hours&campaign_type='
export const GetPeopleTags = '/user?do=get-targeting-categories&campaign_type='
export const SetPeopleTags = '/user?do=set-targeting-categories'
export const SetTargetHours = '/user?do=set-targeting-hours'
export const GetAdsImg = '/promotion?view_dir='

export const GetUploadKen = '/user?do=get-upload-token'

export const SetUserPhone = '/user?do=verify_telephone_code'
export const GetSmsCode = '/user?do=send-sms-code'
export const SetAgreement = '/user?do=set-agreement'
export const SetPassword = '/user?do=set-password'
export const SetWechatUrl = '/bind?do=wechat'

//export const SetBudget = '/user?do=set-budget'//日限额
//export const SetCPC = '/user?do=set-cpc'//平均点击出价
export const SetBudget = '/user?do=set-budget'//日限额
export const SetCPC = '/user?do=set-cpc'//平均点击出价
export const GetAllLocations = '/user?do=get-locations'//所有地区
export const SetLocations = '/user?do=set-targeting-locations'//设置地区
//获取今日报表
export const GetTodayChart = '/report?do=get-today-campaign-report'
export const GetAllChartData = '/report?do=get-shop-campaign-report'

//店铺所有报表
export const GetUserChartData = '/report?do=get-shop-report'
export const GetUserShopToday = '/report?do=get-today-report' //
export const GetUserShopScore = '/dyncind?do=get-one-day&day=' //各种得分
export const GetPeopleGroup = '/usercats?do=get-cookie-stats' //人群画像
export const GetClickFromSourceSite = '/report?do=get-site-report&sort=pv'    //scheme_type, 1： WEB流量， 2：APP流量， 0或者不带参数：全部
export const GetHourlyCost = '/report?do=get-hourly-cost' //实时数据
export const GetLocationReport = '/report?do=get-location-report' //地域
export const GetRenQiChartReport = '/report?do=get-renqi-report'

export const GetDeviceTypeChart = '/report?do=get-device-type'
export const GetDeviceBrandChart = '/report?do=get-device-brand'

/*推广宝贝*/
export const wordCloud = '/items?do=match-crowds'
export const GetItemsUrl = '/items?do=get-items'
export const GetOnlineItemsUrl = '/items?do=get-online-items'
export const SetItemsOnline = '/items?do=set-items-online'//投放宝贝
export const SetItemsOffline = '/items?do=set-items-offline'//暂停投放宝贝
export const WechatPaySuccess = '/recharge?do=get-wechat-recharge-status&code=' //查询微信充值是否成功
export const GetRechargeUrl = '/recharge?do=get-luckily-plan' //充值
export const OptSetItemsUrl = '/items?do=mod-item'
export const GetRenQiPkgs = '/renqi?do=get-pkgs'
export const AddRenQiTrans = '/renqi?do=add-trans'
export const GetRenQiChartData = '/renqi?do=get-reports&renqi_id='


/*set shop*/
export const GetTrans = '/trans?do=get-trans&skip='//获取自定义推广
export const GetValidSize = '/trans?do=get-size'
export const AddTrans = '/trans?do=add-trans' //增加自定义推广
export const DelTrans = '/trans?do=del-trans' //删除自定义推广
export const EditTrans = '/trans?do=mod-trans' //编辑自定义推广
export const GetTransCat = '/cat?do=get-item-cat&cid=' //获取类目
export const SetTransStatus = '/trans?do=set-trans-status' //设置推广状态

export const WechatPayUrl = '/recharge?do=get-wechat-qrcode&money='
export const AliPayUrl = '/recharge?do=recharge&money='
export const UnipayPayUrl = '/unipay/recharge?do=recharge&money='
export const GetRechargeUserList = '/recharge?do=get-trade-list'

/*报活动*/
//export const GetAllActivityItems = '/buyout/resource?do=get-resources&type=2'
export const JoinActivity = '/buyout/package?do=join'
export const GetAllActivityItems = '/buyout/package?do=get&utm=0&limit=10&type=2&skip=' //所有的活动
export const GetActivityDetail = '/buyout/package?do=get-profile&id=' //获取某个活动详情
export const MyActivityUrl = '/buyout/transaction?do=get&type=2'//我参加的
export const ActivityUpdate = '/buyout/transaction?do=resubmit'

//联合推广
export const GetUnionPkgs = '/buyout/union?do=get-pkgs&utm=0' //0 pc   1  wechat
export const AddUnionTrans = '/buyout/union?do=add-trans&utm=0'
export const GetUnionTrans = '/buyout/union?do=get-trans&utm=0'

/*财务记录*/
export const FinanceSummary = '/finance?do=get-summary'
export const FinanceDetail = '/finance?do=get-trades&limit=25&skip='
export const GiftDetail = '/finance?do=get-luckily&limit=25&skip='

//媒体资源
export const MediaSourceUrl = '/user?do=get-dsp-media&limit=25'

//精选资源
export const GetSelectCreativeCount = '/trans?do=creative-type-stats&creative_types='

//发票相关
export const GetInvoiceAddrs = '/shipping-addrs?do=get-addrs'
export const AddInoiviceAddrs = '/shipping-addrs?do=add-addr'
export const ModInoiviceAddrs = '/shipping-addrs?do=mod-addr'
export const DelInoiviceAddrs = '/shipping-addrs?do=del-addr'
export const SetDefaultInoiviceAddrs = '/shipping-addrs?do=set-default'
export const GetInvoiceTax = '/taxpayers?do=get-taxpayers'
export const AddInvoiceTax = '/taxpayers?do=add-taxpayer'
export const ModInvoiceTax = '/taxpayers?do=mod-taxpayer'
export const DelInvoiceTax = '/taxpayers?do=del-taxpayer'
export const SetDefaultInvoiceTax = '/taxpayers?do=set-default'
export const GetAllInvocie = '/receipts?do=get-receipts&limit=20'
export const GetDefaultReceipt = '/receipts?do=apply-receipt&recept_type='
export const AddInvocieItem = '/receipts?do=add-receipt'

//粉丝通
export const FansCategories = '/fans?do=get-categories'
export const FansMedia = '/fans?do=get-media'
export const FansCreateActivity = '/fans?do=create_activity'
export const FansGetActivity = '/fans?do=get_activities'
export const FansComplaint = '/fans?do=set_complaint'

//文章
export const NewestArticle = '/newest_article'

//积分兑换
export const JiFenGetGifts = '/gifts?do=get-gifts'
export const JiFenExchangeGifts = '/gifts?do=exchange-gift'
export const JiFenGetTrans = '/gifts?do=get-trans'

//推广效果
export const GetEffectReportData = '/report?do=get-tbk-trades'
//注册
export const Registerinfo = '/registerinfo?do=add'
