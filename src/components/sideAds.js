/**
 * Created by CY on 2016/8/10.
 */
import React, { PropTypes } from 'react'

import axios from 'axios'
import Link from 'react-router/lib/Link'
import { GetAdsImg } from 'help/url'

class SidebarAd extends React.Component {
  constructor () {
    super()
    this._isMounted = false
    this.state = {
      ads: []
    }
  }
  componentWillMount () {
    const viewDir = this.props.viewDir
    const adid = this.props.adid
    if (!viewDir || !adid) {
      return
    }
    this.getAds(viewDir, adid)
  }
  componentDidMount () {
    this._isMounted = true
  }
  componentWillUnmount () {
    this._isMounted = false
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.ads !== nextState.ads) {
      return true
    } else {
      return false
    }
  }
  getAds (viewdir, adid) {
    const self = this
    axios.get(GetAdsImg + viewdir + '&id=' + adid)
      .then(function (response) {
        var data = response.data
        return data
      })
      .then(function (data) {
        let adImgs = []
        for (var property in data) {
          if (data.hasOwnProperty(property)) {
            adImgs.push(data[property])
          }
        }
        if (self._isMounted) {
          self.setState({
            ads: adImgs
          })
        }
        return data
      })
  }
  herfClick () {
    if (window.ga) {
      window.ga('send', 'event', 'click', 'user', 'sidebar-ad')
    }
  }
  render () {
    const ads = this.state.ads
    const styleDiv = {
      textAlign: 'center',
      margin: '16px 0',
      border: 'solid 1px #ccc',
      backgroundColor: '#fff'
    }
    if (!ads.length) {
      return null
    }
    if (ads.length > 0 && (ads[0].link.replace(' ', '').indexOf('http://') === 0 ||
    ads[0].link.replace(' ', '').indexOf('https://') === 0)) {
      return (
        <div style={styleDiv}>
          <a href={ads[0].link} target='_blank' onClick={this.herfClick.bind(this)}>
            <img src={ads[0].ad_src} style={{maxWidth: '100%'}}/>
          </a>
        </div>
      )
    } else {
      return (
        <div style={styleDiv}>
          <Link to={ads[0].link}>
            <img src={ads[0].ad_src} style={{maxWidth: '100%'}}/>
          </Link>
        </div>
      )
    }
    return null
  }
}

SidebarAd.propTypes = {
  viewDir: PropTypes.string,
  adid: PropTypes.number
}

export default SidebarAd
