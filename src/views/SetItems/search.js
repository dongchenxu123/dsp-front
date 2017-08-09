/**
 * Created by CY on 2016/6/7.
 */
import React from 'react'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'

export default class SearchEl extends React.Component {
  static propTypes = {
    search: React.PropTypes.any
  };
  btnSearchHandle () {
    const searchTxt = this.refs.searchInput.value
    this.props.search(searchTxt)
  }
  render () {
    return (
      <div className='pull-left' style={{width: '20%', marginLeft: '15px'}}>
        <span className='ant-input-group ant-search-input' style={{width: '100%'}}>
          <span className='ant-input-wrapper'>
            <input type='text' className='ant-input' ref='searchInput' />
          </span>
          <div className='ant-input-group-wrap' >
            <Button className='ant-search-btn' onClick={this.btnSearchHandle.bind(this)}>
              <Icon type='search' />
            </Button>
          </div>
        </span>
      </div>
    )
  }
}
