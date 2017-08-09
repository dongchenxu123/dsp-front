/**
 * Created by CY on 2016/6/30.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Pagination from 'antd/lib/pagination'
import Spin from 'antd/lib/spin'
import Link from 'react-router/lib/Link'
import { DaRen } from 'help/siteNav'
import {actions} from 'redux/daren/darenActions'
import Affix from 'antd/lib/affix'
import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'

import OrderItemView from './order_item'

const pageSize = 15

class DarenOrders extends React.Component {
  constructor () {
    super()
    this.isMount = false
    this.state = {
      t_id: null,
      tm_id: null,
      showComplaint: false,
      remarks: null,
      modalloading: false
    }
  }
  componentDidMount () {
    this.isMount = true
    this.props.getFansActivity({page: 1}).catch(() => {

    })
  }
  componentWillUnmount () {
    this.isMount = false
  }
  pageOnChange (page) {
    this.props.getFansActivity({page: page})
  }
  handleSubmit () {
    const self = this
    if (this.state.remarks.length > 50) {
      return
    }
    self.setState({
      modalloading: true
    })
    this.props.sendFansRemarks(self.state).then((data) => {
      if (self.isMount) {
        if (data.msg) {
          return
        }
        self.setState({
          showComplaint: false
        })
      }
    })
  }
  setComplaint (obj) {
    this.setState({
      t_id: obj.aid,
      tm_id: obj.oid,
      showComplaint: true
    })
  }
  onClose () {
    const old = this.state.showComplaint
    this.setState({
      showComplaint: !old
    })
  }
  handleInputChange (e) {
    const refuse = e.target.value
    if (refuse.length > 50) {
      alert('文字输入超过限制')
    }
    this.setState({
      remarks: e.target.value
    })
  }
  render () {
    const orders = this.props.daren.order
    const activityData = orders.data
    return (
      <Spin spinning={orders.loading} tip='正在加载...'>
        <div style={{backgroundColor: '#efefef'}}>
          <Affix>
            <div style={{backgroundColor: '#fff', padding: '8px 16px', textAlign: 'right', borderBottom: 'solid 1px #eee'}}>
              <Link to={DaRen} className='ant-btn ant-btn-primary ant-btn-lg'>创建推广活动</Link>
            </div>
          </Affix>
          <div>
            {
              activityData.map((item, idx) => {
                return <OrderItemView key={item.id} data={item} setComplaint={this.setComplaint.bind(this)}/>
              })
            }
            {
              orders.total < pageSize
                ? null
                : <div style={{padding: '8px 16px', backgroundColor: '#fff'}}>
                <Pagination current={orders.page} total={orders.total} onChange={this.pageOnChange.bind(this)} pageSize={pageSize}/>
              </div>
            }
          </div>
        </div>
        <Modal
          width={600}
          maskClosable={false}
          onOk={this.handleSubmit.bind(this)}
          onCancel={() => this.onClose()}
          title='填写反馈意见'
          visible={this.state.showComplaint}
          confirmLoading={this.state.modalloading}
        >
          <div>
            <p>填写反馈意见</p>
            <Input ref='fankuiyijian' type='textarea' rows={4} maxlength='2' onChange={this.handleInputChange.bind(this)} />
            <span>请输入50字以内的建议</span>
          </div>
        </Modal>
        </Spin>
    )
  }
}


DarenOrders.propTypes = {
  getFansActivity: PropTypes.func,
  sendFansRemarks: PropTypes.func,
  daren: PropTypes.object
}
/*DarenOrders.contextTypes = {
  router: PropTypes.object
}*/
const mapStateToProps = (state) => ({
  daren: state.daren
})

export default connect(mapStateToProps, actions)(DarenOrders)
