/**
 * Created by CY on 2016/6/30.
 */
import React, { PropTypes } from 'react'

import Tag from 'antd/lib/tag'
import Button from 'antd/lib/button'
import Popover from 'antd/lib/popover'
import Icon from 'antd/lib/icon'

import classes from './fansBid.css'

import {FormateNum} from 'help/formate'

const orderStatus = {
  '-2': '已取消',
  '-1': '已拒绝',
  '1': '新增',
  '2': '物料已发送',
  '3': '物料已接收',
  '4': '已排期',
  '5': '已完成',
  '9': '有投诉'
}

const MEDIA = {
  '1': {
    title: '头条达人活动',
    itemName: '推广宝贝'
  },
  '2': {
    title: '淘宝直播活动',
    itemName: '推广链接'
  }
}
function renderStatus (data) {
  const status = data.status
  if (status === '-1') {
    let content = (
      <span>{data.refuse_reason}</span>
    )
    return (
      <span>
        {orderStatus[status]} <Popover content={content} title='拒绝原因' trigger='hover'><Icon type='question-circle-o' /></Popover>
      </span>
    )
  }
  if (status === '9') {
    let content = (
      <span>{data.remarks}</span>
    )
    return (
      <span>
        {orderStatus[status]} <Popover content={content} title='有投诉' trigger='hover'><Icon type='question-circle-o' /></Popover>
      </span>
    )
  }
  return (
    <span>{orderStatus[status]}</span>
  )
}

