/**
 * Created by CY on 2016/5/12.
 */
import React, { PropTypes } from 'react'

import Breadcrumb from 'antd/lib/breadcrumb'

//function ActivityLayout ({ children }) {
class MobileLayout extends React.Component {
  render () {
    return (
      <div className='master' style={{backgroundColor: '#efefef'}}>
        <div className='margin10'>
          <Breadcrumb {...this.props} />
        </div>
        {this.props.children}
      </div>
    )
  }
}

MobileLayout.propTypes = {
  children: PropTypes.element
}

export default MobileLayout
