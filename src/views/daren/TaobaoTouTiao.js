/**
 * Created by CY on 2016/6/24.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import {actions} from 'redux/daren/darenActions'

import CatView from './cat'
import FilterView from './filter'
import CreactBtn from './createBtn'
import ItemList from './itemlist'
import ToutiaoForm from './tbttForm'
import TbttItem from './ttdr_item'

const M_TYPE = 1

class TouTiao extends React.Component {
  constructor () {
    super()
    this.state = {
      showCreateModal: false
    }
  }
  componentDidMount () {
    const ttdata = this.props.store
    const toutiaoCates = ttdata.toutiaoCate
    const list = ttdata.toutiaolist
    if (!toutiaoCates.length) {
      this.props.getFansCates({m_type: M_TYPE})
    }
    if (!list.length) {
      this.props.categoryChange({m_type: M_TYPE, category_id: 0})
    }
  }
  categoryChange (v) {
    this.props.categoryChange({m_type: M_TYPE, category_id: v})
  }
  filterChange (v) {
    const store = this.props.store
    const old = {
      fprice: store.fprice,
      ffollowers: store.ffollowers,
      fgender: store.fgender,
      m_type: M_TYPE,
      cate: store.categories,
      page: 1
    }
    this.props.loadFansMedia(Object.assign({}, old, v))
  }
  pageOnChange (page) {
    const store = this.props.store
    const old = {
      fprice: store.fprice,
      ffollowers: store.ffollowers,
      fgender: store.fgender,
      m_type: M_TYPE,
      cate: store.categories,
      page: page
    }
    this.props.loadFansMedia(old)
  }
  itemSelected (id) {
    const darenData = this.props.store.toutiaodata
    this.props.selectedItem(darenData[id])
  }
  handleCreateModal () {
    const showmodal = this.state.showCreateModal
    this.setState({
      showCreateModal: !showmodal
    })
  }
  render () {
    const darenData = this.props.store
    const cate = darenData.toutiaoCate
    const filter = {
      fprice: darenData.fprice,
      ffollowers: darenData.ffollowers,
      fgender: darenData.fgender,
      select: darenData.selected
    }
    console.log(filter.select)
    const selected = darenData.selected
    const selectedId = selected.map((item) => item.id)
    const listData = {
      list: darenData.toutiaolist,
      data: darenData.toutiaodata,
      select: selectedId
    }

    return (
      <div style={{backgroundColor: '#fff', overflow: 'hidden'}}>
        <CreactBtn select={selected} handleCreateModal={this.handleCreateModal.bind(this)} />
        { cate.length > 0 ? <CatView data={cate} onChange={this.categoryChange.bind(this)} /> : null}
        <FilterView onChange={this.filterChange.bind(this)} default={filter}/>
        <ItemList data={listData} itemTpl={TbttItem} cpage={parseInt(darenData.page, 10)} total={parseInt(darenData.total, 10)} onPageChange={this.pageOnChange.bind(this)} itemSelect={this.itemSelected.bind(this)} />
        {
          this.state.showCreateModal ? this.renderCreateModal() : null
        }
      </div>
    )
  }
  renderCreateModal () {
    const darenData = this.props.store
    const selected = darenData.selected
    return <ToutiaoForm visible={this.state.showCreateModal} select={selected} onClose={this.handleCreateModal.bind(this)} submit={this.props.createFansActivity} />
  }
}
TouTiao.propTypes = {
  categoryChange: PropTypes.func,
  getFansCates: PropTypes.func,
  createFansActivity: PropTypes.func,
  store: PropTypes.object,
  loadFansMedia: PropTypes.func,
  selectedItem: PropTypes.func
}
const mapStateToProps = (state) => ({
  store: state.daren
})
export default connect(mapStateToProps, actions)(TouTiao)
