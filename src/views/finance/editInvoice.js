/**
 * Created by CY on 2016/4/11.
 */
import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import Button from 'antd/lib/button'
import Affix from 'antd/lib/affix'

import { actions as invoiceActions } from '../../redux/invoice/invoiceAction'

import InvoiceInfoList from './invoiceInfoList'


import EditInvoiceForm from './editInvoiceForm'

let EditInvoiceView = React.createClass({
  propTypes: {
    infors: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    adding: PropTypes.bool.isRequired,
    loadInvoiceTaxAction: PropTypes.func.isRequired,
    addInvoiceInforsAction: PropTypes.func.isRequired,
    delInvoiceTaxAction: PropTypes.func.isRequired,
    setDefaultInvoiceInforAction: PropTypes.func.isRequired,
    modInvoiceTaxAction: PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      editItem: null,
      editMode: false,
      openInvoiceForm: false,
      taxType: 0
    }
  },
  componentDidMount () {
    const addrs = this.props.infors
    if (addrs.length === 0) {
      this.props.loadInvoiceTaxAction()
    }
  },
  handerAddBtn () {
    this.setState({
      openInvoiceForm: true,
      editMode: false
    })
  },
  handleFormShow () {
    this.setState({
      editMode: false,
      openInvoiceForm: false,
      editItem: null
    })
  },
  delAddr (id) {
    this.props.delInvoiceTaxAction(id)
  },
  setDefaultInfor (id) {
    this.props.setDefaultInvoiceInforAction(id)
  },
  modAddr (invoice) {
    this.setState({
      editItem: invoice,
      editMode: true,
      openInvoiceForm: true
    })
  },
  render () {
    const addrsData = this.props.infors
    return (
      <div className='panel panel-default panel-xb'>
        <div className='panel-body'>
          <Affix>
            <div style={{margin: '8px 0'}}>
              <Button type='primary' onClick={this.handerAddBtn}>添加发票</Button>
            </div>
          </Affix>
          {this.state.openInvoiceForm
            ? <EditInvoiceForm
                adding={this.props.adding}
                visible={this.state.openInvoiceForm}
                editMode={this.state.editMode}
                data={this.state.editItem}
                handleFormShow={this.handleFormShow}
                addInvoiceAct={this.props.addInvoiceInforsAction}
                editInvoiceAct={this.props.modInvoiceTaxAction}
            />
            : null}
          <InvoiceInfoList
            data={addrsData}
            isFetching={this.props.isFetching}
            delInvoice={this.delAddr}
            setDefault={this.setDefaultInfor}
            modInvoice={this.modAddr}
          />
        </div>
      </div>
    )
  }
})
const mapStateToProps = (state) => ({
  infors: state.invoice.infors,
  isFetching: state.invoice.isFetching,
  adding: state.invoice.adding
})
export default connect(mapStateToProps, invoiceActions)(EditInvoiceView)
