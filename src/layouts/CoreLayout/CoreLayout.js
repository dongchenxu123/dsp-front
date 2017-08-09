import React, { PropTypes } from 'react'

class CoreLayout extends React.Component {
  render () {
    return (
      <div className='view-container col-lg-12 col-md-12'>
        {this.props.children}
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children: PropTypes.element
}
export default CoreLayout
