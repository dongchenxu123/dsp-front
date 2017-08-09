/**
 * Created by CY on 2016/4/11.
 */
import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'

import Radio from 'antd/lib/radio'
import Button from 'antd/lib/button'
import message from 'antd/lib/message'
import Table from 'antd/lib/table'
import Modal from 'antd/lib/modal'
import InputNumber from 'antd/lib/input-number'
import {InvoiceAddressUrl, InvoiceInforUrl} from 'help/siteNav'
import {FormateNum} from '../../help/formate'
import { actions as invoiceActions } from '../../redux/invoice/invoiceAction'

const RadioGroup = Radio.Group

const uiStyle = {
  title: {
    color: '#666',
    borderBottom: 'solid 1px #ddd',
    paddingBottom: '5px',
    margin: '10px 0'
  },
  optional: {
    paddingBottom: '5px',
    margin: '10px 0',
    cursor: 'pointer'
  },
  invoicerow: {
    margin: '15px 0'
  }
}

function addrComponent (data = {}) {
  return (
    <div>
      <div style={uiStyle.invoicerow}>联系人：{data.name}</div>
      <div style={uiStyle.invoicerow}>电话：{data.phone}</div>
      <div style={uiStyle.invoicerow}>地址：{data.address}</div>
      <div style={uiStyle.invoicerow}>邮编：{data.zip}</div>
    </div>
  )
}

function inforComponent (type, data) {
  if (type === 0) {
    return (
      <div>
        <div style={uiStyle.invoicerow}>
          发票抬头：{data.title}
        </div>
      </div>
    )
  }
  return (
    <div>
      <div style={uiStyle.invoicerow}>发票抬头：{data.title}</div>
      <div style={uiStyle.invoicerow}>营业电话：{data.phone}</div>
      <div style={uiStyle.invoicerow}>营业地址：{data.address}</div>
      <div style={uiStyle.invoicerow}>开户银行：{data.bank}</div>
      <div style={uiStyle.invoicerow}>开户银行账号：{data.bank_account}</div>
      <div style={uiStyle.invoicerow}>税务登记号：{data.register_number}</div>
    </div>
  )
}

