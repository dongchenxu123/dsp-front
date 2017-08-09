/**
 * Created by CY on 2016/1/25.
 */
import React from 'react'
import Spin from 'antd/lib/spin'

export class LoadingView extends React.Component {
  render () {
    return (
      <div style={{textAlign: 'center'}}>
        <Spin />
      </div>
    )
  }
}

export default LoadingView
