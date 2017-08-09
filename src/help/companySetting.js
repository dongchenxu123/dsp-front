/**
 * Created by CY on 2016/7/25.（400电话原来在xbset里面） 商喜电话：0571 56119192    400 0690170
 */
import React from 'react'
const xbset = {
  wwLink: '//www.taobao.com/webww/ww.php?ver=3&touid=tp_%E5%96%9C%E5%AE%9D%3A%E5%94%AE%E5%90%8E01&siteid=cntaobao&status=1&charset=utf-8',
  wwName: '客服旺旺：tp_喜宝:售后01',
  phone: '400 0690170',
  agreement: '《喜宝DSP软件服务协议》',
  agreementLink: '//static.xibao100.com/dsp_assets/xb_agreement.html'
}

const xbsset = Object.assign({}, xbset, {
  agreement: '《超级推广软件服务协议》',
  agreementLink: '//static.xibao100.com/dsp_assets/xbs_agreement.html',
  contactWW: [
    {
      name: '客户经理',
      id: 'ww001',
      link: () => (
        <a target='_blank' href='//www.taobao.com/webww/ww.php?ver=3&touid=tp_%E5%96%9C%E5%AE%9D%3A%E5%AE%A2%E6%88%B7%E7%BB%8F%E7%90%861&siteid=cntaobao&status=1&charset=utf-8'><img border='0' src='//amos.alicdn.com/online.aw?v=2&uid=tp_%E5%96%9C%E5%AE%9D%3A%E5%AE%A2%E6%88%B7%E7%BB%8F%E7%90%861&site=cntaobao&s=1&charset=utf-8' alt='点这里给我发消息' /></a>
        )
    },
    {
      name: '客户经理',
      id: 'ww002',
      link: () => (
        <a target='_blank' href='//www.taobao.com/webww/ww.php?ver=3&touid=tp_%E5%96%9C%E5%AE%9D%3A%E5%9B%BD%E5%B9%B3&siteid=cntaobao&status=1&charset=utf-8'><img border='0' src='//amos.alicdn.com/online.aw?v=2&uid=tp_%E5%96%9C%E5%AE%9D%3A%E5%AE%A2%E6%88%B7%E7%BB%8F%E7%90%862&site=cntaobao&s=1&charset=utf-8' alt='点这里给我发消息' /></a>
        )
    }
  ]
})

const sxset = {
  wwLink: '//www.taobao.com/webww/ww.php?ver=3&touid=tp_%E5%95%86%E5%96%9C&siteid=cntaobao&status=1&charset=utf-8',
  wwName: '客服旺旺：tp_商喜',
  phone: '0571 5611919',
  agreement: '《广推宝软件服务协议》',
  agreementLink: '//static.xibao100.com/dsp_assets/sx_agreement.html'
}

const mjkset = {
  wwLink: null,
  phone: null,
  agreement: '《流量天下软件服务协议》',
  agreementLink: '//static.xibao100.com/dsp_assets/mjk_agreement.html'
}

export const companySet = {
  xb: xbset,
  xbs: xbsset,
  sx: sxset,
  mjk: mjkset,
  mjkss: mjkset,
  llwy: xbset
}
