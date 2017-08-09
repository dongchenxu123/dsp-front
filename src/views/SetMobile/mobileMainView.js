import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'

import Button from 'antd/lib/button'
import Tag from 'antd/lib/tag'
import Modal from 'antd/lib/modal'
import Popconfirm from 'antd/lib/popconfirm'
import Table from 'antd/lib/table'
import Tabs from 'antd/lib/tabs'
import Pagination from 'antd/lib/pagination'
import message from 'antd/lib/message'

const TabPane = Tabs.TabPane

import { actions as transActions } from 'redux/mobile/mobileAction'

import { LogUrl, SetMobileChartUrl } from 'help/siteNav'
import { setmobile_id as APPID } from 'help/appid'

import AddItemView from './add'
import TodayDataView from 'components/todayDataView'

import SettingViewMaster from 'components/settingContainer'

import XbButton from 'components/xbbutton'

import {TabsGroupData} from './mainPageData'
import { pagedata } from 'help/pagedata'

const mapStateToProps = (state) => ({
  mobile: state.mobile,
  userShopChart: state.userShopChart
})
function findCreativeType (size) {
  var obj = {}
  for (let i = 0; i < TabsGroupData.length; i++) {
    let sizeArr = TabsGroupData[i].size
    if (sizeArr.indexOf(size) >= 0) {
      obj = TabsGroupData[i]
      break
    }
  }
  return obj
}

