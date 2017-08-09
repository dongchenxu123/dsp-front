/**
 * Created by CY on 2016/6/27.
 */
import React, { PropTypes } from 'react'

import Link from 'react-router/lib/Link'
import Affix from 'antd/lib/affix'
import Button from 'antd/lib/button'

import {DaRenOrder} from 'help/siteNav'

export default class CreactBtn extends React.Component {
  constructor () {
    super()
    this.state = {
      float: false
    }
  }
  onChange (affixed) {
    if (affixed) {
      this.setState({
        float: true
      })
    } else {
      this.setState({
        float: false
      })
    }
  }
  render () {
    let nstyle = {
      padding: '8px 16px',
      backgroundColor: '#fff',
      borderBottom: 'solid 1px #eee'
    }
    if (this.state.float) {
      nstyle = Object.assign({}, nstyle, {boxShadow: '0 6px 12px rgba(175,175,175,.175)', marginTop: 0})
    }
    const selected = this.props.select
    return (
      <Affix onChange={this.onChange.bind(this)}>
        <div style={nstyle}>
          <div className='pull-right'>已选择 {selected.length} 人 &nbsp;
            {
              selected.length > 0 ? <Button type='primary' size='large' onClick={() => this.props.handleCreateModal()}>立即创建推广活动</Button> : <Button type='primary' size='large' disabled>立即创建推广活动</Button>
            }
            &nbsp;&nbsp;
            <Link to={DaRenOrder} className='ant-btn ant-btn-primary ant-btn-lg' style={{backgroundColor: '#33cc66', color: '#fff'}}>管理活动</Link>
          </div>
          <strong> 选择达人 </strong> <span style={{color: '#999', lineHeight: '32px'}}> 挑选您感兴趣的达人后点击“创建推广活动”进行推广</span>
        </div>
      </Affix>
    )
  }
}

CreactBtn.propTypes = {
  select: PropTypes.array,
  handleCreateModal: PropTypes.func
}
