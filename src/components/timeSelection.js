/**
 * Created by CY on 2016/4/27.
 */
import React, {PropTypes} from 'react'

import Button from 'antd/lib/button'

class TimeItem extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    disabled: PropTypes.bool,
    selectHandler: PropTypes.func
  };
  render () {
    const styles = {
      width: '25px',
      height: '25px',
      border: '1px solid #dcdcdc',
      cursor: 'pointer',
      float: 'left',
      background: this.props.data[1] === 1 ? '#dcfacf' : '#fff'
    }
    /*if (this.props.disabled) {
      let disableStyle = {
        border: '1px solid #ddd',
        cursor: 'auto',
        background: '#eee'
      }
      return (
        <div style={ Object.assign({}, styles, disableStyle) }></div>
      )
    }*/
    return (
      <div style={styles} onClick={() => { this.stopPropagation; this.props.selectHandler() }}></div>
    )
  }
}

class TimeRow extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    onRowItemClickHandler: PropTypes.func
  };
  handleClick (i) {
    this.props.onRowItemClickHandler(i)
  }
  render () {
    return (
      <div style={{width: '648px', clear: 'both', overflow: 'hidden', float: 'right'}}>
        {
          this.props.data.map((item, index) => {
            return <TimeItem key={index} data={item} selectHandler={() => { this.handleClick(index) }} />
          })
        }
      </div>
    )
  }
}
const tipTime = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]
export class TimesContainer extends React.Component {
  constructor () {
    super()
  }
  static propTypes = {
    timedata: PropTypes.array,
    option: PropTypes.object
  };
  handleClickItem (dindex, tindex) {
    this.props.option.timeItemClick(dindex, tindex)
  }
  render () {
    return (
      <div>
        <div style={{padding: '0 50px', whiteSpace: 'nowrap'}}>
          {
            tipTime.map((item, index) => {
              return <span key={index} style={{padding: '0 6px', display: 'inline-block', margin: '0 5px'}}> { item }:00</span>
            })
          }
        </div>
        <div style={{width: '715px', height: '200px', 'WebkitUserSelect': 'none'}}>
          {
            this.props.timedata.length > 0
            ? this.props.timedata.map((item, index) => {
              const date = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
              let rowLabel = () => {
                return date[index]
              }
              return (
                <div key={index}>
                  <TimeRow data={item} onRowItemClickHandler={(i) => { this.handleClickItem(index, i) }} />
                  <div style={{lineHeight: '25px'}}>{rowLabel()}</div>
                </div>
              )
            })
              : null
          }
        </div>
        <div >
          <div className='pull-right' style={{lineHeight: '25px'}}>
            <span style={{ marginRight: 5, height: 25, width: 25, display: 'inline-block', background: '#dcfacf', border: '1px solid #eee' }}></span>
            <span style={{ verticalAlign: 'text-bottom' }}>投放时间段</span>
            <span style={{ marginRight: 5, height: 25, width: 25, display: 'inline-block', background: '#fff', border: '1px solid #eee' }}></span>
            <span style={{ verticalAlign: 'text-bottom' }}>暂停时间段</span>
          </div>
          <div>
            快速设定：
            <Button type='primary' onClick={() => { this.props.option.allSelected([0, 1, 2, 3, 4, 5, 6]) }}>全周投放</Button> &nbsp;
            <Button type='primary' onClick={() => { this.props.option.allSelected([1, 2, 3, 4, 5]) }}>周一到周五投放</Button> &nbsp;
            <Button type='primary' onClick={() => { this.props.option.allSelected([0, 6]) }}>周末投放</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default TimesContainer
