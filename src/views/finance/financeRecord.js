/**
 * Created by CY on 2016/2/24.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Table from 'antd/lib/table'
import Pagination from 'antd/lib/pagination'
import { FormateNum } from 'help/formate'

import { actions as loadFinanceActions } from '../../redux/finance/finance'

const columns = [{
  title: '金额（￥）',
  dataIndex: 'total_fee'
}, {
  title: '时间',
  dataIndex: 'gmt_payment'
}, {
  title: '	备注',
  dataIndex: 'comment'
}]
export class FinanceRecordView extends React.Component {
  componentDidMount () {
    document.title = '财务记录'
    const cost = this.props.finance.summary.cost
    const ditems = this.props.finance.detailItems
    if (ditems.length === 0) {
      this.props.loadFinanceDetailAction({skip: 0, page: 1})
    }
    if (!cost) {
      this.props.loadFinanceSummaryAction()
    }
  }
  onPageChange (page) {
    this.props.loadFinanceDetailAction({skip: (page - 1) * 25, page: page})
  }
  renderTable () {
    const financeItems = this.props.finance.detailItems
    const total = this.props.finance.dtotal
    const page = this.props.finance.dpage
    const rowKey = (record) => record.id
    return (
      <div>
        <Table columns={columns} rowKey={rowKey} dataSource={financeItems} pagination={false} />
        <div style={{padding: '10px 0'}}>
          <Pagination defaultCurrent={1} current={page} total={total} pageSize={25} onChange={this.onPageChange.bind(this)} />
        </div>
      </div>
    )
  }
  render () {
    const {cost, deposit, luckily} = this.props.finance.summary
    return (
      <div>
        <div className='clearfix row'>
          <div className='col-md-4 text-center' style={{padding: '0 15px'}}>
            <div className='text-danger margin10' style={{backgroundColor: '#5fafe4', color: '#fff', lineHeight: '70px'}}>
              账户总花费: <strong style={{fontSize: 30}}> {FormateNum(cost / 100)} </strong>
            </div>
          </div>
          <div className='col-md-4 text-center' style={{padding: '0 15px'}}>
            <div className='text-danger margin10' style={{backgroundColor: '#7bcfbb', color: '#fff', lineHeight: '70px'}}>
              账户总充值(￥): <strong style={{fontSize: 30}}> {FormateNum(deposit)} </strong>
            </div>
          </div>
          <div className='col-md-4 text-center' style={{padding: '0 15px'}}>
            <div className='text-danger margin10' style={{backgroundColor: '#f3c17f', color: '#fff', lineHeight: '70px'}} >
              红包总赠送(￥): <strong style={{fontSize: 30}}> {FormateNum(luckily)} </strong>
            </div>
          </div>
        </div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong>充值记录</strong>
          </div>
          <div className='panel-body'>
            {this.renderTable()}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  finance: state.finance
})
FinanceRecordView.propTypes = {
  loadFinanceDetailAction: PropTypes.func.isRequired,
  loadFinanceSummaryAction: PropTypes.func.isRequired,
  finance: PropTypes.object.isRequired
}
export default connect(mapStateToProps, loadFinanceActions)(FinanceRecordView)
