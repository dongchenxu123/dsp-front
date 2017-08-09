/**
 * Created by CY on 2016/1/20.
 */
/*import React, { PropTypes } from 'react'
import Breadcrumb from 'antd/lib/breadcrumb'
import { connect } from 'react-redux'
import { actions as loadItemsActions } from '../../redux/setitems/setitemsAction'

import TodayDataView from 'components/todayDataView'
import BidExponentnView from 'components/bidExponentn'

import { setitems_id } from 'help/appid'


var todaydatatmp = {
  cpc: {
    value: 1111,
    yestoday: '30%'
  },
  click: {
    value: 1120,
    yestoday: '25%'
  },
  cost: {
    value: 3000,
    yestoday: '60%'
  },
  pv: {
    value: 30000,
    yestoday: '60%'
  },
  bid: {
    value: 30000,
    yestoday: '60%'
  }
}

const mapStateToProps = (state) => ({
  setitems: state.setitems
})

export class SetItemsChartView extends React.Component {
  static propTypes = {
    loadTodayDataAction: PropTypes.func.isRequired,
    params: PropTypes.Object
  };
  componentDidMount () {
    const appid = this.props.params.appid
    this.props.loadTodayDataAction(appid)
  }
  render () {
    const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    const todaydata = this.props.setitems.todayChart
    return (
      <div className=''>
        <div className='margin10'>
          <Breadcrumb>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item >宝贝推广</Breadcrumb.Item>
            <Breadcrumb.Item>推广概况</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong>今日推广数据</strong>
            <span className='pull-right'>{ today }</span>
          </div>
          <TodayDataView todayData={todaydata}/>
        </div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong>推广指数</strong>
            <span className='pull-right'>{ today }</span>
          </div>
          <BidExponentnView title={'推广指数'} bidExpoData={todaydatatmp} />
        </div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong>推广历史数据</strong>
          </div>
          <div className='panel-subhead'>

          </div>
          <div className='panel-body'>
            <div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, loadItemsActions)(SetItemsChartView)*/
