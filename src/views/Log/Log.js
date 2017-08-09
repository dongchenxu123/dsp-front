/**
 * Created by CY on 2016/1/20.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Breadcrumb from 'antd/lib/breadcrumb'
import Table from 'antd/lib/table'
import Pagination from 'antd/lib/pagination'
import Tag from 'antd/lib/tag'

import { actions as loadLogActions } from '../../redux/log/logAction'
//import LoadingView from 'components/loading'
import { FormateNum } from 'help/formate'
const columns = [{
  title: '时间',
  dataIndex: 'created'
}, {
  title: '类型',
  dataIndex: 'campaign_type',
  render: (text, record) => {
    let obj = {
      0: '打造爆款',
      1: '聚合页推广',
      2: '推视频',
      3: '无线推广',
      4: '精选资源',
      10000: '报活动'
    }
    return <span>{obj[record.campaign_type]}</span>
  }
}, {
  title: '操作',
  dataIndex: 'typeStr'
}, {
  title: '说明',
  dataIndex: 'typeV',
  render: function (value) {
    if (value.indexOf('&') > 0) {
      return <div>{value.split('&')[0]} <Tag color='red'> {value.split('&')[1]} </Tag></div>
    }
    return <div>{value}</div>
  }
}]

const mapStateToProps = (state) => ({
  log: state.log
})

export class LogView extends React.Component {
  static propTypes = {
    loadLogAction: PropTypes.func.isRequired,
    log: PropTypes.object.isRequired
  };
  componentDidMount () {
    document.title = '操作记录'
    const logdata = this.props.log
    if (!logdata.items[1]) {
      this.props.loadLogAction({page: 1})
    }
  }
  onChange (page) {
    this.props.loadLogAction({page: page})
  }
  renderTable () {
    const rowKey = (record) => record.id
    const page = this.props.log.page
    const logItems = this.props.log.items[page] || []
    const total = this.props.log.totalPage
    for (var i = 0; i < logItems.length; i++) {
      switch (logItems[i].type) {
        case '0':
          logItems[i].typeStr = '设置日限额'
          logItems[i].typeV = '设置日限额为&' + FormateNum((logItems[i].value * 1) / 100)
          break
        case '1':
          logItems[i].typeStr = '设置CPC'
          logItems[i].typeV = '设置CPC为&' + FormateNum((logItems[i].value * 1) / 100)
          break
        case '2':
          logItems[i].typeStr = '上线宝贝'
          logItems[i].typeV = '上线宝贝' + logItems[i].value.split(',').length + '个'
          break
        case '3':
          logItems[i].typeStr = '下线宝贝'
          logItems[i].typeV = '下线宝贝' + logItems[i].value.split(',').length + '个'
          break
        case '4':
          logItems[i].typeStr = '投放时段'
          logItems[i].typeV = '-'
          break
        case '5':
          logItems[i].typeStr = '投放地域'
          logItems[i].typeV = '-'
          break
        case '6':
          logItems[i].typeStr = '人群标签'
          logItems[i].typeV = '-'
          break
        case '7':
          logItems[i].typeStr = '删除宝贝'
          logItems[i].typeV = logItems[i].value
          break
        default:
          logItems[i].typeStr = logItems[i].type
          logItems[i].typeV = '-'
          break
      }
      logItems[i].key = i
    }
    return (
      <div>
        <Table loading={this.props.log.isFetching} rowKey={rowKey} columns={columns} dataSource={logItems} pagination={false} />
        <div style={{padding: '10px 0'}}>
          <Pagination defaultCurrent={1} current={page} total={total} pageSize={25} onChange={this.onChange.bind(this)} />
        </div>
      </div>
      )
  }
  render () {
    return (
      <div className=''>
        <div className='margin10'>
          <Breadcrumb {...this.props} />
        </div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong>操作记录</strong>
          </div>
          <div className='panel-body'>
              {
                this.renderTable()
              }
          </div>
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, loadLogActions)(LogView)
