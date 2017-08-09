import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Modal from 'antd/lib/modal'
import Tag from 'antd/lib/tag'

import { WechatPayUrl, WechatPaySuccess, UnipayPayUrl, AliPayUrl } from 'help/url'
import LoadingView from 'components/loading'

import { actions as loadRechargeAction } from 'redux/recharge/recharge'
import RechargeItem from './rechargeItem'
import classes from './recharge.css'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

const mapStateToProps = (state) => ({
  recharge: state.recharge
})

const customeInput = {
  id: 'cus-10000'
}
const customeInputMin = 3000
//let startIndex = 0
export class RechargeContentView extends React.Component {
  static propTypes = {
    loadRechargeAction: PropTypes.func.isRequired,
    loadRechargeUserListAction: PropTypes.func.isRequired
  };
  constructor () {
    super()
    this.state = {
      rechargData: false,
      selectMoney: 0,
      selected: '0',
      isWechat: false,
      wechatCodeUrl: '',
      wechatCode: '',
      startIndex: 0
    }
  }
  componentDidMount () {
    var rdata = this.props.recharge.items
    if (!rdata.moneys) {
      this.props.loadRechargeAction()
    }
    if (rdata.selected) {
      this.setState({
        selected: rdata.selected
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.recharge.items && nextProps.recharge.items.moneys) {
      nextProps.recharge.items.moneys.push(customeInput)
      this.setState({
        rechargData: nextProps.recharge.items
      })
    }
  }
  handleSelect (item) {
    this.setState({
      selectMoney: item.total_fee,
      selected: item.id
    })
  }
  checkWchatSuccess () {
    const self = this
    if (!this.state.isWechat) { return }
    axios.get(WechatPaySuccess + self.state.wechatCode)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {

        } else {
          if (data.res.status === 1) {
            self.setState({
              isWechat: false
            })
          }
        }
      })
      .then(function () {
        setTimeout(function () {
          self.checkWchatSuccess()
        }, 1000)
      }).catch(err => console.log(err))
  }
  weChatPayHandler (e) {
    e.preventDefault()
    const self = this
    this.setState({isWechat: true})
    axios.get(WechatPayUrl + self.state.selectMoney)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        if (data.msg) {

        } else {
          self.setState({
            wechatCodeUrl: data.res.img_url,
            wechatCode: data.res.code
          })
        }
      })
      .then(function () {
        setTimeout(function () {
          self.checkWchatSuccess()
        }, 1000)
      })
      .catch(err => console.log(err))
  }
  handleCancelWechatDia () {
    this.setState({isWechat: false})
  }
  renderZhifuBtn () {
    const id = this.state.selected
    const chargeMoney = this.state.selectMoney

    if (__TARGETAGENCY__ === 'sx' || __TARGETAGENCY__ === 'mjk' || __TARGETAGENCY__ === 'mjkss') {
      return (
        <div className={classes.recharge + ' clearfix'}>
          <h5 style={{margin: '15px 0'}}>选择支付方式：<span style={{color: '#f23c0b'}}>充值 {chargeMoney}</span> 元</h5>
          <a target='_blank' className={ classes.pay + ' ' + classes.ali } href={AliPayUrl + chargeMoney}></a>
        </div>
      )
    }
    let canNotCharge = id === 'cus-10000' && chargeMoney < customeInputMin
    return (
      <div className={classes.recharge + ' clearfix'}>
        <h5 style={{margin: '15px 0'}}>选择支付方式：<span style={{color: '#f23c0b'}}>充值 {chargeMoney}</span> 元</h5>
        <a target='_blank' className={ classes.pay + ' ' + classes.ali } href={canNotCharge ? null : (AliPayUrl + chargeMoney)}></a>
        <a target='_blank' className={ classes.pay + ' ' + classes.unipay } href={ canNotCharge ? null : (UnipayPayUrl + chargeMoney) }></a>
        <a target='_blank' onClick={canNotCharge ? null : this.weChatPayHandler.bind(this)} className={ classes.pay + ' ' + classes.wechat } href={canNotCharge ? null : (WechatPayUrl + chargeMoney) }></a>
      </div>
    )
  }
  render () {
    const self = this
    const rechargData = this.props.recharge.items
    return (
      <div className=''>
        <div className='clearfix' style={{backgroundColor: '#fff', padding: '15px'}}>
          <div style={{margin: '5px 0'}}>
            <h3>充值 <span style={{fontSize: '12px'}}>（支持支付方式：支付宝、银联、微信）</span></h3>
          </div>
          <div className='clearfix'>
          {this.props.recharge.isFetching
            ? <LoadingView />
            : rechargData.moneys && rechargData.moneys.map((item) => {
              return (
                  <RechargeItem
                    clickSelect={self.handleSelect.bind(self)}
                    selected = {self.state.selected === '0' ? rechargData.selected : self.state.selected}
                    itemdata={item} key={item.id}
                    real_text={rechargData.real_text}
                    luckily_text_1={rechargData.luckily_text_1}
                    styleWidth={(1 / (rechargData.moneys.length)) * 100}
                    customeInputMin={customeInputMin}
                  />
                )
            })
          }
          </div>
          {this.props.recharge.isFetching
            ? null
            : this.renderZhifuBtn()
          }
          {
            this.props.recharge.isFetching
            ? '' : () => {
              if (!rechargData.tips) { return '' }
              return (
                <div className='margin10'>{rechargData.tips}</div>
              )
            }
          }

        </div>
        <Modal title='微信支付' visible={this.state.isWechat}
               width={900}
               onOk={this.handleOk} onCancel={this.handleCancelWechatDia.bind(self)}>
          <div className='clearfix'>
            <div className='col-md-6 text-center' style={{paddingTop: '60px'}}>
              {
                this.state.wechatCodeUrl.length === 0 ? ''
                  : <img src={this.state.wechatCodeUrl} style={{border: 'solid 1px #ddd', width: '250px', height: '250px'}}/>

              }
              <div style={{margin: '10px'}}>
                <Tag color='blue'>请使用微信扫一扫,扫描二维码支付</Tag>
              </div>
            </div>
            <div className='col-md-6'><img src='//static-ssl.xibao100.com/media/img/dsp/site/xb/wechat-pay-bg.png'/> </div>
          </div>
        </Modal>
      </div>
    )
  }
}
RechargeContentView.propTypes = {
  recharge: PropTypes.object.isRequired
}
export default connect(mapStateToProps, loadRechargeAction)(RechargeContentView)
