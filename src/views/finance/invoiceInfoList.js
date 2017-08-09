/**
 * Created by CY on 2016/7/12.
 */
import React, {PropTypes} from 'react'
import Table from 'antd/lib/table'

import classes from './invoice.css'

const renderContent = (value, row, index) => {
  const regImg = /\/\/img\-ssl\.xibao100\.com/
  let retValue = value
  if (regImg.test(value)) {
    retValue = <img src={value} width='50' height='50' />
  }
  let obj = {
    children: retValue,
    props: {}
  }
  const type = parseInt(row.is_company, 10)
  if (type === 0) {
    obj.props.colSpan = 0
  }
  return obj
}

const columns = [{
  title: '用途',
  dataIndex: 'is_company',
  render (text, record) {
    return parseInt(text, 10) === 0 ? '普通发票' : '增值税发票'
  }
}, {
  title: '发票抬头',
  dataIndex: 'title',
  render (text, record) {
    const type = parseInt(record.is_company, 10)
    if (type === 0) {
      return {
        children: <span>{text}</span>,
        props: {
          colSpan: 9
        }
      }
    }
    return <span>{text}</span>
  }
}, {
  title: '电话',
  dataIndex: 'phone',
  render: renderContent
}, {
  title: '开户许可证',
  dataIndex: 'open_license_pic',
  render: renderContent
}, {
  title: '开户银行',
  dataIndex: 'bank',
  render: renderContent
}, {
  title: '开户银行账号',
  dataIndex: 'bank_account',
  render: renderContent
}, {
  title: '税务登记号',
  dataIndex: 'register_number',
  render: renderContent
}, {
  title: '一般纳税人资格认证',
  dataIndex: 'qualification_pic',
  render: renderContent
}, {
  title: '营业执照',
  dataIndex: 'license_pic',
  render: renderContent
}, {
  title: '税务登记证',
  dataIndex: 'tax_cert_pic',
  render: renderContent
}]

let InvoiceInfoListView = React.createClass({
  propTypes: {
    isFetching: PropTypes.bool.isRequired,
    delInvoice: PropTypes.func,
    setDefault: PropTypes.func,
    modInvoice: PropTypes.func,
    data: PropTypes.array.isRequired
  },
  getInitialState () {
    return {

    }
  },
  delAddr (text, row, index) {
    this.props.delInvoice(row.id)
  },
  modAddr (text, row, index) {
    this.props.modInvoice(row)
  },
  setDefaultAddr (text, row, index) {
    this.props.setDefault(row.id)
  },
  render () {
    const rowkey = function (record) {
      return record.id
    }
    const tableColumns = columns.concat([
      {
        title: '操作',
        width: '20%',
        key: 'optional',
        render: (text, row, index) => {
          return (
            <div>
              <a href='#' onClick={(e) => { e.preventDefault(); this.modAddr(text, row, index) }}>编辑</a>
              &nbsp;|&nbsp;
              <a href='#' onClick={(e) => { e.preventDefault(); this.delAddr(text, row, index) }}>删除</a>
              <a href='#' className={classes.setDefault} onClick={(e) => { e.preventDefault(); this.setDefaultAddr(text, row, index) }} > &nbsp;|&nbsp;设为默认</a>
            </div>
          )
        }
      }
    ])
    const addrsData = this.props.data
    return (
      <div className={classes.addrTable}>
        <div>已经保存了 <span style={{color: 'red'}}>{addrsData.length}</span> 条地址</div>
        <Table rowKey={rowkey} columns={tableColumns} dataSource={addrsData} loading={this.props.isFetching} />
      </div>
    )
  }
})
export default InvoiceInfoListView
