/**
 * Created by CY on 2016/2/24.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Table from 'antd/lib/table'
import Pagination from 'antd/lib/pagination'

import { actions as loadFinanceActions } from '../../redux/finance/finance'

const columns = [{
  title: '赠送金额（￥）',
  dataIndex: 'money'
}, {
  title: '时间',
  dataIndex: 'created'
}, {
  title: '	备注',
  dataIndex: 'type'
}]
export class GiftRecordView extends React.Component {
  componentDidMount () {
    document.title = '财务记录-红包记录'
    const ditems = this.props.finance.giftItems
    if (ditems.length === 0) {
      this.props.loadGiftDetailAction({skip: 0, page: 1})
    }
  }
  onPageChange (page) {
    this.props.loadGiftDetailAction({skip: (page - 1) * 25, page: page})
  }
  renderTable () {
    const financeItems = this.props.finance.giftItems
    const total = this.props.finance.gtotal
    const page = this.props.finance.gpage
    const rowKey = (record) => record.created + '_' + record.id
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
    return (
      <div>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong>红包记录</strong>
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
GiftRecordView.propTypes = {
  loadGiftDetailAction: PropTypes.func.isRequired,
  finance: PropTypes.object.isRequired
}
export default connect(mapStateToProps, loadFinanceActions)(GiftRecordView)
