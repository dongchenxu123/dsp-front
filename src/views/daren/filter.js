/**
 * Created by CY on 2016/6/24.
 */
import React, { PropTypes } from 'react'

import Select from 'antd/lib/select'
const Option = Select.Option

class FilterView extends React.Component {
  priceChange (v) {
    this.props.onChange({fprice: parseInt(v, 10)})
  }
  followersChange (v) {
    this.props.onChange({ffollowers: parseInt(v, 10)})
  }
  fgenderChange (v) {
    this.props.onChange({fgender: parseInt(v, 10)})
  }
  service_scopeChange (v) {
    this.props.onChange({service_scope: parseInt(v, 10)})
  }
  render () {
    return (
      <div className='clearfix' style={{backgroundColor: '#fff', borderBottom: 'solid 1px #eee', padding: '8px'}}>
      <div style={{float: 'left', color: '#fb0808'}}>
        直播类型
        <Select value={this.props.default.service_scope + ''} defaultValue={this.props.default.service_scope + ''} style={{width: 120, marginLeft: 8}} onChange={this.service_scopeChange.bind(this)}>
          <Option value='1'>拼场</Option>
          <Option value='2'>专场</Option>
        </Select>
      </div>
        <div style={{float: 'left', color: '#999', marginLeft: '20px'}}>
          价格
          <Select value={this.props.default.fprice + ''} defaultValue={this.props.default.fprice + ''} style={{width: 120, marginLeft: 8}} onChange={this.priceChange.bind(this)}>
            <Option value='-1'>不限</Option>
            <Option value='1'>100元以下</Option>
            <Option value='2'>100-200元</Option>
            <Option value='3'>200-500元</Option>
            <Option value='4'>500-1000元</Option>
            <Option value='5'>1000元以上</Option>
          </Select>
        </div>
        <div style={{float: 'left', color: '#999', marginLeft: '20px'}}>
          关注数
          <Select value={this.props.default.ffollowers + ''} defaultValue={this.props.default.ffollowers + ''} style={{width: 120, marginLeft: 8}} onChange={this.followersChange.bind(this)} >
            <Option value='-1'>不限</Option>
            <Option value='1'>100以下</Option>
            <Option value='2'>100-500</Option>
            <Option value='3' >500-1000</Option>
            <Option value='4'>1000-2000</Option>
            <Option value='5'>2000-3000</Option>
            <Option value='6'>3000-5000</Option>
            <Option value='7'>5000-10000</Option>
            <Option value='8'>10000以上</Option>
          </Select>
        </div>
        <div style={{float: 'left', color: '#999', marginLeft: '20px'}}>
          性别
          <Select value={this.props.default.fgender + ''} defaultValue={this.props.default.fgender + ''} style={{width: 120, marginLeft: 8}} onChange={this.fgenderChange.bind(this)} >
            <Option value='-1'>不限</Option>
            <Option value='1'>男</Option>
            <Option value='2'>女</Option>
          </Select>
        </div>
      </div>
    )
  }
}
FilterView.propTypes = {
  onChange: PropTypes.func,
  default: PropTypes.object
}

export default FilterView
