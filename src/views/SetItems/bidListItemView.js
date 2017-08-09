import React, {PropTypes} from 'react'
import Button from 'antd/lib/button'
import Tag from 'antd/lib/tag'
import { FormateNum } from 'help/formate'
export class BidListItemView extends React.Component {
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
        btngroup.push(<Button type='primary' onClick={() => this.optBid(event)} style={{marginLeft: '10px'}}>优化创意</Button>)
      }
      if (renqi > 0) {
        btngroup.push(<Button type='primary' disabled style={{marginLeft: '10px'}}>暂停投放</Button>)
        btngroup.push(<Button type='primary' onClick={() => this.props.handleRenQiChartModal(itemdata)} style={{marginLeft: '10px'}}>查看人气报表</Button>)
      }
      if (renqi === 0) {
        btngroup.push(<Button type='primary' onClick={() => this.stopbid(event)} style={{marginLeft: '10px'}}>暂停投放</Button>)
        btngroup.push(<Button type='primary' onClick={() => this.props.handleRenQiFormModal(itemdata.id)} style={{marginLeft: '10px'}}>人气升级</Button>)
      }
    } else {
      btngroup.push(<Button type='primary' onClick={() => this.localbidHandler(event)} style={{marginLeft: '10px'}}>投放</Button>)
    }
    return (
      <div>
        {btngroup.map((item, i) => {
          if (i > 1) {
            return (
              <div key={i} style={{marginTop: '5px', display: 'inline-block'}}>{item}</div>
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
    let imgUrl = () => {
      var imgurl = itemdata.pic_url
      if (imgurl.indexOf('xibao100.com') < 0) {
        imgurl = imgurl.replace(/^http:/g, '') + '_80x80.jpg'
      }
      return imgurl
    }
    return (
      <li className='list-group-item' style={{overflow: 'hidden', padding: '8px', borderBottom: '1px solid #e5e5e5'}}>
        <div>
          <div className='itemimg col-md-1'>
              <a style={{background: 'url(' + imgUrl() + ')', height: '60px', backgroundSize: 'contain', opacity: online ? '0.5' : 1, float: 'left', width: 60}} href={itemdata.url} target='_block'></a>
          </div>
          <div className='col-md-4'>
              <div><a href={itemdata.url} target='_block'>{itemdata.title}</a></div>
          </div>
          <div className='iteminfo col-md-2'>
            <div className='normal'>
              {
                pageType === 1
                  ? <div><div>折扣价： ￥{FormateNum(itemdata.discount_price)}</div> <div>原&nbsp;&nbsp;&nbsp;&nbsp;价：￥{FormateNum(itemdata.price)}</div></div>
                  : '原价(￥)： ' + FormateNum(itemdata.price)
              }
            </div>
           </div>
           <div className='col-md-1'>
              {
              online
                ? <Tag color='green'>推广中</Tag>
                : ''
              }
             &nbsp;
             {
               renqiId > 0 && <Tag color='red'>人气升级中</Tag>
             }
           </div>
          <div className='controlsbox col-md-4 '>
              { this.renderBtnGroup() }
          </div>
        </div>
      </li>
    )
  }
}
export default BidListItemView
