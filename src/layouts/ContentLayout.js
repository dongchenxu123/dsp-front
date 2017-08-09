/**
 * Created by CY on 2016/1/19.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'antd/lib/modal'

import PhoneView from './phone'

import SideBarView from 'components/sidebarView'
import { actions as homeActions } from '../redux/home'
import { companySet } from 'help/companySetting'
import { pagedata } from 'help/pagedata'
import SideAdsView from 'components/sideAds'
import ContactWW from 'components/contactWangWang'

//import GuangZhou from './guangZhou'
import ToolBar from './toolbar'

const companyData = companySet[__TARGETAGENCY__]

const AdId = pagedata.sidebar.adid

class ContentLayout extends React.Component {
  renderPhoneView () {
    return (
      <Modal title='免费开通VIP'
             width={552}
             className='nofooterModal'
             visible={ this.props.auth.user.agreement === '0'}
             closable={false}
             footer={[]}
      >
        <PhoneView
          userdata = {this.props.auth.user}
          showModal={ this.props.auth.showAgreeMent }
          setAgreement={this.props.SetAgreementAction}
          sendPhone={this.props.sendPhoneAction}
          GetSmsCode={this.props.GetSmsCodeAction}
        />
      </Modal>
    )
  }
  render () {
    var user = this.props.auth.user
    return (
      <div className='master container-fluid' style={{backgroundColor: '#efefef'}}>
        <div className='row'>
            <div className='col-md-2 col-lg-2 ' style={{backgroundColor: '#fff', position: 'initial'}}>
              <div style={{position: 'relative', zIndex: '2'}}>
                <SideBarView />
                <hr/>
                <div style={{padding: '20px 0'}}>
                  {
                    user.is_xb_agent === true
                    ? <div style={{marginBottom: '10px'}}>
                        <span style={{color: '#666'}}>售后电话：{user.agent_phone}&nbsp;&nbsp;{companyData.phone}</span>
                      </div>
                    : null
                  }
                </div>
                <SideAdsView viewDir={this.props.auth.user.view_dir} adid={AdId}/>
                {
                  __TARGETAGENCY__ === 'xbs' ? <ContactWW wws={companyData.contactWW}/> : null
                }
              </div>
            </div>
            <div className='col-md-10 col-lg-10' style={{position: 'relative', minHeight: window.innerHeight - 158}}>
            <ToolBar />
              {this.props.children}
            </div>
        </div>
        {this.props.auth.user.user_id ? this.renderPhoneView() : null}
      </div>
    )
  }
}

ContentLayout.propTypes = {
  children: PropTypes.element,
  auth: PropTypes.object.isRequired,
  homeRouteAction: PropTypes.func.isRequired,
  sendPhoneAction: PropTypes.func.isRequired,
  updataUrlAction: PropTypes.func.isRequired,
  SetAgreementAction: PropTypes.func.isRequired,
  getDspUserAction: PropTypes.func.isRequired,
  GetSmsCodeAction: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  store: state
})

export default connect(mapStateToProps, homeActions)(ContentLayout)
