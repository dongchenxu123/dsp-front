/**
 * Created by CY on 2016/1/20.
 */
import React, {PropTypes} from 'react'
import Link from 'react-router/lib/Link'

import Table from 'antd/lib/table'
import Icon from 'antd/lib/icon'
import Tooltip from 'antd/lib/tooltip'
import Tag from 'antd/lib/tag'

import Styles from './all.css'

const renderItem = (value) => value + ''


const columns = [{
  title: '名称',
  dataIndex: 'name',
  render: renderItem
}, {
  title: '展现量',
  dataIndex: 'pv'
}, {
  title: '点击量',
  dataIndex: 'clicks',
  render: renderItem
}, {
  title: '花费',
  dataIndex: 'cost',
  render (text) {
    return (text / 100) + ''
  }
}, {
  title: '点击率(%)',
  render (value, record) {
    return (record.pv > 0 ? (record.clicks / record.pv * 100) : 0).toFixed(2)
  }
}, {
  title: '点击成本',
  render (value, record) {
    return (record.clicks > 0 ? (record.cost / 100 / record.clicks) : 0).toFixed(2)
  }
}, {
  title: '	千次展现成本(元)',
  render (value, record) {
    return (record.pv > 0 ? (record.cost / 100 / record.pv * 1000) : 0).toFixed(2)
  }
}]

export default class BidExponentn extends React.Component {
  static propTypes = {
    bidExpoData: PropTypes.object.isRequired,
    clickSource: PropTypes.object.isRequired
  };
  render () {
    const rowKey = function (record) {
      return record.refer
    }
    var showdata = this.props.bidExpoData ? this.props.bidExpoData : {}
    var clickdata = this.props.clickSource || []
    const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    return (
      <div className='panel panel-default panel-xb'>
        <div className='panel-heading'>
          <strong>推广指数</strong>
          <span className='pull-right' style={{color: '#999'}}>{ today }</span>
        </div>
        <div className='panel-body'>
          <div className='col-md-2'>
            <div>流量得分指数&nbsp;
              <Tooltip placement='topLeft' title='竞价广告流量的配比情况'>
                <Icon type='question-circle-o'/>
              </Tooltip>
            </div>
            <div className='text-danger margin10'>
              <strong> {showdata.flow_score} </strong>
            </div>
            <div>
              {
                showdata.lt_flow > 50 ? '低于全网 ' + showdata.lt_flow + '% 的商家'
                  : '高于全网 ' + (100 - showdata.lt_flow) + '% 的商家'
              }
            </div>
            <div>7日指数 {showdata.avg_flow_score}</div>
            <Tooltip title={'流量得分是根据点击出价（CPC）和日预算额 综合决定的，因此希望提高流量质量，可以适当的提高单次点击出价（CPC）或提高日预算额'}>
              <Tag>如何优化？</Tag>
            </Tooltip>
          </div>
          <div className='col-md-2'>
            <div>创意得分指数&nbsp;
              <Tooltip placement='topLeft' title='广告点击率直接影响创意得分，越高的创意得分，越能获得更高质量的流量资源'>
                <Icon type='question-circle-o'/>
              </Tooltip>
            </div>
            <div className='text-danger margin10'> <strong> {showdata.ad_score} </strong> </div>
            <div>
              {
                showdata.lt_ad > 50 ? '低于全网 ' + showdata.lt_ad + '% 的商家'
                  : '高于全网 ' + (100 - showdata.lt_ad) + '% 的商家'
              }
            </div>
            <div>7日指数 {showdata.avg_ad_score}</div>
            <Tooltip title={'修改宝贝的推广图片和推广标题，或设置更高的折扣'}>
              <Tag>如何优化？</Tag>
            </Tooltip>
          </div>
          <div className='col-md-2'>
            <div> 竞价成功率指数&nbsp;
              <Tooltip placement='topLeft' title='同一资源位竞价成功的几率'>
                <Icon type='question-circle-o'/>
              </Tooltip>
            </div>
            <div className='text-danger margin10'> <strong> {showdata.bid_score} </strong> </div>
            <div>
              {
                showdata.lt_bid > 50 ? '低于全网 ' + showdata.lt_bid + '% 的商家'
                  : '高于全网 ' + (100 - showdata.lt_bid) + '% 的商家'
              }
            </div>
            <div>7日指数 {showdata.avg_bid_score}</div>
          </div>
          <div className={Styles['clicktable'] + ' col-md-6'} style={{marginTop: '-20px'}}>
            <div>点击来源排名
              <Link to='chart/click' className='pull-right'>查看更多</Link>
            </div>
            {
              clickdata.data && clickdata.data.length > 0
                ? <Table rowKey={rowKey} columns={columns} dataSource={clickdata.data.slice(0, 4)} size='small' pagination={false} />
                : ''
            }
          </div>
        </div>
      </div>
    )
  }
}

export default BidExponentn
