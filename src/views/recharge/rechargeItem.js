/**
 * Created by CY on 2016/7/20.
 */
import React, { PropTypes } from 'react'
import InputNumber from 'antd/lib/input-number'
import Badge from 'antd/lib/badge'

import { FormateNum } from 'help/formate'

import classes from './recharge.css'

const replaceTxt = function (txt1, money) {
  if (!txt1) {
    return ''
  }
  return (txt1.replace(/\{money\}/gi, money))
}

class RechargeItem extends React.Component {
  constructor () {
    super()
    this.state = {
      selected: '0',
      inputNum: 20000
    }
  }
  static propTypes = {
    itemdata: PropTypes.object.isRequired,
    clickSelect: PropTypes.func.isRequired,
    luckily_text_1: PropTypes.string.isRequired,
    real_text: PropTypes.string.isRequired,
    styleWidth: PropTypes.number.isRequired,
    selected: PropTypes.string.isRequired,
    customeInputMin: PropTypes.number
  };
  componentWillMount () {
    this.setState({
      selected: this.props.selected
    })
  }
  componentDidMount () {
    var data = this.props.itemdata
    /*this.setState({
     selected: this.props.selected
     })*/
    if (this.props.selected === data.id) {
      this.props.clickSelect(data)
    }
  }
  componentWillReceiveProps (nextProps) {
    /*this.setState({
     selected: nextProps.selected
     })*/
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.selected === this.props.itemdata.id || this.props.selected === this.props.itemdata.id) {
      return true
    }
    return false
  }
  customeInputChange (value) {
    const self = this
    const fee = parseInt(value, 10)
    this.setState({
      inputNum: fee
    })
    this.props.clickSelect({
      id: self.props.itemdata.id,
      total_fee: fee
    })
  }
  handleClick () {
    if (this.props.itemdata.id === 'cus-10000') {
      this.props.clickSelect({
        id: this.props.itemdata.id,
        total_fee: this.state.inputNum
      })
      return
    }
    this.props.clickSelect(this.props.itemdata)
  }
  render () {
    const item = this.props.itemdata
    const real_text = this.props.real_text
    const luckily_text_1 = this.props.luckily_text_1
    const totalMoney = parseFloat(item.total_fee) + parseFloat(item.luckily_money_1) + parseFloat(item.luckily_money_2)
    const selected = this.props.selected
    let activeClass = item.id === selected ? classes.item + ' ' + classes.active : classes.item
    let selectedClass = item.id === selected ? classes.selected : classes.none
    if (item.id === 'cus-10000') {
      return (
        <div className={classes.recharge} data-total={totalMoney} style={{width: this.props.styleWidth + '%', float: 'left'}}>
          <div className={activeClass}
               onClick={this.handleClick.bind(this)}>
            <div className={selectedClass}></div>
            <div className={classes.itemHeader}>
             {__TARGETAGENCY__ === 'sx'
                ? <InputNumber ref='customeInput' style={{width: '80%'}} defaultValue={this.state.inputNum} min={1} onChange={this.customeInputChange.bind(this)} />
                : <InputNumber ref='customeInput' style={{width: '80%'}} defaultValue={this.state.inputNum} onChange={this.customeInputChange.bind(this)} />}
              <span> 元</span>
            </div>
            <div style={{paddingTop: 8}}>
              自定义充值
              {
                this.state.inputNum < this.props.customeInputMin ? <div style={{color: 'red', fontWight: 'bold'}}> 最少充值 {this.props.customeInputMin} </div> : null
              }
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className={classes.recharge} data-total={totalMoney} style={{width: this.props.styleWidth + '%', float: 'left'}}>
        <div className={activeClass}
             onClick={this.handleClick.bind(this)}>
          <div className={selectedClass}></div>
          <div className={classes.itemHeader}>
            {item.discount === '1'
              ? FormateNum(totalMoney)
              : FormateNum(item.total_fee)
            } 元
            {
              item.highlight === '1'
                ? <Badge count={'推荐'} /> : ''
            }
          </div>
          <div style={{paddingTop: 8}}>
            {
              item.discount === '1'
                ? (
                <div>
                  <div><span>{(parseFloat(item.total_fee) / totalMoney * 10).toFixed(1)}</span> 折</div>
                  <div>现仅需<span>{item.total_fee}</span> 元</div>
                </div>
              ) : (
                item.luckily_money_2 !== '0' && item.luckily_money_1 !== '0'
                  ? ''
                  : (totalMoney === item.total_fee ? <div>实得：{FormateNum(totalMoney)} 元</div> : null)
              )
            }
          </div>
          <div>
            {
              item.luckily_money_1 <= '0'
                ? ''
                : <span> { replaceTxt(real_text, item.luckily_money_1)} </span>
            }
            {
              item.luckily_money_2 <= '0'
                ? ''
                : <span> { replaceTxt(luckily_text_1, item.luckily_money_2)} </span>
            }
            <span> { item.luckily_text } </span>
          </div>
        </div>
      </div>
    )
  }
}

export default RechargeItem
