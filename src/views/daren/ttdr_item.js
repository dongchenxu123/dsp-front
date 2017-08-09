/**
 * Created by CY on 2016/6/27.
 */
import React, { PropTypes } from 'react'
import Popover from 'antd/lib/popover'

import {FormateNum} from 'help/formate'
import Button from 'antd/lib/button'
import classes from './fansBid.css'

class TouTiaoItem extends React.Component {
  shouldComponentUpdate (nextProps) {
    const itemdata = this.props.data
    const nextSelect = nextProps.isSelect
    const thisSelect = this.props.isSelect
    const nextIdx = nextSelect.indexOf(itemdata.id)
    const thisIdx = thisSelect.indexOf(itemdata.id)
    if (thisIdx < 0 && nextIdx >= 0 || thisIdx >= 0 && nextIdx < 0) {
      return true
    } else {
      return false
    }
  }
  render () {
    const itemdata = this.props.data
    const isSelect = this.props.isSelect
    const select = isSelect.indexOf(itemdata.id)
    const content = (
          <span>{itemdata.intro}</span>
      )
    return (
      <div className={classes['itemStyle'] + ' pull-left'} >
        {
          select >= 0 ? <div style={{position: 'absolute', bootom: 0, top: 0, left: 0, bottom: 0, zIndex: 0, right: 0, backgroundColor: '#f3f3ec'}}>&nbsp;</div> : null
        }
        <div style={{zIndex: 2, position: 'relative'}}>
          <div>
            <div style={{float: 'right', lineHeight: '60px', width: 80, textAlign: 'right'}}>
              <Button style={{backgroundColor: '#33cc66', color: '#fff'}} onClick={() => this.props.select(itemdata.id)}>
                {
                  select >= 0
                    ? '取消选择'
                    : '选择'
                }
              </Button>
            </div>
            <div style={{float: 'right', marginLeft: '8px', width: 170, height: 60, overflow: 'hidden', margin: '0 8px'}}>
              <h4 title={itemdata.nick} style={{whiteSpace: 'nowrap', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis'}}>{itemdata.nick}</h4>
              <div style={{fontSize: '12px', paddingTop: 8}}>
                <Popover content={content} title='介绍' trigger='hover'>
                  <span>{itemdata.intro}</span>
                </Popover>
              </div>
            </div>
            <div style={{overflow: 'hidden', width: 60, height: 60}}>
              <img src={itemdata.portrait} style={{borderRadius: '50%', width: 60, height: 60}}/>
            </div>
          </div>
          <div className={classes['inforcount']}>
            <div style={{color: '#999', width: '100%', overflow: 'hidden'}} className='clearfix'>
              <span>关注数</span>
              <span>平均阅读量</span>
              <span>发布价</span>
            </div>
            <div className='clearfix'>
              <span>{FormateNum(itemdata.followers)}</span>
              <span>{FormateNum(itemdata.readers)}</span>
              <span>¥{FormateNum(itemdata.price)}</span>
            </div>
          </div>
          <div className='text-center' style={{overflow: 'hidden', height: 200}}>
            <img style={{maxWidth: 270, maxHeight: 200}} src={itemdata.promo_pic}/>
          </div>
        </div>
      </div>
    )
  }
}

TouTiaoItem.propTypes = {
  data: PropTypes.object,
  isSelect: PropTypes.array,
  select: PropTypes.func
}

export default TouTiaoItem
