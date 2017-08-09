/**
 * Created by CY on 2016/3/8.
 */
import React, {PropTypes} from 'react'
import DatePicker from 'antd/lib/date-picker'
const RangePicker = DatePicker.RangePicker

const now = Date.now()
const now60 = 60 * 24 * 60 * 60 * 1000
export class DateSelectView extends React.Component {
  constructor () {
    super()
    this.state = {
      startValue: null,
      endValue: null
    }
  }
  componentDidMount () {
  }
  submitHandler () {
    var sendvalue = this.refs.sendEl.value
    this.props.sendvalue(sendvalue)
  }
  onDateChange (value) {
    const appid = this.props.appid
    var value0 = new Date(value[0])
    var value1 = new Date(value[1])
    var from = value0.getFullYear() + '-' + (parseInt(value0.getMonth(), 10) + 1) + '-' + value0.getDate()
    var to = value1.getFullYear() + '-' + (parseInt(value1.getMonth(), 10) + 1) + '-' + value1.getDate()
    this.props.sendvalue({appid, from, to})
  }
  disabledStartDate (startValue) {
    if (!startValue || !this.state.endValue) {
      return false
    }
    let startTime = startValue.getTime()
    let endTime = this.state.endValue.getTime()
    return startTime >= endTime
  }
  disabledEndDate (endValue) {
    if (!endValue || !this.state.startValue) {
      return false
    }
    let bool = true
    let endtime = endValue.getTime()
    let startTime = this.state.startValue.getTime()
    if (endtime <= now && endtime >= startTime && endtime <= startTime + now60) {
      bool = false
    }
    return bool
  }
  onChange (field, value) {
    console.log(field, 'change', value)
    this.setState({
      [field]: value
    })
    console.log(this.state.startValue, this.state.endValue)
  }
  render () {
    return (
      <div className='pull-right'>
        <RangePicker
          style={{ width: 184 }}
          onChange={this.onDateChange.bind(this)} />
      </div>
    )
  }
}
DateSelectView.propTypes = {
  sendvalue: PropTypes.func.isRequired,
  appid: PropTypes.string.isRequired
}
export default DateSelectView

/*
 <DatePicker disabledDate={this.disabledStartDate.bind(this)}
 value={this.state.startValue}
 placeholder='开始日期'
 onChange={this.onChange.bind(this, 'startValue')} />
 <DatePicker disabledDate={this.disabledEndDate.bind(this)}
 value={this.state.endValue}
 placeholder='结束日期'
 onChange={this.onChange.bind(this, 'endValue')} />*/
