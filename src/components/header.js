/**
 * Created by CY on 2016/1/19.
 */
import React from 'react'
import Link from 'react-router/lib/Link'

function HeaderView () {
  return (
    <div className='col-md-12 bg-danger' >
      <div className='header pull-left'>
        <img src='//www.xibao100.com/img/xb_logo.gif' alt='' />
      </div>
      <div>
        <Link className='pull-right' to={'/logout'}>退出</Link> &nbsp;
        <Link className='pull-right' to={'/setitems/chart'}>联系客服</Link> &nbsp;
        <Link className='pull-right' to={'/setitems/chart'}>如何推广</Link>
      </div>
    </div>
  )
}

export default HeaderView
