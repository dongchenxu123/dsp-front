import React, { PropTypes } from 'react'
import Carousel from 'antd/lib/carousel'
import classes from './HomeView.css'
import Link from 'react-router/lib/Link'
import { SetItemsUrl, ActivityIndexUrl } from 'help/siteNav'
import { companySet } from 'help/companySetting'
import { STUrpPrefix } from 'help/siteNav'
import ParterLogo from './partnerGrid'
import CardItems from './middleBigCard'
import { connect } from 'react-redux'
import {actions as loginactions} from '../../redux/user/userAction'
const mapStateToProps = (state) => ({
  auth: state.auth
})

const COMPANY = companySet[__TARGETAGENCY__]
const bannerData = [
  {
    id: 1,
    url: 'share/xb_banner1.jpg',
    link: SetItemsUrl
  },
  {
    id: 2,
    url: 'share/xb_banner2.jpg',
    link: ActivityIndexUrl
  },
  {
    id: 3,
    url: 'share/xb_banner3.jpg',
    link: null
  }
]
export class HomeView extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };
  componentDidMount () {
    document.title = __SITE_TITLE__
  }
  render () {
    var auth = this.props.auth
    return (
      <div style={{background: '#fff'}}>
         <div style={{width: '100%', height: '60px', marginBottom: '30px'}}>
            <div className='container'>
                 <div style={{overflow: 'hidden'}}>
                  <img src={STUrpPrefix + __TARGETAGENCY__ + '/logo-small.jpg?v=2016080901'} style={{height: 60, margin: '15px 0px', float: 'left'}}/>
                  <div style={{float: 'right', margin: 36}}>
                    { auth.user && auth.user.is_xb_agent === true ? <span>售后电话：{auth.user.agent_phone}&nbsp;&nbsp;{COMPANY.phone}</span> : null}
                  </div>
                </div>
            </div>
        </div>
        <div style={{marginBottom: '50px'}}>
              <Carousel className={classes['carouselstyle']} autoplay effect='fade' autoplaySpeed={3000}>
                {bannerData.map((ele, index) => {
                  if (!ele.link) {
                    return (<div className='xbcarouse'><img key={ele.id} src={STUrpPrefix + (ele.url)} style={{width: '100%', height: 'auto'}} /></div>)
                  }
                  return (<div className='xbcarouse'><Link to={ele.link} key={ele.id}><img src={STUrpPrefix + (ele.url)} style={{width: '100%', height: 'auto'}} /></Link></div>)
                })}
              </Carousel>
        </div>
        <div style={{overflow: 'hidden', width: '100%'}}>
            <CardItems />
            <div className='container' style={{marginBottom: '30px'}}>
              <div className='col-md-4' style={{height: 1, background: '#ededed'}}></div>
              <div className='col-md-4' style={{textAlign: 'center', color: '#c5c4c4', fontSize: '20px', marginTop: '-16px'}}><span>合作伙伴</span> &nbsp;&nbsp; & &nbsp;&nbsp;<span>合作客户</span></div>
              <div className='col-md-4' style={{height: 1, background: '#ededed'}}></div>
            </div>
            <ParterLogo />
          </div>
       </div>
      )
  }
}
export default connect(mapStateToProps, loginactions)(HomeView)
