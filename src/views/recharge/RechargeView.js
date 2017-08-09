import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Breadcrumb from 'antd/lib/breadcrumb'
import RechargeContentView from './rechargeContentView'

import { pagedata } from 'help/pagedata'
import SideAdsView from 'components/sideAds'

const AdId = pagedata.recharge.adid

export class RechargeView extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };
  componentDidMount () {
    document.title = '充值续费'
  }
  render () {
    return (
      <div className='' style={{minHeight: window.innerHeight - 158}}>
        <div className='margin10'>
          <Breadcrumb>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item >充值续费</Breadcrumb.Item>
          </Breadcrumb>
        </div>
		<SideAdsView viewDir={this.props.auth.view_dir} adid={AdId}/>
        <RechargeContentView />
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth.user
})
export default connect(mapStateToProps, null)(RechargeView)
