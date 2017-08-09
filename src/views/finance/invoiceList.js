/**
 * Created by CY on 2016/4/11.
 */
import React, { PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import { connect } from 'react-redux'

import Table from 'antd/lib/table'
import Popover from 'antd/lib/popover'
import Tooltip from 'antd/lib/tooltip'


import { actions as invoiceActions } from '../../redux/invoice/invoiceAction'

import { AskNewInvoiceUrl } from 'help/siteNav'

const columns = [ {
  title: '申请日期',
  dataIndex: 'updated_at'
}, {
  title: '发票信息',
  dataIndex: 'taxpayer',
  render (obj, record) {
    const content = (
      <div>
        <p>发票抬头: {obj.title}</p>
        {
          record.recept_type === '1'
            ? <div>
              <p>开户银行: {obj.bank}</p>
              <p>开户银行账号: {obj.bank_account}</p>
              <p>营业电话: {obj.phone}</p>
              <p>营业地址: {obj.address}</p>
            </div>
            : null
        }
        <hr/>
        邮寄信息
        <p>联系人： {record.shipping_address.name}</p>
        <p>地址： {record.shipping_address.address}</p>
      </div>
    )
    return (
      <Popover overlay={content} title='发票详情' trigger='hover' placement='right' >
        <span style={{color: '#2db7f5'}}>{obj.title}</span>
      </Popover>
    )
  }
}, {
  title: '发票类型',
  dataIndex: 'recept_type',
  render (text) {
    return text === '0' ? '普通发票' : '增值税发票'
  }
}, {
  title: '金额(元)',
  dataIndex: 'amount',
  render (text) {
    return (parseInt(text, 10) / 100).toFixed(2)
  }
}, {
  title: '状态',
  dataIndex: 'is_shipped',
  render (text, record) {
    //0:未寄出, 1:已寄出, 2: 待审核, 3:审核拒绝
    var obj = {0: '未寄出', 1: '已寄出', 2: '待审核', 3: '审核拒绝'}
    if (text === '3') {
      return (
        <Tooltip title={record.reason}>
          <span style={{color: '#2db7f5'}}>{obj[text]}</span>
        </Tooltip>
      )
    }
    return obj[text]
  }
}, {
  title: '快递信息',
  dataIndex: 'express'
}]
export class InvoiceListView extends React.Component {
  constructor () {
    super()
    this.onPageChange = this.onPageChange.bind(this)
  }
  componentDidMount () {
    document.title = '财务记录-申请发票'
    this.props.getReceiptsAction({page: 1})
  }
  onPageChange (page) {
    console.log(page)
    this.props.getReceiptsAction({page: page})
    //this.props.loadGiftDetailAction({skip: (page - 1) * 25, page: page})
  }
  pageConfig () {
    const total = this.props.invoice.totalPage
    const page = this.props.invoice.page
    return {
      pageSize: 20,
      defaultCurrent: 1,
      current: page,
      total: total,
      onChange: this.onPageChange
    }
  }
  render () {
    const rowkey = function (record) {
      return record.id
    }

    const tdata = this.props.invoice.list
    return (
      <div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <div className='clearfix'>
              <Link to={AskNewInvoiceUrl} className='ant-btn ant-btn-ghost pull-right' >&nbsp; 申请新发票 &nbsp;</Link>
            </div>
          </div>
          <div className='panel-body'>
            <Table rowKey={rowkey} pagination={this.pageConfig()} columns={columns} dataSource={tdata} />
          </div>
        </div>
      </div>
    )
  }
}

export default InvoiceListView
InvoiceListView.propTypes = {
  getReceiptsAction: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
  invoice: state.invoice
})
export default connect(mapStateToProps, invoiceActions)(InvoiceListView)
