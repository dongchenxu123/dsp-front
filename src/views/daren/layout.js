/**
 * Created by CY on 2016/6/24.
 */
import React, { PropTypes } from 'react'
import { routeActions } from 'react-router-redux'
import { connect } from 'react-redux'

import Breadcrumb from 'antd/lib/breadcrumb'

import { DaRen, DaRenTbzb, DaRenTbtt, DaRenOrder } from 'help/siteNav'

import { mediaTypeChange } from 'redux/daren/darenActions'

import { pagedata } from 'help/pagedata'

class Layout extends React.Component {
  componentDidMount () {
    document.title = '找网红'
  }
  changeType (type) {
    const media = pagedata.daren.medias[type]
    const url = media.url
    const m_type = media.m_type
    this.props.dispatch(routeActions.push(url))
    this.props.dispatch(mediaTypeChange(m_type))
  }
  render () {
    const medias = pagedata.daren.medias
    let activeToutiao = this.context.router.isActive(DaRenTbtt)
    let activeTaobao = this.context.router.isActive(DaRenTbzb)
    const router = this.props.store_router
    let hideTab = false
    const location = router.location.pathname.replace(/(^\/*)|(\/*$)/g, '')
    const darenorder = DaRenOrder.replace(/(^\/*)|(\/*$)/g, '')
    const daren = DaRen.replace(/(^\/*)|(\/*$)/g, '')
    if (location === darenorder) {
      hideTab = true
    }
    if (location === daren) {
      activeTaobao = true
    }
    return (
      <div className='master' style={{backgroundColor: '#efefef'}}>
        <div className='margin10'>
          <Breadcrumb {...this.props} />
        </div>
        <div className='tabsLike' style={{backgroundColor: '#fff', display: hideTab ? 'none' : 'block'}}>
          <div className={activeToutiao ? 'tab tab-active' : 'tab'} style={{display: 'none'}}>
            <div className='tab-inner' onClick={() => this.changeType(medias.tbtt.short)}>{medias.tbtt.name}</div>
          </div>
          <div className={activeTaobao ? 'tab tab-active' : 'tab'}>
            <div className='tab-inner' onClick={() => this.changeType(medias.tbzb.short)}>{medias.tbzb.name}</div>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}


Layout.propTypes = {
  children: PropTypes.element,
  dispatch: PropTypes.func,
  store_router: PropTypes.object
}
Layout.contextTypes = {
  router: PropTypes.object
}
const mapStateToProps = (state) => ({
  store_router: state.router
})

export default connect(mapStateToProps, null)(Layout)
