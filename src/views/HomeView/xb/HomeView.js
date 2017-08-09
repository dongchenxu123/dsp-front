import React, { PropTypes } from 'react'
import Carousel from 'antd/lib/carousel'
import classes from '../HomeView.css'
import Link from 'react-router/lib/Link'
import { SetItemsUrl, ActivityIndexUrl, DaRen } from 'help/siteNav'
import { companySet } from 'help/companySetting'
import { STUrpPrefix } from 'help/siteNav'
import { NewestArticle } from 'help/url'
import axios from 'axios'
import ParterLogo from '../partnerGrid'
import CardItems from '../middleBigCard'
import { connect } from 'react-redux'
import {actions as loginactions} from '../../../redux/user/userAction'
import RegisterView from '../../User/register'

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
    link: DaRen
  }
]

const articleLink = 'http://dsp.xibao100.com/article/'
const ArticleItemTpl = (item, idx) => {
  const titleStyle = {
    padding: '0 8px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    lineHeight: '40px',
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    margin: '0 8px'
  }
  const imgStyle = {
    backgroundImage: 'url(' + item.cover + ')',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '132px',
    backgroundSize: 'cover',
    backgroundPosition: 'center center'
  }
  const imgBoxStyle = {
    border: '1px solid #ececec',
    display: 'block',
    padding: '8px',
    borderRadius: '2px',
    height: '150px',
    overflow: 'hidden',
    position: 'relative',
    margin: '0 8px'
  }
  return (
    <div>
      <a href={articleLink + item.id} target='_blank' style={imgBoxStyle}>
        <div className='custom-image' style={{marginBottom: '8px'}}>
          <div style={imgStyle}></div>
          <h4 style={titleStyle}>{item.title}</h4>
        </div>
        </a>
    </div>
  )
}
export class HomeView extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired
  };
  constructor () {
    super()
    this.state = {
      itemdata: null,
      visible: false
    }
  }
  componentDidMount () {
    axios.get(NewestArticle)
      .then((response) => {
        var data = response.data
        this.setState({
          itemdata: data.res
        })
      })
  }
  renderArticle () {
    const data = this.state.itemdata.slice(0)
    return (
       <Carousel
          autoplaySpeed={5000}
          autoplay
          dots={false}
          slidesToShow={4}
          slidesToScroll={1}
          infinite
        >
           {
             data.map((item, index) => {
               return (ArticleItemTpl(item, index))//<ArticleItemTpl item={item} idx={index} />
             })
           }
     </Carousel>
    )
  }
  showModal () {
    this.setState({
      visible: true
    })
  }
  handleOk () {
    this.setState({
      visible: false
    })
  }
  handleCancel (e) {
    this.setState({
      visible: false
    })
  }
  render () {
    var auth = this.props.auth
    return (
      <div className='home' style={{background: '#fff'}}>
         <div style={{width: '100%', height: '60px', marginBottom: '30px'}}>
            <div className='container'>
                 <div style={{overflow: 'hidden'}}>
                  <img src={STUrpPrefix + __TARGETAGENCY__ + '/logo-small.jpg?v=2016080901'} style={{height: 60, margin: '15px 0px', float: 'left'}}/>
                  <div style={{float: 'right', margin: 36}}>
                    <span onClick={this.showModal.bind(this
                    )} style={{marginRight: '15px', color: '#337ab7', cursor: 'pointer'}}>注册</span>
                    <RegisterView title='注册'
                                  visible={this.state.visible}
                                  onOk={this.handleOk.bind(this)}
                                  onCancel={this.handleCancel.bind(this)}/>
                    <Link to='/login' style={{marginRight: '15px', color: '#337ab7'}}>登陆</Link>
                    { auth.user && auth.user.is_xb_agent === true ? <span>售后电话： {auth.user.agent_phone}&nbsp;&nbsp;</span> : <span>售后电话： {COMPANY.phone}</span>}
                  </div>
                </div>
            </div>
        </div>
        <div style={{marginBottom: '50px', position: 'relative'}}>
              <Carousel className={classes['carouselstyle']} autoplay effect='fade' autoplaySpeed={3000}>
                {bannerData.map((ele, index) => {
                  return (<div className='xbcarouse'><Link to={ele.link} key={ele.id}><img src={STUrpPrefix + (ele.url)} style={{width: '100%', height: 'auto'}} /></Link></div>)
                })}
              </Carousel>
        </div>
        <div style={{overflow: 'hidden', width: '100%'}}>
            <CardItems />
            {this.state.itemdata && this.state.itemdata.length > 0 ? <div className='container' style={{marginBottom: '50px'}}> {this.renderArticle()}</div> : null }
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
