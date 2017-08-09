/**
 * Created by CY on 2016/1/20.
 */
import React from 'react'
import Breadcrumb from 'antd/lib/breadcrumb'
import axios from 'axios'
import Table from 'antd/lib/table'
import Icon from 'antd/lib/icon'
import Alert from 'antd/lib/alert'
import { GetEffectReportData } from '../../help/url'
import { FormateNum } from '../../help/formate'
const columns = [{
  key: 1,
  title: '宝贝名称',
  dataIndex: 'name',
  width: 200,
  render (value, record) {
    return (<a style={{color: '#3399CC'}}
               href= {'https://detail.tmall.com/item.htm?id= ' + record.item_id} target='_blank'>
              {record.item_title}
            </a>)
  }
}, {
  key: 2,
  title: '交易数量',
  dataIndex: 'num',
  width: 200,
  render (value, record) {
    return (<span>{record.item_num}</span>)
  }
}, {
  key: 3,
  title: '交易金额',
  dataIndex: 'money',
  width: 200,
  render (value, record) {
    return (<span>￥ {record.pay_amt}</span>)
  }
}]
export class EffectReportView extends React.Component {
  constructor () {
    super()
    this.state = {
      reportlistData: null
    }
  }
  componentDidMount () {
    var _this = this
    axios.get(GetEffectReportData)
      .then(function (response) {
        _this.setState({
          reportlistData: response.data.res
        })
      })
  }
  render () {
    const rowkey = function (record) {
      return record.item_id
    }
    var _this = this
    var total_item_num = this.state.reportlistData ? this.state.reportlistData.total_item_num : 0
    var total_pay_amount = this.state.reportlistData ? this.state.reportlistData.total_pay_amount : 0
    return (
      <div>
        <div className='margin10'>
          <Breadcrumb>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item > 推广报表 </Breadcrumb.Item>
            <Breadcrumb.Item>推广效果</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong className='margin10'>推广效果报表</strong>
          </div>
              {
                this.state.reportlistData === null
                ? null
                : <div className='panel-body'>
                    <Alert
                      description='受平台方和推广媒体限制无法追踪全部效果数据，以下数据仅为部分可确认推广效果，最终效果请参考各平台统计后台。'
                      type='info'
                      showIcon
                    />
                    <div className='col-md-6'>总成交：&nbsp;<strong style={{fontSize: '20px'}}>{FormateNum(total_item_num)}</strong>&nbsp;笔</div>
                    <div className='col-md-6'>总成交金额：￥<strong style={{fontSize: '20px'}}>{FormateNum(total_pay_amount)}</strong></div>
                  </div>
              }
              {
                _this.state.reportlistData === null
                ? <div className='panel-body'>
                    <div style={{textAlign: 'center'}}>
                      <Icon type='loading'/>
                    </div>
                  </div>
                : <div className='panel-body'>
                    <Table columns={columns} dataSource={this.state.reportlistData.data} rowKey={rowkey} pagination={{ pageSize: 15 }} />
                  </div>
              }
        </div>
      </div>
    )
  }
}
/*SetItemsChartView.propTypes = {
  loadChartAction: PropTypes.func.isRequired,
  setitems: PropTypes.object.isRequired
}*/
export default EffectReportView
