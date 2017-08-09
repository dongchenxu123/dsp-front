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

import TBZBForm from './tbzbForm'

import TbzbItem from './tbzb_item'

const M_TYPE = 2

class TaobaoZhibo extends React.Component {
  constructor () {
    super()
    this.state = {
      showCreateModal: false
    }
  }
  componentDidMount () {
    const ttdata = this.props.store
    const zhiboCates = ttdata.zhiboCate
    const list = ttdata.zhibolist
    if (!zhiboCates.length) {
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
      service_scope: store.service_scope,
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
    const darenData = this.props.store.zhibodata
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
    const cate = darenData.zhiboCate
    const filter = {
      fprice: darenData.fprice,
      ffollowers: darenData.ffollowers,
      fgender: darenData.fgender,
      service_scope: darenData.service_scope
    }
    const selected = darenData.selected
    const selectedId = selected.map((item) => item.id)
    const listData = {
      list: darenData.zhibolist,
      data: darenData.zhibodata,
      select: selectedId,
      service_scope: darenData.service_scope
    }
    return (
      <div style={{backgroundColor: '#fff', overflow: 'hidden'}}>
        <CreactBtn select={selected} handleCreateModal={this.handleCreateModal.bind(this)} />
        { cate.length > 0 ? <CatView data={cate} onChange={this.categoryChange.bind(this)} /> : null}
        <FilterView onChange={this.filterChange.bind(this)} default={filter} selected={darenData.selected}/>
        <ItemList key={'tbzb'} itemTpl={TbzbItem} data={listData} cpage={parseInt(darenData.page, 10)} total={parseInt(darenData.total, 10)} onPageChange={this.pageOnChange.bind(this)} itemSelect={this.itemSelected.bind(this)}/>
        {
          this.state.showCreateModal ? this.renderCreateModal() : null
        }
      </div>
    )
  }
  renderCreateModal () {
    const darenData = this.props.store
    const selected = darenData.selected
    const service_scope = darenData.service_scope
    return <TBZBForm visible={this.state.showCreateModal} select={selected} onClose={this.handleCreateModal.bind(this)} submit={this.props.createFansActivity} service_scope={service_scope}/>
  }
}

TaobaoZhibo.propTypes = {
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


export default connect(mapStateToProps, actions)(TaobaoZhibo)
