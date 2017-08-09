/**
 * Created by CY on 2016/3/10.
 */
import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'
import Breadcrumb from 'antd/lib/breadcrumb'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'

import { RechargeUrl } from 'help/siteNav'

import {actions as loginactions} from '../../redux/user/userAction'

import BindPhoneView from './bindPhoneView'
import BindWechatView from './bindWechatView'
import SetPassWordView from './changePassword'

const TextItem = ({data, text}) => {
  return (
    <div className='col-md-3'>
      <div className='help-txt'>{text}</div>
      <div>{data}</div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export class UserHomeView extends React.Component {
  constructor () {
    super()
    this.state = {
      showPhone: false,
      showWechat: false,
      showPwdModal: false
    }
  }
  static propTypes = {
    loginAction: PropTypes.func.isRequired,
    GetSmsCodeAction: PropTypes.func.isRequired,
    GetWetChatPicAction: PropTypes.func.isRequired,
    sendPhoneAction: PropTypes.func.isRequired,
    SetUserPasswdAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  componentDidMount () {
    document.title = '用户中心'
    const user = this.props.auth.user
    if (!user.wechat) {
      this.props.GetWetChatPicAction()
    }
  }
  showPhoneModal () {
    this.setState({showPhone: true})
  }
  handlePhoneCancel () {
    this.setState({showPhone: false})
  }
  showWechatModal () {
    console.log(this.state.wechatPic)
    this.setState({showWechat: true})
  }
  showPasswdModal () {
    this.setState({showPwdModal: true})
  }
  hindenPasswdModal () {
    this.setState({showPwdModal: false})
  }
  handleWechatCancel () {
    this.setState({showWechat: false})
  }
  bindPhoneOk (value) {
    const self = this
    this.props.sendPhoneAction(value)
      .then((data) => {
        self.setState({
          showPhone: false
        })
        if (data.msg) {
          Modal.error({
            title: '提示',
            content: data.msg
          })
        }
      })
  }
  renderPhoneView () {
    return (
      <BindPhoneView
        showPhone={this.state.showPhone}
        loading={this.props.auth.setPhoneFetching}
        onCancel={this.handlePhoneCancel.bind(this)}
        getSMSCode={this.props.GetSmsCodeAction}
        sendPhone={this.bindPhoneOk.bind(this)}
      />
    )
  }
  renderWechatModal () {
    return (
      <BindWechatView
        showWechat={this.state.showWechat}
        onCancel={this.handleWechatCancel.bind(this)}
        sendPhone={this.bindPhoneOk.bind(this)}
        wechatPic={this.props.auth.wechatPic}
      />
    )
  }
  renderPasswdView () {
    return (
      <SetPassWordView
        sendValue={this.props.SetUserPasswdAction}
        loading={this.props.auth.setPassFetching}
        onCancel={this.hindenPasswdModal.bind(this)}
        showPwdModal={this.state.showPwdModal}
      />
    )
  }
  render () {
    const auth = this.props.auth
    //const userPoint = auth.user.pointsBalance || (parseInt(auth.user.total_gave_points || 0, 10) - parseInt(auth.user.total_cost_points, 10))
    return (
      <div className=''>
        <div className='margin10'>
          <Breadcrumb>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item >用户中心</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className='panel panel-default panel-xb'>
          <div style={{margin: '20px 0'}}>
            <div style={{width: '105px', height: '105px', borderRadius: '100%', margin: '5px auto', border: 'solid 1px #ddd', overflow: 'hidden'}}>
              <img src={ auth.user && auth.user.avatar} width='100%' />
            </div>
            <div className='text-center' style={{fontSize: '20px'}}>{auth.user && auth.user.nick}</div>
          </div>
          <div className='clearfix' style={{borderTop: 'solid 1px #ddd', borderBottom: 'solid 1px #ddd', padding: '15px 0', minHeight: '150px'}}>
            <div className='col-md-1' style={{color: '#ddd', fontSize: '24px'}}>账户</div>
            <div className='col-md-11'>
              <div className='clearfix margin10'>
                <TextItem text={'登录名'} data={auth.user && auth.user.name}/>
                <div className='col-md-3'>
                  <div className='help-txt'>密码</div>
                  <div><Button onClick={this.showPasswdModal.bind(this)} >设置登录密码</Button></div>
                </div>
                <div className='col-md-3'>
                  <div className='help-txt'>手机号</div>
                  <div>
                    {
                      auth.user && auth.user.telephone ? <Button disabled >已绑定手机号({auth.user.telephone}) </Button> : <Button onClick={this.showPhoneModal.bind(this)}>绑定手机号</Button>
                    }

                  </div>
                </div>
                {
                  __TARGETAGENCY__ === 'xb' || __TARGETAGENCY__ === 'xbs'
                    ? <div className='col-md-3'>
                        <div className='help-txt'>微信号</div>
                        <div>
                          {
                            auth.user && auth.user.wechat ? <Button disabled >已绑定微信</Button> : <Button onClick={this.showWechatModal.bind(this)}>绑定微信</Button>
                          }
                        </div>
                      </div>
                    : null
                }

              </div>
              {/*<div className='clearfix margin10'>
                <div className='col-md-3'>
                  <div className='help-txt'>用户积分</div>
                  <div>{userPoint} &nbsp; <a className='help-txt' style={{display: 'none'}} href='//static.xibao100.com/dsp_assets/bouncePoints.html' target='_blank'>什么是用户积分</a></div>
                </div>
            </div>*/}
            </div>
          </div>
          <div className='clearfix' style={{padding: '15px 0', minHeight: '150px'}}>
            <div className='clearfix'>
              <div className='col-md-1' style={{color: '#ddd', fontSize: '24px'}}>消费</div>
              <div className='col-md-11'>
                <TextItem text={'余额'} data={auth.user && auth.user.balance}/>
                <TextItem text={'总充值'} data={auth.user && auth.user.total_recharge}/>
                <TextItem text={'总消耗'} data={auth.user && auth.user.total_cost}/>
                <TextItem text={'总红包'} data={auth.user && auth.user.total_luckily}/>
              </div>
            </div>
            <div className='text-center margin10'>
              {
                auth.user && auth.user.is_xb_agent === true
                ? null
                : <Link to={RechargeUrl} className='ant-btn ant-btn-primary ant-btn-lg'>
                    充值续费
                  </Link>
              }
            </div>
          </div>
        </div>
        {
          this.renderPhoneView()
        }
        {
          this.state.showWechat ? this.renderWechatModal() : null
        }
        {
          this.renderPasswdView()
        }
      </div>
    )
  }
}

UserHomeView.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, loginactions)(UserHomeView)
