/**
 * Created by CY on 2016/1/19.
 */
import React, {PropTypes} from 'react'
import Button from 'antd/lib/button'

import { FormateNum } from 'help/formate'

export class BidItemView extends React.Component {
  static propTypes = {
    itemdata: PropTypes.object.isRequired,
    pageType: PropTypes.number.isRequired,
    bidHandler: PropTypes.func.isRequired,
    stopBidHandler: PropTypes.func.isRequired,
    optCreate: PropTypes.func.isRequired,
    handleRenQiFormModal: PropTypes.func,
    handleRenQiChartModal: PropTypes.func
  };
  localbidHandler (event) {
    event.stopPropagation()
    this.props.bidHandler(this.props.itemdata)
  }
  stopbid (event) {
    event.stopPropagation()
    this.props.stopBidHandler(this.props.itemdata)
  }
  optBid (event) {
    event.stopPropagation()
    this.props.optCreate(this.props.itemdata)
  }
  renderBtnGroup () {
    const itemdata = this.props.itemdata
    let btngroup = []

    if (itemdata.online) {
      let renqi = parseInt(itemdata.renqi_id, 10)
      if (this.props.pageType === 1) {
        btngroup.push(<Button type='primary' onClick={() => this.optBid(event)}>优化创意</Button>)
      }
      if (renqi > 0) {
        btngroup.push(<Button type='primary' disabled >暂停投放</Button>)
        btngroup.push(<Button type='primary' onClick={() => this.props.handleRenQiChartModal(itemdata)}>查看人气报表</Button>)
      }
      if (renqi === 0) {
        btngroup.push(<Button type='primary' onClick={() => this.stopbid(event)}>暂停投放</Button>)
        btngroup.push(<Button type='primary' onClick={() => this.props.handleRenQiFormModal(itemdata.id)}>人气升级</Button>)
      }
    } else {
      btngroup.push(<Button type='primary' onClick={() => this.localbidHandler(event)}>投放</Button>)
    }
    return (
      <div>
        {btngroup.map((item, i) => {
          if (i > 1) {
            return (
              <div key={i} style={{marginTop: '5px'}}>{item}</div>
            )
          }
          return <span key={i}>{item}</span>
        })}
      </div>
    )
  }
  render () {
    const online = this.props.itemdata.online
    const renqiId = parseInt(this.props.itemdata.renqi_id, 10)
    const itemdata = this.props.itemdata
    const pageType = this.props.pageType
    const onlineStyle = {
      backgroundImage: 'url("//xbcdn-ssl.xibao100.com/media/img/dsp/site/onlineing.png")',
      height: '70px',
      width: '70px',
      right: 0,
      zIndex: '11',
      position: 'absolute'
    }
    const renqistyle = {
      backgroundImage: 'url("//xbcdn-ssl.xibao100.com/media/img/dsp/site/dsp_n/renqishengji.png?i=0")',
      height: '44px',
      width: '59px',
      left: 0,
      zIndex: 11,
      position: 'absolute'
    }
    let imgUrl = () => {
      var imgurl = itemdata.pic_url
      if (imgurl.indexOf('xibao100.com') < 0) {
        imgurl = imgurl.replace(/^http:/g, '') + '_300x300.jpg'
      }
      return imgurl
    }
    return (
      <div className='biditem' style={{border: online ? 'solid 1px #AA0000' : ''}}>
        <a href='javascript:void(0)'>
          {
            renqiId > 0 && <div style={renqistyle}></div>
          }
          {
            online
              ? <div style={onlineStyle}></div>
              : ''
          }
          <div className='itemimg'
               style={{background: 'url(' + imgUrl() + ')', height: '100%', backgroundSize: 'contain', opacity: online ? '0.5' : 1}}
          >
          </div>
          <div className='iteminfo'>
            <div className='normal'>
              {
                pageType === 1
                  ? <div>折扣价(￥)： {FormateNum(itemdata.discount_price)} <span style={{marginLeft: '10px'}}>原价(￥)：{FormateNum(itemdata.price)} </span> </div>
                  : '原价(￥)： ' + FormateNum(itemdata.price)
              }
            </div>
            <div >{itemdata.title}</div>
          </div>
          <div className='controlsbox'>
            <div className='btn-group'>
              { this.renderBtnGroup() }
            </div>
          </div>
        </a>
      </div>
    )
  }
}

export default BidItemView
