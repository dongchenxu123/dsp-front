/**
 * Created by CY on 2016/6/28.
 */
import React, { PropTypes } from 'react'

import Pagination from 'antd/lib/pagination'

class ItemList extends React.Component {
  pageOnChange (page) {
    this.props.onPageChange(page)
  }
  itemSelect (id) {
    this.props.itemSelect(id)
  }
  render () {
    const list = this.props.data.list
    const data = this.props.data.data
    const isSelect = this.props.data.select
    const Item = this.props.itemTpl
    console.log(this.props.data.service_scope)
    return (
      <div>
        <div className='clearfix'>
          {
            list.map((item, idx) => {
              return <Item isSelect={isSelect} key={data[item].id} data={data[item]} select={this.itemSelect.bind(this)} servicType={this.props.data.service_scope}/>
            })
          }
        </div>
        {
          this.props.total < 15
            ? null
            : <div style={{padding: '8px 16px'}}>
              <Pagination current={this.props.cpage} total={this.props.total} onChange={this.pageOnChange.bind(this)} pageSize={15}/>
            </div>
        }
      </div>
    )
  }
}
ItemList.propTypes = {
  total: PropTypes.number,
  itemTpl: PropTypes.func,
  cpage: PropTypes.number,
  data: PropTypes.object,
  onPageChange: PropTypes.func,
  itemSelect: PropTypes.func,
  isSelect: PropTypes.array,
  store: PropTypes.object
}
export default ItemList
