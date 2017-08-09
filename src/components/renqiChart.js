/**
 * Created by CY on 2016/6/7.
 */
import React from 'react'
/*const Echarts = require('echarts/lib/echarts')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/chart/line')*/
import Modal from 'antd/lib/modal'

const Echarts = window.echarts

const tabs = [
  {
    id: 1,
    name: '访客数',
    numKey: 'Uv'
  },
  {
    id: 2,
    name: '宝贝收藏数',
    numKey: 'FavItems'
  },
  {
    id: 3,
    name: '店铺收藏数',
    numKey: 'FavShops'
  },
  {
    id: 4,
    name: '加购数',
    numKey: 'Carts'
  }
]

class TabItem extends React.Component {
  static propTypes = {
    activeTab: React.PropTypes.number,
    id: React.PropTypes.number,
    onClick: React.PropTypes.func,
    children: React.PropTypes.element
  };
  render () {
    const conStyle = (id) => {
      var obj = {
        textAlign: 'center',
        backgroundColor: this.props.activeTab === id ? '#fff' : '#ECECEC'
      }
      return obj
    }
    return (
      <div
        className={ this.props.activeTab === this.props.id ? 'ant-tabs-tab-active ant-tabs-tab' : 'ant-tabs-tab'}
        style={conStyle(this.props.id)}
        onClick={() => { this.props.onClick(this.props.id) }}
      >
        <div className='ant-tabs-tab-inner' style={{paddingLeft: '35px', paddingRight: '35px'}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}


export default class RenqiChart extends React.Component {
  static propTypes = {
    getChart: React.PropTypes.func,
    handleModal: React.PropTypes.func,
    handleMeShow: React.PropTypes.func,
    chartItem: React.PropTypes.any,
    display: React.PropTypes.string
  };
  constructor () {
    super()
    this.isMount = false
    this.RenQiChart = false
    this.state = {
      activeTab: 1,
      taskInfo: false,
      xAxis: [],
      uv: [],
      favitems: [],
      carts: [],
      favshops: []
    }
  }
  componentDidMount () {
    this.isMount = true
    this.initChart()
    this.loadChartData()
  }
  componentWillUnmount () {
    this.isMount = false
  }
  loadChartData () {
    const me = this
    me.RenQiChart.showLoading()
    this.props.getChart(this.props.chartItem.renqi_id).then((data) => {
      if (!me.isMount) {
        return
      }
      if (data.msg) {
        Modal.error({
          title: '提示',
          content: data.msg
        })
        return
      }
      return data.res
    }).then((data) => {
      me.RenQiChart.hideLoading()
      me.serializeData(data)
    })
  }
  serializeData (data) {
    const me = this
    if (!this.isMount || !data) {
      return
    }
    var report = data.task_report || data
    /*if (__DEBUG__) {
      let tmlReport = () => {
        var d = []
        for (let i = 1; i < 16; i++) {
          d.push({
            record_on: '2016-06-' + (i < 10 ? '0' + i : i),
            uv: Math.floor(Math.random() * 100),
            favitems: Math.floor(Math.random() * 100),
            carts: Math.floor(Math.random() * 100)
          })
        }
        return d
      }
      report = tmlReport()
    }*/
    let xAxis = []
    let uv = []
    let favitems = []
    let favshops = []
    let Carts = []
    if (report.length > 0) {
      if (this.props.handleMeShow) {
        this.props.handleMeShow()
        me.RenQiChart.dispose()
        if (me.RenQiChart.isDisposed()) {
          me.initChart()
        }
      }
      for (let i = 0; i < report.length; i++) {
        xAxis.push(report[i].record_on)
        uv.push(report[i].uv)
        favitems.push(report[i].favitems)
        Carts.push(report[i].carts)
        favshops.push(report[i].favshops)
      }
    }

    this.setState({
      trans: data.trans,
      taskInfo: data.task_info,
      xAxis: xAxis,
      uv: uv,
      favitems: favitems,
      carts: Carts,
      favshops: favshops
    })
    this.tabsChange(1)
  }
  tabsChange (id) {
    var series = {}
    const me = this
    if (id === 1) {
      series = {
        name: '访客数',
        type: 'line',
        data: me.state.uv
      }
    } else if (id === 2) {
      series = {
        name: '宝贝收藏数',
        type: 'line',
        data: me.state.favitems
      }
    } else if (id === 3) {
      series = {
        name: '店铺收藏数',
        type: 'line',
        data: me.state.favshops
      }
    } else {
      series = {
        name: '加购数',
        type: 'line',
        data: me.state.carts
      }
    }
    this.setState({
      activeTab: id
    })
    me.setChartOptions(series)
  }
  setChartOptions (series) {
    const me = this
    me.RenQiChart.clear()
    me.RenQiChart.setOption({
      grid: {
        left: '1%',
        right: '1%',
        bottom: '1%',
        top: '1.5%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: me.state.xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: series
    })
  }
  initChart () {
    this.RenQiChart = Echarts.init(document.getElementById('renqibaobiao'))
    this.RenQiChart.setOption({})
  }
  renderTrans () {
    return (
      <div>
        <div style={{margin: '15px 0'}}>
          <div style={{display: 'table-cell', verticalAlign: 'top', paddingRight: '15px'}}>
            <img style={{'border': 'solid 1px #e9e9e9', width: '65px', height: '65px'}} src={this.state.trans && this.state.trans.pic}/>
          </div>
          <div style={{display: 'table-cell', verticalAlign: 'top'}}>
            <h3 style={{fontSize: '16px', fontWeight: 'normal', whiteSpace: 'nowrap'}}>{this.state.trans && this.state.trans.title}</h3>
            <div>推广周期：{this.state.trans && this.state.trans.start_on} 到 {this.state.trans && this.state.trans.finished_on}</div>
            <div>推广类别：{this.state.trans && this.state.trans.promote_desc}</div>
          </div>
        </div>
      </div>
    )
  }
  render () {
    const today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    return (
    <div className='panel panel-default panel-xb' style={{display: this.props.display}}>
      <div className='panel-heading'>
        <strong>人气推广历史数据</strong>
        <span className='pull-right' style={{color: '#999'}}>{ today }</span>
      </div>
      <div className='panel-body'>
        <div>
          {
            this.state.trans && this.renderTrans()
          }
          <div className='ant-tabs ant-tabs-card' style={{backgroundColor: '#fff'}}>
            <div className='ant-tabs-bar' style={{backgroundColor: '#fff'}}>
              <div className='ant-tabs-nav-container' style={{height: 'auto'}}>
                <div className='ant-tabs-nav'>
                  {
                    tabs.map((item) => {
                      return (
                        <TabItem
                          id={item.id}
                          key={'tabs' + item.id}
                          activeTab={this.state.activeTab}
                          onClick={this.tabsChange.bind(this)}
                        >
                          <span>
                            {item.name} <br/>
                            {this.state.taskInfo && <strong style={{fontSize: '25px'}}> {this.state.taskInfo[item.numKey]} </strong>}
                          </span>
                        </TabItem>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div>
              <div id='renqibaobiao' style={{height: '250px'}}> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
