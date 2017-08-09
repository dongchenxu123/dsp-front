/**
 * Created by CY on 2016/1/19.
 */
import React, {PropTypes} from 'react'
import Icon from 'antd/lib/icon'
import Tooltip from 'antd/lib/tooltip'
import axios from 'axios'
import { FormateNum } from 'help/formate'
import Link from 'react-router/lib/Link'
import { EffectReportUrl } from 'help/siteNav'
import { connect } from 'react-redux'
import { GetEffectReportData } from 'help/url'
import {actions as loginactions} from '../redux/user/userAction'

const mapStateToProps = (state) => ({
  auth: state.auth
})
export default class TodayDataView extends React.Component {
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
  hideBtn () {
    var show = false
    const auth = this.props.auth
    const total_pay_amount = this.state.reportlistData ? this.state.reportlistData.total_pay_amount : 0
    if (this.state.reportlistData && auth.user.show_effect_report === '1') {
      show = true
    }
    if (show) {
      return (
        <div className='col-md-2'>
              <div>累计推广效果&nbsp;
                <Tooltip placement='topLeft' title={'受平台方和推广媒体限制无法追踪全部效果数据，以下数据仅为部分可确认推广效果，最终效果请参考各平台统计后台。'}>
                  <Icon type='question-circle-o' />
                </Tooltip>
              </div>
            <div className='text-danger margin10'>
              <Link to={EffectReportUrl} style={{color: '#3399CC'}}>
                ￥<strong>{FormateNum(total_pay_amount)}</strong>
              </Link>
            </div>
          </div>
      )
    }
  }
  render () {
    var showdata = this.props.todayData
    const todayData = showdata.today || {}
    const clicks = todayData.clicks || 0
    const cost = todayData.cost || 0.00
    const pv = todayData.impressions || 0
    const cpc = (todayData.clicks > 0 ? (todayData.cost / todayData.clicks) : 0).toFixed(2)


    return (
      <div className='panel panel-default panel-xb'>
        <div className='panel-heading'>
          <strong>今日推广数据</strong>
          {this.props.operate}
        </div>
        <div className='panel-body'>
          <div className='col-md-2'>
            <div>点击单价&nbsp;
              <Tooltip placement='topLeft' title={'点击成本。即创意在资源位上单次点击所要付出的成本'}>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
            <div className='text-danger margin10'>
              <strong> {cpc} </strong>
            </div>

          </div>
          <div className='col-md-2'>
            <div>
              点击量&nbsp;
              <Tooltip placement='topLeft' title={'所有创意在资源位上被买家点击的次数'}>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
            <div className='text-danger margin10'> <strong> {clicks} </strong> </div>
            {/*<div>比昨天 ={showdata.click.yestoday}</div>*/}
          </div>
          <div className='col-md-2'>
            <div>已消耗&nbsp;
              <Tooltip placement='topLeft' title={'所有创意在资源位上被展现/点击 后所产生的费用'}>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
            <div className='text-danger margin10'> <strong> {FormateNum(cost)} </strong> </div>
          </div>
          <div className='col-md-2'>
            <div>展现量&nbsp;
              <Tooltip placement='topLeft' title={'所有创意在资源位上被买家看到的次数'}>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
            <div className='text-danger margin10'> <strong> { FormateNum(pv) } </strong> </div>
          </div>
          {/*<div className='col-md-2'>
            <div>竞价成功率指数&nbsp;
              <Tooltip placement='topLeft' title={'xxxxxxxxxxxxxxxxxxxxxx'}>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
            <div className='text-danger margin10'> <strong> {showdata.bid.value} </strong> </div>
            <div>低于全网{showdata.bid.yestoday}的商家</div>
          </div>*/}
          {
             __TARGETAGENCY__ === 'sx'
             ? null
             : this.hideBtn()
          }
          </div>
      </div>
    )
  }
}
TodayDataView.propTypes = {
  todayData: PropTypes.object.isRequired,
  operate: PropTypes.object,
  auth: PropTypes.object.isRequired
}

export default connect(mapStateToProps, loginactions)(TodayDataView)
