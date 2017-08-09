/**
 * Created by CY on 2016/5/26.
 */
import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'
const mapStateToProps = (state) => ({
  user: state.auth.user
})

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)
function isString (str) {
  return typeof str === 'string'
}

function insertSpace (child) {
  if (isString(child.type) && isTwoCNChar(child.props.children)) {
    return React.cloneElement(child, {},
      child.props.children.split('').join(' '))
  }
  if (isString(child)) {
    if (isTwoCNChar(child)) {
      child = child.split('').join(' ')
    }
    return <span>{child}</span>
  }
  return child
}

class XbButton extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    user: PropTypes.any,
    onClick: PropTypes.func
  };
  disableBitHandler () {
    Modal.error({
      title: '提示',
      content: '您目前的客户级别暂时无法投放该资源，若有疑问请联系客服'
    })
  }
  render () {
    var {children} = this.props
    const kids = React.Children.map(children, insertSpace)
    if (this.props.user.client_level !== '2') {
      return (
        <Button {...this.props} type='primary' onClick={this.disableBitHandler.bind(this)}>{this.props.children}</Button>
      )
    }
    return (
      <Button {...this.props} type='primary' onClick={this.props.onClick}>
        {kids}
      </Button>
    )
  }
}
export default connect(mapStateToProps, null)(XbButton)
//export default XbButton