export class MobileMainView extends React.Component {
  static propTypes = {
    addBidItemTrans: PropTypes.func.isRequired,
    editBidItemTrans: PropTypes.func.isRequired,
    delBidItemTrans: PropTypes.func.isRequired,
    getBidTrans: PropTypes.func.isRequired,
    loadCPCAndBudget: PropTypes.func.isRequired,
    setBudgetAction: PropTypes.func.isRequired,
    setCPCAction: PropTypes.func.isRequired,
    loadTodayDataAction: PropTypes.func.isRequired,
    getTransCatsAction: PropTypes.func.isRequired,
    loadUserShopScoreAction: PropTypes.func.isRequired,
    loadUserShopPeopleAction: PropTypes.func.isRequired,
    mobile: PropTypes.object.isRequired,
    userShopChart: PropTypes.object.isRequired,
    //setTransStatusAction: PropTypes.func.isRequired
    setBidItemStatus: PropTypes.func.isRequired
  };
  constructor () {
    super()
    this.state = {
      addtrans: false,
      editMode: false,
      eidtTrans: false,
      adsType: false,
      picSize: false
    }
  }
  componentDidMount () {
    document.title = '移动推广'
    var mobileItems = this.props.mobile
    this.props.getBidTrans({page: 1, campaign_type: APPID})
    if (!mobileItems.settings.cpc) {
      this.props.loadCPCAndBudget(APPID)
    }
    /*if (!mobileItems.transSize.data) {
      this.props.getValidTransSize()
    }*/
    this.props.loadTodayDataAction(APPID)
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

    if (mobileItems.transCats.data.length === 0) {
      this.props.getTransCatsAction()
    }
  }
  tablecolumns () {
    const self = this
    return (
      [{
        title: '创意图片',
        width: '60%',
        dataIndex: 'created',
        render: function (text, record) {
          return (
            <div>
              <div><img src={record.creatives[0].pic} style={{maxHeight: '90px', maxWidth: '100%'}} /></div>
              <div style={{marginTop: '15px'}}>
                <div><Tag>推广标题</Tag><span> {record.title}</span></div>
                <Tag>推广链接</Tag><a href={record.url}>{record.url}</a>
              </div>
            </div>
          )
        }
      }, {
        title: '创意类型',
        width: '7%',
        dataIndex: 'createType',
        render: function (text, record) {
          var size = record.creatives[0].size
          var obj = findCreativeType(size)
          return (
            <span>{obj.name}</span>
          )
        }
      }, {
        title: '尺寸',
        width: '8%',
        dataIndex: 'creatives',
        render: function (obj) {
          return (
            <span> { obj[0].size} </span>
          )
        }
      }, {
        title: '操作',
        width: '25%',
        render: function (value, record) {
          return (
            <div>
              <Button type='primary' onClick= { () => { self.editBtnHandler(record) } } style={{marginRight: '15px'}}>编辑创意</Button>
              <Button style={{marginRight: '15px'}} onClick= { () => { self.setStatus(record, APPID) } } >{record.state === '1' ? '取消推广' : '推广'}</Button>
              <Popconfirm placement='top' title={'您确认删除吗？'} onConfirm={() => { self.delHandler(record.pid) }}>
                <Button>删除</Button>
              </Popconfirm>
            </div>
          )
        }
      }]
    )
  }
  addTrans (trans) {
    const self = this
    trans.campaign_type = APPID
    this.props.addBidItemTrans(trans).then((data) => {
      if (data.msg) {
        message.error(data.msg)
        return
      }
      self.setState({
        adsType: false,
        editMode: false,
        picSize: false
      })
    })
  }
  editTrands (trans) {
    const self = this
    trans.campaign_type = APPID
    this.props.editBidItemTrans(trans)
      .then((data) => {
        if (data.msg) {
          message.error(data.msg)
        }
        self.setState({
          editMode: false,
          eidtTrans: false
        })
      })
  }
  editBtnHandler (trans) {
    var size = trans.creatives[0].size
    let ctype = findCreativeType(size)
    this.setState({
      editMode: true,
      picSize: ctype.size,
      eidtTrans: trans
    })
  }
  renderTable () {
    const self = this
    const trans = this.props.mobile.items.list
    const listdata = this.props.mobile.items.data
    const rowClassFun = (record, index) => {
      if (record.state === '1') {
        return 'mobile-active'
      }
    }
    const tdata = trans.map(pid => listdata[pid])
    const rowKey = (record) => record.pid
    return (
        <Table
          loading={self.props.mobile.fetching}
          rowKey={rowKey}
          columns={self.tablecolumns()}
          dataSource={tdata}
          pagination={false}
          rowClassName={rowClassFun}
          delHandler={self.delHandler} />
    )
  }
  clickAddHandler (option) {
    this.setState({
      adsType: option.ctype,
      picSize: option.size,
      editMode: true
    })
  }
  cancelAdd () {
    this.setState({
      editMode: false,
      eidtTrans: false
    })
  }
  delHandler (pid) {
    //this.props.delShopTrans(pid)
    this.props.delBidItemTrans({campaign_type: APPID, id: pid})
  }
  setStatus (data) {
    this.props.setBidItemStatus({item: data, campaign_type: APPID})
  }
  onPageChange (page) {
    this.props.getBidTrans({page: page, campaign_type: APPID})
  }
  render () {
    const self = this
    const {totalItems, items, transCats} = this.props.mobile
    const todaydata = this.props.mobile.todayChart
    const settingData = this.props.mobile.settings
    const setingOption = {
      appid: APPID,
      title: '推广设置',
      setingData: settingData,
      url: LogUrl
    }
    const addOption = {
      transSize: this.state.picSize,
      creativeType: this.state.adsType,
      transCats: transCats,
      getTransCats: this.props.getTransCatsAction,
      addFetching: this.props.mobile.fetching,
      editFetching: this.props.mobile.fetching,
      addTrans: this.addTrans.bind(this),
      editTrans: this.editTrands.bind(this),
      hideAdd: this.cancelAdd.bind(this)
    }
    console.log(addOption)
    const modalTitle = function () {
      var str = ''
      if (self.state.eidtTrans) {
        let size = self.state.eidtTrans.creatives[0].size
        let ctype = findCreativeType(size)
        str = '编辑' + ctype.name
        return str
      }
      if (self.state.adsType) {
        let obj = {}
        for (let i = 0; i < TabsGroupData.length; i++) {
          if (self.state.adsType === TabsGroupData[i].ctype) {
            obj = TabsGroupData[i]
            break
          }
        }
        str = '添加' + obj.name
        return str
      }
      return '添加/修改创意'
    }
    const todayOpt = () => {
      return (
        <Link className='pull-right' to={SetMobileChartUrl + APPID}>查看更多</Link>
      )
    }
    return (
      <div className=''>
        <TodayDataView todayData={todaydata} operate={todayOpt()}/>
        <SettingViewMaster option={setingOption}/>
        <div className='panel panel-default panel-xb'>
          <div className='panel-heading'>
            <strong>{pagedata.mobile.title}</strong>
          </div>
          <div className='panel-body'>
            <Tabs defaultActiveKey='0' style={{marginBottom: '15px'}}>
              {
                TabsGroupData.map((item, index) => {
                  return (
                    <TabPane tab={item.name} key={index}>
                      <div className='clearfix'>
                        <div style={{float: 'left'}}><img src={item.sample}/></div>
                        <div style={{float: 'left', marginTop: '10px', marginLeft: '20px'}}>
                          <h4>什么是{item.name}广告？</h4><br/>
                          <div dangerouslySetInnerHTML={{__html: item.html}} />
                          <div style={{marginTop: '20px'}}>
                            <XbButton size='large'
                                      onClick={this.clickAddHandler.bind(self, {size: item.size, ctype: item.ctype})}>
                               点击添加{item.name}
                            </XbButton>
                            <Button style={{display: 'none'}} size='large' type='primary' onClick={this.clickAddHandler.bind(self, {size: item.size, ctype: item.ctype})}>点击添加{item.name}</Button>
                          </div>
                        </div>
                      </div>
                    </TabPane>
                  )
                })
              }
            </Tabs>
            {
              this.state.editMode
                ? <Modal
                className='nofooterModal'
                title={modalTitle()}
                visible={this.state.editMode}
                closable={false}
                width='700px'
                footer={null}
              >
                <AddItemView key='add' option={addOption} trans={this.state.eidtTrans} />
              </Modal>
                : null
            }
            {
              items.list.length ? <div className='clearfix'>{this.renderTable()}</div> : null
            }
            {
              totalItems > 25 ? <div style={{marginTop: 16}}><Pagination defaultCurrent={1} current={this.props.mobile.page} total={this.props.mobile.totalItems} pageSize={25} onChange={this.onPageChange.bind(this)} /></div> : null
            }
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, transActions)(MobileMainView)
