import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'
import { actions as loadItemsActions } from '../../redux/setitems/setitemsAction'

import Breadcrumb from 'antd/lib/breadcrumb'
import Modal from 'antd/lib/modal'
import Pagination from 'antd/lib/pagination'
import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'

import { SetItemsChartUrl, LogUrl } from 'help/siteNav'
import { setitems_id } from 'help/appid'

import TodayDataView from 'components/todayDataView'
import BidItemView from './bidItemView'
import BidListItemView from './bidListItemView'
import LoadingView from 'components/loading'
import NoDataView from 'views/share/nodata'

import SettingViewMaster from 'components/settingContainer'

import SearchCom from './search'
import RenQiForm from './renqiForm'
import RenqiChart from 'components/renqiChart'
import { pagedata } from 'help/pagedata'

import RechargeView from 'components/rechargeDialog'
import EditItemModalView from './editItemsModal'

import { NoBalanceCode } from 'help/ajaxErrorCode'

import SideAdsView from 'components/sideAds'

const AdId = pagedata.items.adid
const ButtonGroup = Button.Group
const confirm = Modal.confirm

const pageTitle = pagedata.items.title
const mapStateToProps = (state) => ({
  auth: state.auth.user,
  setitems: state.setitems,
  userShopChart: state.userShopChart
})
export class SetItemsView extends React.Component {
  constructor () {
    super()
    this.state = {
      editItem: false,
      itemType: 0,
      buyItem: 0,
      showPeopleBool: false,
      showRenQiChart: false,
      showRenQiForm: false,
      showRechargeModal: false,
      showEditModal: false,
      typeShow: 'card'
    }
    this.bidAllHandler = this.bidAllHandler.bind(this)
    this.stopAllHandler = this.stopAllHandler.bind(this)
  }
  static propTypes = {
    loadItemsAction: PropTypes.func.isRequired,
    setitems: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    userShopChart: PropTypes.object.isRequired,
    startBidItemsOnlineAction: PropTypes.func.isRequired,
    stopBidItemsOnlineAction: PropTypes.func.isRequired,
    editBidItemsAction: PropTypes.func.isRequired,
    loadCPCAndBudget: PropTypes.func.isRequired,
    loadTodayDataAction: PropTypes.func.isRequired,
    loadUserShopPeopleAction: PropTypes.func.isRequired,
    getLocationsAction: PropTypes.func,
    getRenQiPkgsAction: PropTypes.func,
    getRenQiChartAction: PropTypes.func,
    addRenQiPkgsAction: PropTypes.func
  };
  componentDidMount () {
    document.title = pageTitle
    var items = this.props.setitems
    if (items.items.length === 0) {
      this.loadItems({page: 1, type: this.state.itemType, q: ''})
    }
    if (!items.settings.cpc) {
      this.props.loadCPCAndBudget(setitems_id)
    }
    this.props.loadTodayDataAction(setitems_id)
    const sexdata = this.props.userShopChart.sexChart
    const agedata = this.props.userShopChart.ageChart
    const focusdata = this.props.userShopChart.focusChart

    if (!sexdata.data) {
      this.props.loadUserShopPeopleAction({show: 1})
    }
    if (!agedata.data) {
      this.props.loadUserShopPeopleAction({show: 2})
    }
    if (!focusdata.data) {
      this.props.loadUserShopPeopleAction({show: 3})
    }
    this.props.getLocationsAction()
  }
  loadItems (query) {
    const self = this
    this.props.loadItemsAction(query).then(() => {
      if (self.state.itemType === 1) {
        return
      }
      const items = self.props.setitems.items
      const title = () => {
        let words = ''
        for (var i = 0; i < items.length; i++) {
          words += items[i].title
        }
        return words
      }
      if (items.length) {
        self.props.getWordCloudAction(title())
      }
    }).catch(() => console.log('error'))
  }
  itemTypeBtnHandler () {
    let itemtype = this.state.itemType
    if (this.props.setitems.isFetching) {
      return
    }
    this.setState({
      itemType: itemtype === 0 ? 1 : 0
    })
    this.loadItems({page: 1, type: itemtype === 0 ? 1 : 0, q: ''})
  }
  onPageChange (page) {
    const type = this.state.itemType
    const searchTxt = this.refs.searchInput ? this.refs.searchInput.value : ''
    this.loadItems({page: page, type: type, q: searchTxt})
  }
  btnSearchHandle (searchTxt) {
    this.loadItems({page: 1, type: 0, q: searchTxt})
  }
  handleRenQiFormModal (itemId) {
    let state = this.state.showRenQiForm
    this.setState({
      buyItem: itemId,
      showRenQiForm: !state
    })
  }
  handleRenQiChartModal (item) {
    let state = this.state.showRenQiChart
    this.setState({
      chartItem: item,
      showRenQiChart: !state
    })
  }
  showPeopleChart () {
    var bool = this.state.showPeopleBool
    this.setState({
      showPeopleBool: !bool
    })
  }
  optimizeCreate (item) {
    this.setState({
      editItem: item,
      showEditModal: true
    })
  }
  toggleRechargeModal () {
    const isShow = this.state.showRechargeModal
    this.setState({
      showRechargeModal: !isShow
    })
  }
  bidHandler (items) {
    const self = this
    this.props.startBidItemsOnlineAction(items).then(function (data) {
      if (data.data.msg) {
        Modal.error({
          title: '提示',
          content: data.data.msg
        })
        return
      }
      const responseData = data.data.res
      if (data.data.code === NoBalanceCode) {
        self.toggleRechargeModal()
        return
      }
      var bidFalse = []
      for (var key in responseData) {
        if (!responseData[key].res) {
          bidFalse.push(responseData[key])
        }
      }
      if (bidFalse.length > 0) {
        Modal.error({
          title: '提示',
          content: '有' + bidFalse.length + '个宝贝投放失败'
        })
      }
    })
  }
  bidItemHandler (item) {
    this.bidHandler([item])
  }
  bidAllHandler () {
    this.bidHandler(this.props.setitems.items)
  }
  stopbidHandler (ids) {
    this.props.stopBidItemsOnlineAction(ids).then((data) => {
      if (data.msg) {
        Modal.error({
          title: '提示',
          content: data.msg
        })
      }
    })
  }
  stopAllHandler () {
    const self = this
    const items = this.props.setitems.items
    let ids = items.map((item) => {
      return item.id
    })
    confirm({
      title: '提示',
      content: '您确定停止本页所有宝贝的投放吗？',
      okText: '确定',
      onOk () {
        self.stopbidHandler(ids)
      },
      onCancel () {}
    })
    //this.props.stopBidItemsOnlineAction(ids)
  }
  stopbid (item) {
    this.stopbidHandler([item.id])
  }
  toggleEditItemModal () {
    const isShowEdit = this.state.showEditModal
    this.setState({
      editItem: false,
      showEditModal: !isShowEdit
    })
  }
  listTypeShowClick (type) {
    const typeshow = this.state.typeshow
    if (type === typeshow) {
      return
    }
    this.setState({
      typeShow: type
    })
  }
  render () {
    const total = this.props.setitems.totalPage
    const page = this.props.setitems.page
    const settingData = this.props.setitems.settings
    const todaydata = this.props.setitems.todayChart
    const setingOption = {
      appid: setitems_id,
      title: '推广设置',
      setingData: settingData,
      url: LogUrl,
      tagCloud: true
    }
    const todayOpt = <Link className='pull-right' to={SetItemsChartUrl + '/' + setitems_id}>查看更多</Link>
    return (
      <div>
        <div className='margin10'>
          <Breadcrumb {...this.props} />
        </div>

		<SideAdsView viewDir={this.props.auth.view_dir} adid={AdId}/>

        <TodayDataView todayData={todaydata} operate={todayOpt}/>
        <SettingViewMaster option={setingOption}/>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong> {pageTitle}</strong>
            <small style={{color: '#999', marginLeft: '15px'}}>下架状态的宝贝，请及时停止投放，避免不必要的损失</small>
          </div>
          <div style={{padding: '0 15px'}}>
            <ButtonGroup className='pull-right'>
              <Button type='ghost' onClick={this.bidAllHandler} loading={this.props.setitems.bidFetching}>投放本页<Icon type='caret-circle-right' /></Button>
              <Button type='ghost' onClick={this.stopAllHandler}>暂停本页<Icon type='pause-circle' /></Button>
            </ButtonGroup>
            <div className='pull-right' style={{marginRight: '15px'}}>
              <ButtonGroup>
                <Button type={ this.state.itemType === 0 ? 'primary' : 'ghost'} onClick={this.itemTypeBtnHandler.bind(this)}>全部宝贝</Button>
                <Button type={ this.state.itemType === 1 ? 'primary' : 'ghost'} onClick={this.itemTypeBtnHandler.bind(this)}>投放中的宝贝</Button>
              </ButtonGroup>
            </div>
          </div>
          <div>
            {this.state.itemType === 0 ? <SearchCom search={this.btnSearchHandle.bind(this)}/> : null}

          </div>
          <div style={{float: 'left', marginLeft: '15px'}}>
                  <div
                    onClick={() => this.listTypeShowClick('card')}
                    style={{position: 'relative', display: 'inline-block', verticalAlign: 'super', cursor: 'pointer'}}
                  >
                    <Icon type='appstore-o' />&nbsp;
                    <span>主图模式</span>
                  </div>
                  <div
                    style={{position: 'relative', display: 'inline-block', overflow: 'hidden', cursor: 'pointer', marginLeft: '15px'}}
                    onClick={() => this.listTypeShowClick('list')}
                  >
                    <Icon type='bars' />&nbsp;
                    <span>列表模式</span>
              </div>
          </div>
          <div className='panel-body' style={{clear: 'both'}}>
              {
                this.props.setitems.isFetching
                  ? <LoadingView />
                  : <div className='clearfix'>{this.renderItems()}</div>
              }
              {total && total > 25
                ? <div><Pagination defaultCurrent={1} current={page} total={total} pageSize={25} onChange={this.onPageChange.bind(this)} /></div>
                : null
              }
          </div>
        </div>

        {
          this.state.showEditModal ? this.renderEditItemModal() : null
        }
        {
          this.state.showRenQiForm ? this.renderRenqiForm() : null
        }
        {
          this.state.showRenQiChart ? this.renderRenQiChart() : null
        }
        {this.state.showRechargeModal ? <RechargeView visible={this.state.showRechargeModal} toggle={this.toggleRechargeModal.bind(this)}/> : null}
      </div>
    )
  }
  renderEditItemModal () {
    return (
      <EditItemModalView
        visible={this.state.showEditModal}
        modItem={this.props.editBidItemsAction}
        data={this.state.editItem}
        toggle={this.toggleEditItemModal.bind(this)}
      />
    )
  }
  renderRenqiForm () {
    const setitems = this.props.setitems
    const pkgtypes = setitems.pkgtypes
    const pkgdays = setitems.pkgdays
    const pkgs = setitems.pkgs
    return (
      <Modal className='nofooterModal'
             title='人气升级'
             maskClosable={false}
             onCancel={() => this.handleRenQiFormModal()}
             footer={null}
             visible={this.state.showRenQiForm} width={650}>
        <RenQiForm
          isFetching={setitems.pkgsFetching}
          data={{pkgs, pkgtypes, pkgdays}}
          buyItem={this.state.buyItem}
          getPkgs={this.props.getRenQiPkgsAction}
          addPkgs={this.props.addRenQiPkgsAction}
          handleModal={this.handleRenQiFormModal.bind(this)}
        />
      </Modal>
    )
  }
  renderRenQiChart () {
    return (
      <Modal
        className='nofooterModal'
        footer={null}
        onCancel={() => this.handleRenQiChartModal()}
        title='人气升级报表' visible={this.state.showRenQiChart} width={650}>
        <RenqiChart
          chartItem={this.state.chartItem}
          getChart={this.props.getRenQiChartAction}
        />
        <div className='modal-footer' style={{paddingTop: '15px', textAlign: 'right', borderTop: 'solid 1px #e9e9e9'}}>
          <Button type='ghost' onClick={() => this.handleRenQiChartModal()}>关闭</Button> &nbsp;
          <Button type='primary' onClick={() => this.handleRenQiChartModal()}>确定</Button>
        </div>
      </Modal>
    )
  }
  renderItems () {
    const self = this
    const items = this.props.setitems.items
    if (!items.length) {
      return NoDataView()
    }
    if (self.state.typeShow === 'card') {
      return items.map((item, idx) => {
        return (
          <BidItemView
            itemdata={item}
            key={item.id}
            pageType={self.props.setitems.type}
            stopBidHandler={self.stopbid.bind(self)}
            bidHandler={self.bidItemHandler.bind(self)}
            handleRenQiFormModal={self.handleRenQiFormModal.bind(self)}
            handleRenQiChartModal={self.handleRenQiChartModal.bind(self)}
            optCreate={self.optimizeCreate.bind(self)}
          />
        )
      })
    } else {
      return (
        <ul>
          {
            items.map((item, idx) => {
              return (
                <BidListItemView
                itemdata={item}
                key={item.id}
                pageType={self.props.setitems.type}
                stopBidHandler={self.stopbid.bind(self)}
                bidHandler={self.bidItemHandler.bind(self)}
                handleRenQiFormModal={self.handleRenQiFormModal.bind(self)}
                handleRenQiChartModal={self.handleRenQiChartModal.bind(self)}
                optCreate={self.optimizeCreate.bind(self)}
                />
            )
            })
          }
        </ul>
      )
    }
  }
}

export default connect(mapStateToProps, loadItemsActions)(SetItemsView)
