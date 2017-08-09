/**
 * Created by CY on 2016/1/19.
 */
import React, { PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import { connect } from 'react-redux'
import Menu from 'antd/lib/menu'
import Button from 'antd/lib/button'
const SubMenu = Menu.SubMenu
import Styles from './all.css'
import { nav_menu, siteNav, STUrpPrefix, SetItemsUrl, RechargeUrl, FinanceChargeUrl, NavUserCenter } from 'help/siteNav'
import XbsRechargeView from './xbsRechargeDialog'
export class SidebarView extends React.Component {
  constructor () {
    super()
    this.state = {
      selectedKeys: [SetItemsUrl],
      showXbsRecharge: false
    }
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    route: PropTypes.any
  };
  showxbsModal () {
    this.setState({
      showXbsRecharge: true
    })
  }
  handleOk () {
    this.setState({
      showXbsRecharge: false
    })
  }
  handleCancel () {
    this.setState({
      showXbsRecharge: false
    })
  }
  componentWillMount () {
    var key = this.props.route.location.pathname
    this.setState({selectedKeys: ['/' + key]})
  }
  render () {
    const user = this.props.auth.user
    const menudata = nav_menu[__TARGETAGENCY__] || siteNav.simpleMenu
    //const userPoint = user.pointsBalance || (parseInt(user.total_gave_points || 0, 10) - parseInt(user.total_cost_points, 10))
    return (
      <div className='sidebar'>
        <div style={{margin: '20px 0'}}>
          {
            __TARGETAGENCY__ === 'xbs'
            ? null
            : <Link to='/' className={Styles['logobox']}>
              {
                __TARGETAGENCY__ === 'wpt'
                ? <span style={{fontSize: '36px', color: '#1170BC'}}>旺铺通</span>
                : <img src={STUrpPrefix + __TARGETAGENCY__ + '/logo-big.jpg?v=2016080901'}/>
              }
            </Link>
          }
        </div>
        <div style={{ borderBottom: 'solid 1px #ddd', padding: '15px 0' }}>
          <div className='media'>
            <div className='media-left '>
              <img className='media-object img-circle' src={user.avatar} width='32px'/>
            </div>
            <div className='media-body' style={{padding: '10px 0 0 10px'}}>
              <h4 className='media-heading'>{user.nick}</h4>
              <p>账户余额：<span className='text-danger'>{user.balance}</span>元</p>
              {/*<p>用户积分：{userPoint}</p>*/}
            </div>
          </div>
          <div className='text-center' style={{margin: '20px 0 10px 0'}}>
            {
              user && user.is_xb_agent === true || __TARGETAGENCY__ === 'wpt'
              ? null
              : __TARGETAGENCY__ === 'xbs'
               ? <Button type='primary' size='large' onClick={this.showxbsModal.bind(this)}>
                  充值续费
                </Button>
               : <Link to={RechargeUrl} className='ant-btn ant-btn-primary ant-btn-lg'>
                  充值续费
                </Link>
            }
            &nbsp;
            { __TARGETAGENCY__ === 'xbs'
              ? <Link to={FinanceChargeUrl} className='ant-btn ant-btn-primary ant-btn-lg'>账户中心</Link>
              : <Link to={NavUserCenter} className='ant-btn ant-btn-primary ant-btn-lg'>用户中心</Link>
            }
          </div>
        </div>
        <div style={{margin: '0 -15px'}}>
          { __TARGETAGENCY__ === 'xbs'
            ? null
            : <Menu
            theme={'light'}
            defaultOpenKeys={['dsp']}
            selectedKeys={this.state.selectedKeys}
            mode='inline'
          >
            {
              menudata.map((item) => {
                const links = item.links
                if (links) {
                  return (
                  <SubMenu key={item.key} title={<span><i className='dspiconfont icon-target'></i><span style={{marginLeft: 8}}>{item.text}</span></span>}>
                    {
                      links.map((item) => {
                        let isActive = this.context.router.isActive({pathname: item.link})
                        return (
                          <Menu.Item key={item.key} className={ isActive ? 'ant-menu-item-selected menuitem' : 'menuitem' } >
                            <Link to={item.link}> {item.text} </Link>
                          </Menu.Item>
                        )
                      })
                    }
                  </SubMenu>
                )
                }
                const isActive = this.context.router.isActive({pathname: item.link})
                return (
                  <Menu.Item key={item.key} className={ isActive ? 'ant-menu-item-selected menuitem' : 'menuitem' } >
                    <Link to={item.link}>
                      {
                        item.icon ? <i className={'dspiconfont ' + item.icon} /> : null
                      }
                      <span style={{marginLeft: 8}}>{item.text}</span>
                    </Link>
                  </Menu.Item>
                )
              })
            }
          </Menu>
          }
          <XbsRechargeView showXbsRecharge={this.state.showXbsRecharge} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}/>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  route: state.router
})
SidebarView.propTypes = {
  auth: PropTypes.object.isRequired
}
SidebarView.contextTypes = {
  router: PropTypes.object
}

export default SidebarView
export default connect(mapStateToProps)(SidebarView)
