/**
 * Created by CY on 2016/4/11.
 */
import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Form from 'antd/lib/form'
import Table from 'antd/lib/table'
import Modal from 'antd/lib/modal'

import classes from './invoice.css'
const createForm = Form.create
const FormItem = Form.Item

import { actions as invoiceActions } from '../../redux/invoice/invoiceAction'

const columns = [{
  title: '联系人姓名',
  width: '15%',
  dataIndex: 'name'
}, {
  title: '电话',
  width: '10%',
  dataIndex: 'phone'
}, {
  title: '邮编',
  width: '10%',
  dataIndex: 'zip'
}, {
  title: '邮寄地址',
  width: '45%',
  dataIndex: 'address'
}]

let EditAddressView = React.createClass({
  propTypes: {
    form: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    adding: PropTypes.bool.isRequired,
    loadInvoiceAddrsAction: PropTypes.func.isRequired,
    addInvoiceAddrsAction: PropTypes.func.isRequired,
    delInvoiceAddrsAction: PropTypes.func.isRequired,
    modInvoiceAddrsAction: PropTypes.func.isRequired,
    setDefaultInvoiceAddrsAction: PropTypes.func.isRequired,
    addrs: PropTypes.array.isRequired
  },
  getInitialState () {
    return {
      editItem: false
    }
  },
  componentDidMount () {
    const addrs = this.props.addrs
    if (addrs.length === 0) {
      this.props.loadInvoiceAddrsAction()
    }
  },

  handleReset (e) {
    e.preventDefault()
    this.props.form.resetFields()
  },

  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((errors, values) => {
      /*eslint-disable no-extra-boolean-cast */
      if (!!errors) {
        console.log('Errors in form!!!')
        return
      }
      if (this.state.editItem) {
        values.id = this.state.editItem.id
        this.props.modInvoiceAddrsAction(values).then(data => {
          this.setState({
            editItem: false
          })
          this.props.form.resetFields()
        })
        return
      }
      this.props.addInvoiceAddrsAction(values).then((data) => {
        this.props.form.resetFields()
        if (data.msg) {
          Modal.error({
            title: '错误',
            content: '添加地址失败，请稍后再试'
          })
        }
      })
    })
  },
  delAddr (text, row, index) {
    this.props.delInvoiceAddrsAction(row.id)
  },
  modAddr (text, row, index) {
    //this.props.delInvoiceAddrsAction(row.id)
    this.setState({
      editItem: row
    })
  },
  setDefaultAddr (text, row, index) {
    this.props.setDefaultInvoiceAddrsAction(row.id)
  },
  render () {
    const {getFieldProps, isFieldValidating, getFieldError} = this.props.form
    const nameProps = getFieldProps('name', {
      rules: [
        { required: true, min: 2, message: '用户名至少为 2 个字符' },
        { validator: this.userExists }
      ],
      initialValue: this.state.editItem ? this.state.editItem.name : null
    })
    const phoneProps = getFieldProps('phone', {
      rules: [
        { required: true, min: 11, message: '手机号码至少为11位' },
        { validator: this.userExists }
      ],
      initialValue: this.state.editItem ? this.state.editItem.phone : null
    })
    const addrCodeProps = getFieldProps('zip', {
      rules: [
        { required: true, min: 6, message: '邮编为六位数字' }
      ],
      initialValue: this.state.editItem ? this.state.editItem.zip : null
    })
    const addressProps = getFieldProps('address', {
      rules: [{ required: true, message: '请填写详细邮寄地址' }],
      initialValue: this.state.editItem ? this.state.editItem.address : null
    })
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 }
    }
    const rowkey = function (record) {
      return record.id
    }
    const tableColumns = columns.concat([
      {
        title: '操作',
        width: '20%',
        key: 'optional',
        render: (text, row, index) => {
          return (
            <div>
              <a href='#' onClick={(e) => { e.preventDefault(); this.modAddr(text, row, index) }}>编辑</a>
              &nbsp;|&nbsp;
              <a href='#' onClick={(e) => { e.preventDefault(); this.delAddr(text, row, index) }}>删除</a>
              <a href='#' className={classes.setDefault} onClick={(e) => { e.preventDefault(); this.setDefaultAddr(text, row, index) }} > &nbsp;|&nbsp;设为默认</a>
            </div>
          )
        }
      }
    ])
    const addrsData = this.props.addrs
    return (
      <div className='panel panel-default panel-xb'>
        <div className='panel-body'>
          <div>添加邮寄地址</div>
          <Form horizontal form={this.props.form}>
            <FormItem
              {...formItemLayout}
              label='联系人姓名：'
              hasFeedback
              help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}>
              <Input {...nameProps} placeholder='联系人姓名' />
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='手机号码：'
              hasFeedback>
              <Input {...phoneProps} type='number' placeholder='手机号码' />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='邮编：'
              hasFeedback>
              <Input {...addrCodeProps} type='number' placeholder='邮编' />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='详细地址：'
              hasFeedback>
              <Input {...addressProps} type='textarea' placeholder='详细地址' />
            </FormItem>

            <FormItem
              wrapperCol={{ span: 12, offset: 4 }} >
              <Button type='primary' onClick={this.handleSubmit} loading={this.props.adding} >确定</Button>
            </FormItem>
          </Form>
          <div className={classes.addrTable}>
            <div>已经保存了 <span style={{color: 'red'}}>{addrsData.length}</span> 条地址</div>
            <Table rowKey={rowkey} columns={tableColumns} dataSource={addrsData} loading={this.props.isFetching} />
          </div>
        </div>
      </div>
    )
  }
})
EditAddressView = createForm()(EditAddressView)
//export default EditInvoiceView
const mapStateToProps = (state) => ({
  addrs: state.invoice.addrs,
  isFetching: state.invoice.isFetching,
  adding: state.invoice.adding
})
export default connect(mapStateToProps, invoiceActions)(EditAddressView)
