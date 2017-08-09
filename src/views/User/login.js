/**
 * Created by CY on 2016/1/22.
 */
import React, {PropTypes} from 'react'
import { connect } from 'react-redux'

import Form from 'antd/lib/form'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'

const FormItem = Form.Item

import {actions as loginactions} from '../../redux/user/userAction'

import { STUrpPrefix } from 'help/siteNav'

const mapStateToProps = (state) => ({
  auth: state.auth
})

export class LoginView extends React.Component {
  constructor () {
    super()
  }
  static propTypes = {
    loginAction: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  componentDidMount () {
    document.title = '登录'
  }
  handleClick (event) {
    event.preventDefault()
    const username = this.refs.username
    const password = this.refs.password
    const creds = { uname: username.value.trim(), passwd: password.value.trim() }
    this.props.loginAction(creds).then((data) => {
      if (data.msg) {
        Modal.error({
          title: '提示',
          content: data.msg.error.desc
        })
      }
    })
  }
  render () {
    const user = this.props.auth
    return (
      <div className='container' style={{paddingTop: '100px'}}>
        <div style={{textAlign: 'center', paddingBottom: 50}}>
          <img src={STUrpPrefix + __TARGETAGENCY__ + '/logo-big.jpg?v=2016080901'} style={{height: 120}}/>
        </div>
        <Form horizontal>
          <FormItem
            label='用户名：'
            labelCol={{span: 5}}
            wrapperCol={{span: 12}}>
            <input className='ant-input' type='text' name='userName' ref='username'/>
          </FormItem>
          <FormItem
            label='密码：'
            labelCol={{span: 5}}
            wrapperCol={{span: 12}}>
            <input className='ant-input' type='password' name='password' ref='password' />
          </FormItem>
          <Row>
            <Col span='12' offset='5'>
              <Button type='primary' loading={user.isFetching} onClick={(event) => this.handleClick(event)} htmlType='submit'>登录</Button>
              <a href='' style={{display: 'none'}}>忘记密码</a>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
/*LoginView.propType = {
  loginAction: PropTypes.func.isRequired
}*/

LoginView.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, loginactions)(LoginView)