export class AskInvoiceView extends React.Component {
  constructor () {
    super()
    this.state = {
      invoiceType: 0,
      enableAmount: 0,
      showAddrs: false,
      showInfors: false,
      addr: false,
      infor: false
    }
    this.onInvoiceTypeChange = this.onInvoiceTypeChange.bind(this)
    this.addReceipeHandler = this.addReceipeHandler.bind(this)
    this.selectInforBtnHandler = this.selectInforBtnHandler.bind(this)
    this.selectAddrBtnHandler = this.selectAddrBtnHandler.bind(this)
  }
  componentDidMount () {
    document.title = '财务记录-申请发票'
    this.props.loadInvoiceAddrsAction()
    this.props.loadInvoiceTaxAction()
    this.props.getDefaultReceiptAction(0)
  }
  onInvoiceTypeChange (e) {
    this.setState({
      invoiceType: e.target.value,
      addr: false,
      infor: false
    })
    this.props.getDefaultReceiptAction(e.target.value)
  }
  amountOnChange (value) {
    let fvalue = value
    if (value * 100 > this.props.totalMoney) {
      message.error('开票金额小于消耗总额')
      fvalue = 0
    }
    this.setState({
      enableAmount: fvalue * 100
    })
  }
  addReceipeHandler () {
    let obj = {}
    if (!this.props.defaultInfor) {
      message.error('请先添加开票信息')
      return
    }
    if (!this.props.defaultAddr) {
      message.error('请先添加邮寄地址')
      return
    }
    obj.recept_type = this.state.invoiceType
    obj.amount = this.state.enableAmount
    obj.taxpayer_id = this.state.infor ? this.state.infor.id : this.props.defaultInfor.id
    obj.shipping_addr_id = this.state.addr ? this.state.addr.id : this.props.defaultAddr.id
    if (!obj.amount || obj.amount > this.props.totalMoney) {
      message.error('发票金额不能为零并且小于消耗总额')
      return
    }
    if (obj.amount <= 500000 && obj.recept_type === 1) {
      message.error('发票金额小于5000元不能申请增值税发票，只能开具普通发票')
      return
    }

    if (!obj.taxpayer_id) {
      message.error('请选择发票信息')
      return
    }
    if (!obj.shipping_addr_id) {
      message.error('请选择发票地址')
      return
    }
    this.props.addReceiptItemAction(obj).then((data) => {
      if (data.msg) {
        Modal.error({
          title: '错误',
          content: '申请发票失败，请稍后再试'
        })
      } else {
        Modal.success({
          title: '恭喜',
          content: '申请发票成功，到发票列表页查看发票申请进度'
        })
      }
    })
  }
  selectInforBtnHandler () {
    this.setState({
      showInfors: true
    })
  }
  selectAddrBtnHandler () {
    this.setState({
      showAddrs: true
    })
  }
  handleAddrModalCancel () {
    this.setState({
      showAddrs: false,
      addr: false
    })
  }
  handleAddrModalOk () {
    this.setState({
      showAddrs: false
    })
  }
  handleInforModalCancel () {
    this.setState({
      showInfors: false,
      infor: false
    })
  }
  handleInforModalOk () {
    this.setState({
      showInfors: false
    })
  }
  render () {
    const selectBtnStyle = {
      color: '#2db7f5',
      fontSize: '14px',
      fontWeight: 'normal',
      cursor: 'pointer'
    }
    const totalMoney = FormateNum(this.props.totalMoney / 100)
    return (
      <div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-body'>
            <div className='clearfix'>
              <h3 style={uiStyle.title}>发票信息</h3>
            </div>
            <div style={uiStyle.invoicerow}>可开票总额：{totalMoney} 元</div>
            <div style={uiStyle.invoicerow}>开票金额：<InputNumber min={1} defaultValue={parseFloat(totalMoney, 10)} onChange={this.amountOnChange.bind(this)} /></div>
            <div style={uiStyle.invoicerow}>发票类型：
              <RadioGroup onChange={this.onInvoiceTypeChange} defaultValue={this.state.invoiceType}>
                <Radio key='a' value={0}>普通发票</Radio>
                <Radio key='b' value={1}>增值税专用发票</Radio>
              </RadioGroup>
            </div>
            <div className='clearfix'>
              <div className='pull-right' style={uiStyle.optional}>
                <Link to={InvoiceInforUrl}>管理开票信息</Link></div>
              <h3 style={uiStyle.title}>开票信息
                <span style={selectBtnStyle} onClick={this.selectInforBtnHandler}> 选择发票信息</span>
              </h3>
            </div>
            {
              this.renderInfors()
            }
            <div className='clearfix'>
              <div className='pull-right' style={uiStyle.optional}>
                <Link to={InvoiceAddressUrl}>管理邮寄地址</Link>
              </div>
              <h3 style={uiStyle.title}>邮寄地址 <span style={selectBtnStyle} onClick={this.selectAddrBtnHandler}>选择邮寄地址</span></h3>
            </div>
            {this.renderAddrs()}
            <div>
              <Button type='primary' onClick={this.addReceipeHandler}>提交申请</Button>
            </div>
          </div>
          <div style={{color: '#999', fontSize: '12px', padding: '15px'}}>
            •可开票金额：可开票金额为截至上月末的实际消耗金额，本月实际消耗金额可在本月结束后申请，如：4月份，可开票金额只显示截至3月份31号所发生的实际消耗金额。<br/>
            •申请须知：
            <ol>
              <li>1.最高额度仅限实际消耗的充值费用，不包含任何优惠券、赠送金额、体验券等优惠活动费用</li>
              <li>2.您可开1张或多张发票，申请单张发票金额大于或等于5000元可为您免费邮寄</li>
              <li>3.发票金额小于5000元需自付邮费，邮费以快递公司开具单据为准</li>
              <li>4.填写“开票信息”后，会在5个工作日进行审核，对“拒绝”的请及时根据审批意见进行调整，并再次新增提交，以免影响开票进度</li>
              <li>5.审核通过后，不能进行修改，请务必与贵公司财务核实后仔细填写, 如有特殊情况请联系客服</li>
            </ol>
          </div>
        </div>
        {
          this.state.showAddrs ? this.renderSelectAddrModal() : null
        }
        {
          this.state.showInfors ? this.renderSelectInfoModal() : null
        }
      </div>
    )
  }
  renderInfors () {
    if (this.state.infor) {
      return inforComponent(this.state.invoiceType, this.state.infor)
    }
    if (this.props.defaultInfor) {
      return inforComponent(this.state.invoiceType, this.props.defaultInfor)
    }
    return <div className='text-center'>还没有地址点击 <Link className='ant-btn ant-btn-primary' to={InvoiceInforUrl}>去添加发票信息</Link></div>
  }
  renderAddrs () {
    if (this.state.addr) {
      return addrComponent(this.state.addr)
    }
    if (this.props.defaultAddr) {
      return addrComponent(this.props.defaultAddr)
    }
    return <div className='text-center'>还没有地址点击 <Link className='ant-btn ant-btn-primary' to={InvoiceAddressUrl}>去添加地址</Link></div>
  }
  renderSelectAddrModal () {
    const self = this
    const columns = [{
      title: '联系人姓名',
      width: '100',
      dataIndex: 'name'
    }, {
      title: '电话',
      width: '100',
      dataIndex: 'phone'
    }, {
      title: '邮编',
      width: '100',
      dataIndex: 'zip'
    }, {
      title: '邮寄地址',
      width: '350',
      dataIndex: 'address'
    }]
    const rowSelection = {
      type: 'radio',
      onChange (selectedRowKeys, selectedRows) {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      onSelect (record, selected, selectedRows) {
        //console.log(record, selected, selectedRows)
        self.setState({
          addr: record
        })
      }
    }
    return (
      <Modal ref='modal'
             width={650}
             visible={this.state.showAddrs}
             title='选择邮寄地址' onOk={this.handleAddrModalOk.bind(this)} onCancel={this.handleAddrModalCancel.bind(this)}
             footer={[
               <Button key='back' type='ghost' onClick={this.handleAddrModalCancel.bind(this)}>取 消</Button>,
               <Button key='submit' type='primary' onClick={this.handleAddrModalOk.bind(this)}>
                 选 择
               </Button>
             ]}>
          <Table className='custom-small-table' size='small' rowKey={record => record.id} bordered={false} rowSelection={rowSelection} columns={columns} dataSource={this.props.invoice.addrs} pagination={false} />
      </Modal>
    )
  }
  renderSelectInfoModal () {
    const self = this
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
      title: '发票类型',
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
              colSpan: 4
            }
          }
        }
        return <span>{text}</span>
      }
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
    }]
    /*{
     title: '电话',
     dataIndex: 'phone',
     render: renderContent
     }, {
     title: '一般纳税人资格认证',
     dataIndex: 'qualification_pic',
     render: renderContent
     }, {
     title: '营业执照/税务登记证',
     dataIndex: 'license_pic',
     render: renderContent
     }*/
    const rowSelection = {
      type: 'radio',
      getCheckboxProps (record) {
        const type = self.state.invoiceType
        if (type === 1) {
          return {
            disabled: parseInt(record.is_company, 10) !== type
          }
        }
        return {
          disabled: false
        }
      },
      onChange (selectedRowKeys, selectedRows) {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      onSelect (record, selected, selectedRows) {
        //console.log(record, selected, selectedRows)
        self.setState({
          infor: record
        })
      }
    }
    return (
      <Modal ref='modal'
             width={750}
             visible={this.state.showInfors}
             title='选择开票信息' onOk={this.handleInforModalOk.bind(this)} onCancel={this.handleInforModalCancel.bind(this)}
             footer={[
               <Button key='back' type='ghost' onClick={this.handleInforModalCancel.bind(this)}>取 消</Button>,
               <Button key='submit' type='primary' onClick={this.handleInforModalOk.bind(this)}>
                 选 择
               </Button>
             ]}>
          <Table className='custom-small-table' size='small' rowKey={record => record.id} bordered={false} rowSelection={rowSelection} columns={columns} dataSource={this.props.invoice.infors} pagination={false} />
      </Modal>
    )
  }
}
AskInvoiceView.propTypes = {
  loadInvoiceAddrsAction: PropTypes.func.isRequired,
  getDefaultReceiptAction: PropTypes.func.isRequired,
  addReceiptItemAction: PropTypes.func.isRequired,
  loadInvoiceTaxAction: PropTypes.func.isRequired,
  defaultAddr: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  defaultInfor: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  totalMoney: PropTypes.number.isRequired,
  invoice: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
  invoice: state.invoice,
  defaultAddr: state.invoice.defaultAddr,
  defaultInfor: state.invoice.defaultInfor,
  totalMoney: state.invoice.totalMoney
})
export default connect(mapStateToProps, invoiceActions)(AskInvoiceView)