class ActivityHeader extends React.Component {
  static propTypes = {
    data: PropTypes.object
  };
  renderDataContent () {
    const data = this.props.data
    const conData = data.content
    if (data.media_type === '1') {
      return (
        <div>
          {
            conData.map((item, idx) => {
              return (
                <div key={'pic' + idx } style={{display: 'inline-block', marginLeft: '5px'}}>
                  <a href={item.link} target='_blank'>
                    <img src={item.pic} style={{width: '60px', height: '60px'}}/>
                  </a>
                </div>
              )
            })
          }
        </div>
      )
    }
    return (
      <div>
        {
          conData.map((item, idx) => {
            return (
              <p key={'link' + idx }>
                <a href={item.link} target='_blank'>{item.link}</a>
              </p>
            )
          })
        }
      </div>
    )
  }
  render () {
    const data = this.props.data
    const content = this.renderDataContent()
    return (
      <div style={{borderBottom: 'solid 1px #eee', padding: 8, backgroundColor: data.media_type === '1' ? '#e8f6fb' : '#fbf8e8'}}>
        <table>
          <tbody>
          <tr>
            <td style={{width: '25%'}}>{MEDIA[data.media_type].title}：{data.name}</td>
            <td style={{width: '10%'}}>
              {
                data.service_scope === '2' ? '专场直播' : '拼场直播'
              }
            </td>
            <td style={{width: '15%'}}>{MEDIA[data.media_type].itemName} &nbsp;&nbsp;&nbsp;
              <Popover content={content} title={ MEDIA[data.media_type].itemName} trigger='click'>
                <Button type='primary' size='small'>点击查看</Button>
              </Popover>
            </td>
            <td style={{width: '25%'}}>计划时间 <strong>{data.start_at} - {data.end_at}</strong></td>
            <td style={{width: '10%', display: 'none'}}>状态 <strong>进行中</strong></td>
            <td style={{width: '15%'}}>总消费 <strong>¥ {FormateNum(data.total_price)}</strong></td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

class OrderItemTbtt extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    setComplaint: PropTypes.func
  };
  render () {
    const data = this.props.data
    return (
      <div style={{borderBottom: 'solid 1px #eee', padding: 8}}>
        <table>
          <tbody>
          <tr>
            <td className={classes['fans-order-label']} style={{width: '10%'}}>
              <span>订单号</span>
              {data.orderid}
            </td>
            <td style={{width: '40%'}}>
              <div className='media'>
                <div className='media-left '>
                  <img className='media-object img-circle' src={data.portrait} width='60px' height='60px'/>
                </div>
                <div className='media-body' style={{padding: '10px 0 0 10px'}}>
                  <h4 className='media-heading'>{data.nick}</h4>
                  <div>
                    {data.intro}
                  </div>
                </div>
              </div>
            </td>
            <td className={classes['fans-order-label']} style={{width: '10%'}}>
              <span>消费金额</span>
              {FormateNum(data.price)}
            </td>
            <td className={classes['fans-order-label']} style={{width: '10%'}}>
              <span>订单状态</span>
              {renderStatus(data)}
            </td>
            <td className={classes['fans-order-label']} style={{width: '15%'}}>
              <Tag color='green'>排期： {data.schedule_date}</Tag>
            </td>
            <td className={classes['fans-order-label']} style={{width: '15%'}}>
              <span>完成链接</span>
              {data.link ? <a href={data.link} target='_blank'>点击查看</a> : '-'}
            </td>
            <td style={{width: '10%'}}>
              <div className='ant-btn' onClick={() => this.props.setComplaint(data.orderid)}>投诉</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
class OrderItemTbzb extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    setComplaint: PropTypes.func
  };
  renderAdress () {
    const data = this.props.data
    return (
      <div>
        <p>接收人：{data.receiver} {data.mobile}</p>
        <p>地址：{data.address}</p>
        <p>邮编：{data.postcode}</p>
        <p>由于订单比较多，为了避免商家快递过来的宝贝混淆，<br/>辛苦您快递宝贝的时候，在纸张上备注<span style={{color: '#f52d2d'}}>店铺名称，联系方式</span>一起快递我们！</p>
      </div>
    )
  }
  render () {
    const data = this.props.data
    return (
      <div style={{borderBottom: 'solid 1px #eee', padding: 8}}>
        <table>
          <tbody>
          <tr>
            <td className={classes['fans-order-label']} style={{width: '10%'}}>
              <span>订单号</span>
              {data.orderid}
            </td>
            <td style={{width: '35%'}}>
              <div className='media'>
                <div className='media-left '>
                  <img className='media-object img-circle' src={data.portrait} width='60px' height='60px'/>
                </div>
                <div className='media-body' style={{padding: '10px 0 0 10px'}}>
                  <h4 className='media-heading'>{data.nick}</h4>
                  <div>
                    {data.intro}
                  </div>
                </div>
              </div>
            </td>
            <td className={classes['fans-order-label']} style={{width: '10%'}}>
              <span>消费金额</span>
              {FormateNum(data.price)}
            </td>
            <td className={classes['fans-order-label']} style={{width: '15%'}}>
              <span>订单状态</span>{renderStatus(data)}
            </td><
            td className={classes['fans-order-label']} style={{width: '15%'}}>
              <Tag color='green'>排期： {data.schedule_date}</Tag>
              <Popover content={this.renderAdress()} title='邮寄地址' trigger='click'>
                <Button type='primary' size='small'>查看邮寄地址</Button>
              </Popover>
            </td>
            <td className={classes['fans-order-label']} style={{width: '10%'}}>
              <span>观看人数</span>
              {FormateNum(data.viewers)} 人
            </td>
            <td className={classes['fans-order-label']} style={{width: '10%'}}>
              <span>完成链接</span>
              {data.link ? <a href={data.link} target='_blank'>点击查看</a> : '-'}
            </td>
            <td style={{width: '10%'}}>
              {
                data.status === '5' ? <div className='ant-btn' onClick={() => this.props.setComplaint(data.orderid)}>投诉</div> : null
              }
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

class OrderItem extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    setComplaint: PropTypes.func
  };
  setComplaint (oid) {
    const activity = this.props.data
    this.props.setComplaint({aid: activity.id, oid: oid})
  }
  render () {
    const data = this.props.data
    return (
        <div className={classes['order-box']}>
        <ActivityHeader data={data}/>
          {this.renderBody()}
        </div>
    )
  }
  renderBody () {
    const data = this.props.data
    if (data.media_type === '1') {
      return this.renderTbtt()
    }
    if (data.media_type === '2') {
      return this.renderTbzb()
    }
  }
  renderTbtt () {
    const activity = this.props.data
    const data = activity.item
    return data.map((item) => {
      return <OrderItemTbtt data={item} key={activity.id + '_' + item.orderid} setComplaint={this.setComplaint.bind(this)} />
    })
  }
  renderTbzb () {
    const activity = this.props.data
    const data = activity.item
    return data.map((item) => {
      return <OrderItemTbzb data={item} key={activity.id + '_' + item.orderid} setComplaint={this.setComplaint.bind(this)} />
    })
  }
}

export default OrderItem
