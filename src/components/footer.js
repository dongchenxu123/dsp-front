/**
 * Created by CY on 2016/1/19.
 */
import React from 'react'

var graylogo = require('../static/img/gray-logo.jpg')

export class FooterView extends React.Component {
  render () {
    return (
      <div className=' text-center'>
        <div className='clearfix text-center'>
          <ul className=''>
            <li className='active'><a href='http://www.xibao100.com/html/about.html' target='_blank'>关于我们 </a></li>
            <li className='split'>|</li>
            <li><a href='http://www.xibao100.com/html/contact.html' target='_blank'>联系我们</a></li>
            <li className='split'>|</li>
            <li><a target='_blank' href='http://weibo.com/xibao100/home'>新浪微博</a></li>
          </ul>
        </div>
        <div className=''>
          Copyright @ 2016 喜宝动力 版权所有 京ICP备14017281号
        </div>
        <div className='pixline'></div>
        <div className=''>
          <img src={graylogo} />
        </div>
      </div>
    )
  }
}

export default FooterView
