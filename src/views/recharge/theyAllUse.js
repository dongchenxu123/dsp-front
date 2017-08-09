/**
 * Created by CY on 2016/7/20.
 */
import React from 'react'

var Timer = null
class TheyAllUseView extends React.Component {
  static propTypes = {
    useritems: PropTypes.array.isRequired
  };
  componentDidMount () {
    //const ulist = this.props.recharge.useritems
    /*if (ulist.length === 0) {
     this.props.loadRechargeUserListAction()
     } else {
     this.startTimer()
     }*/
  }
  componentWillUnmount () {
    if (Timer) {
      clearTimeout(Timer)
    }
  }
  startTimer () {
    const self = this
    Timer = setTimeout(function () {
      let start = self.state.startIndex
      self.setState({startIndex: start + 2})
      if (start > self.props.recharge.useritems.length - 18) {
        self.setState({startIndex: 0})
      }
      self.startTimer()
    }, 5000)
  }
  renderUerList () {
    const start = this.state.startIndex
    const data = this.props.recharge.useritems.slice(start, start + 18)
    return (
      <ul className='clearfix'>
        {
          data.map((item, i) => {
            return (
              <li className='col-md-6' key={item.id} style={{padding: '5px 0', lineHeight: '20px', borderBottom: '1px dashed #ddd', float: 'left'}}>
                <div style={{float: 'left', width: '40%'}}>
                  <span style={{width: '40%'}}>{item.nick}</span><br/>
                  <span style={{lineHeight: '16px'}} dangerouslySetInnerHTML={{__html: item.level}}></span>
                </div>
                <div style={{float: 'left', width: '30%', lineHeight: '40px'}}>{item.total_fee} 元</div>
                <div style={{lineHeight: '40px'}}>{item.updated}</div>
              </li>
            )
          })
        }
      </ul>
    )
  }
  render () {
    return (
      <div className='clearfix' style={{display: 'none'}}><br/><br/>
        <h5 className='margin10'>他们都在用</h5>
        <div className='sc-container' style={{padding: '0 15px', border: 'solid 1px #ddd', margin: '0 auto', width: '90%', height: '459px', overflow: 'hidden'}}>
          {
            this.props.recharge.uListFetching
              ? <LoadingView />
              : this.renderUerList()
          }
        </div>
      </div>
    )
  }
}
