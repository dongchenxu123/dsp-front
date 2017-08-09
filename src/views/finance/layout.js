/**
 * Created by CY on 2016/2/24.
 */
import React, { PropTypes } from 'react'
import Breadcrumb from 'antd/lib/breadcrumb'

import Link from 'react-router/lib/Link'
import { FinanceRecordUrl, FinanceGiftUrl, FinanceInvoiceUrl } from 'help/siteNav'

function FinanceLayout ({ children }) {
  return (
    <div className='master' style={{backgroundColor: '#efefef'}}>
      <div className='margin10'>
        <Breadcrumb>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item >财务记录</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='margin10 ant-btn-group'>
        <Link to={FinanceRecordUrl} className='ant-btn ant-btn-ghost' activeStyle={{color: '#fff', backgroundColor: '#2db7f5', borderColor: '#2db7f5'}}>&nbsp; 充值记录 &nbsp;</Link>
        <Link to={FinanceGiftUrl} className='ant-btn ant-btn-ghost' activeStyle={{color: '#fff', backgroundColor: '#2db7f5', borderColor: '#2db7f5'}}>&nbsp; 红包记录 &nbsp;</Link>
        <Link to={FinanceInvoiceUrl} className='ant-btn ant-btn-ghost' activeStyle={{color: '#fff', backgroundColor: '#2db7f5', borderColor: '#2db7f5'}}>&nbsp; 申请发票 &nbsp;</Link>
      </div>
        {children}
    </div>
  )
}

FinanceLayout.propTypes = {
  children: PropTypes.element
}

export default FinanceLayout
