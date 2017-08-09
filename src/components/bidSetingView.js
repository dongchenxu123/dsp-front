/**
 * Created by CY on 2016/1/19.
 */
import React, {PropTypes} from 'react'
import Icon from 'antd/lib/icon'
import Tooltip from 'antd/lib/tooltip'
import Button from 'antd/lib/button'

import Link from 'react-router/lib/Link'
import EditInline from './editInline'
//import LoadingView from './loading'
import { FormateNum } from 'help/formate'

export default class BidSettingView extends React.Component {
  static propTypes = {
    setCpc: PropTypes.func.isRequired,
    setBudget: PropTypes.func.isRequired,
    showPeopleChart: PropTypes.func.isRequired,
    showLoactionSelection: PropTypes.func.isRequired,
    showTimeSelection: PropTypes.func.isRequired
  };
  constructor () {
    super()
    this.state = {
      editcpc: false,
      editbudget: false
    }
  }
  renderCpc () {
    var editMode = this.state.editcpc
    var self = this
    const showdata = this.props.bidSetingData
    return (
        editMode
        ? <EditInline defaultValue={showdata.cpc} blur={self.closeEditCpc.bind(self)} sendvalue={ this.sendcpcValue.bind(this) }/>
        : <div className='text-center'>
            <Button type='primary' onClick={self.editcpc.bind(self)}>修改出价</Button>
          </div>
    )
  }
  editcpc () {
    this.setState({editcpc: true})
  }
  closeEditCpc () {
    var self = this
    setTimeout(function () {
      self.setState({editcpc: false})
    }, 200)
  }
  closeEditBudget () {
    var self = this
    setTimeout(function () {
      self.setState({editbudget: false})
    }, 200)
  }
  sendcpcValue (num) {
    //console.log('cpc', num)
    this.props.setCpc(num)
  }
  editBudget () {
    this.setState({editbudget: true})
  }
  sendBudgetValue (num) {
    this.props.setBudget(num)
  }

  showPeopleGroup () {
    this.props.showPeopleChart()
  }
  renderBudget () {
    var editMode = this.state.editbudget
    var self = this
    const showdata = this.props.bidSetingData
    return (
      editMode
        ? <EditInline blur={self.closeEditBudget.bind(self)} defaultValue={showdata.budget} sendvalue={this.sendBudgetValue.bind(this)}/>
        : <div className='text-center'>
            <Button type='primary' onClick={self.editBudget.bind(self)}>修改日限额</Button>
          </div>
    )
  }
  render () {
    var showdata = this.props.bidSetingData
    return (
      <div className='panel panel-default panel-xb'>
        <div className='panel-heading'>
          <strong>{this.props.title}</strong>
          <Link className='pull-right' to={this.props.url}>操作记录</Link>
        </div>
        <div className='panel-body'>
          <div className='col-md-2 text-center'>
            <div>当前日限额&nbsp;
              <Tooltip placement='top' title={'广告计划每日的最高消耗金额。如果达到限额，系统会自动停止投放，因此适当的提高日限额可以增加广告曝光次数'}>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
            <div className='text-danger margin10'>
              <strong> { FormateNum(showdata.budget) || 0 } 元</strong>
            </div>
            { this.renderBudget() }
          </div>
          <div className='col-md-2 text-center'>
            <div>当前最高点击出价&nbsp;
              <Tooltip placement='top' title={'某时间段，某资源位，不同类目的平均结算价格，提供数据参考，因此适当的调高点击出价可以优先获得优质资源位'}>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
            <div className='text-danger margin10'> <strong> { FormateNum(showdata.cpc) || 0 } 元</strong> </div>
            { this.renderCpc() }
          </div>
          <div className='col-md-2 text-center'>
            <div>投放时段设置&nbsp;
              <Tooltip placement='top' title={'可以根据店铺情况结合流量趋势设置投放时间区间，在暂停期间，您的广告将不再展现，这样做可以节省一部分推广费用，但是这个时间以外的客户在该资源位上就找不到您的宝贝了'}>
                <Icon type='question-circle-o' />
              </Tooltip></div>
            <div className='text-danger margin10' style={{lineHeight: '20px'}}> &nbsp; </div>
            <div><Button type='primary' onClick={() => { this.props.showTimeSelection() }}>修改时间段</Button></div>
          </div>
          <div className='col-md-2 text-center'>
            <div>投放地域设置&nbsp;
              <Tooltip placement='top' title={'修改投放地域设置'}>
                <Icon type='question-circle-o' />
              </Tooltip></div>
            <div className='text-danger margin10' style={{lineHeight: '20px'}}> &nbsp; </div>
            <div><Button type='primary' onClick={() => { this.props.showLoactionSelection() }}>修改地域</Button></div>
          </div>
          <div className='col-md-3 text-center'>
            <div>投放优质人群&nbsp;
              <Tooltip placement='top' title={'您可以自主的选择优质人群标签，对这部分人群做价格调整，达到提升效果的作用'}>
                <Icon type='question-circle-o' />
              </Tooltip>
            </div>
            <div className='text-danger margin10' style={{lineHeight: '20px'}}> &nbsp; </div>
            <div><Button type='primary' onClick={this.showPeopleGroup.bind(this)}>选择人群</Button></div>
          </div>
          {
             /*<div className='col-md-3 text-center'>
              <div>访问人群画像&nbsp;
                <Tooltip placement='top' title={'让您的广告仅仅展示在对您宝贝有潜在需求的人群面前，节省广告成本，提高广告效果'}>
                  <Icon type='question-circle-o' />
                </Tooltip>
              </div>
              <div className='text-danger margin10' style={{lineHeight: '20px'}}> &nbsp; </div>
              <div><Button type='primary' onClick={this.showPeopleGroup.bind(this)}>查看人群画像</Button></div>
            </div>*/
          }
        </div>
      </div>
    )
  }
}

BidSettingView.propTypes = {
  bidSetingData: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  appid: PropTypes.number.isRequired
}

export default BidSettingView
