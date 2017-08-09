/**
 * Created by CY on 2016/4/27.
 */
import React, {PropTypes} from 'react'
import Modal from 'antd/lib/modal'
import { connect } from 'react-redux'

//import {TagCloud} from './tagCloud'
import PeopleTagsView from './peopleTgs'
import BidSettingView from './bidSetingView'
//import PeopleGroupChartView from 'views/SetItems/peopleGroupChart'
import TimeSelectionView from './timeSelection'
import LoadingView from './loading'

import LocationsView from './locations'

import { actions as loadActions } from '../redux/bidseting/setingAction'
function changeDayItem (arr, select) {
  var newArr = arr.map((item) => {
    return [item[0], select, item[2]]
  })
  return newArr
}
class SettingContainer extends React.Component {
  static propTypes = {
    setBudgetAction: PropTypes.func,
    chengeSelectItem: PropTypes.func,
    selectAllDayHours: PropTypes.func,
    SetTargetHoursSetting: PropTypes.func,
    GetTargetHoursSetting: PropTypes.func,
    userShopChart: PropTypes.object,
    locations: PropTypes.object,
    store: PropTypes.object,
    setCPCAction: PropTypes.func,
    setLocationsAction: PropTypes.func,
    setPeopleTagsAction: PropTypes.func,
    getLocationsAction: PropTypes.func,
    GetPeopleTagsSetting: PropTypes.func
  };
  constructor () {
    super()
    this.state = {
      timeSeleting: false,
      locationSelecting: false,
      showPeopleBool: false,
      dayHours: [],
      categories: []
    }
  }
  componentDidMount () {
    this.props.GetTargetHoursSetting(this.props.option.appid)
    if (this.props.locations.regions.length === 0) {
      this.props.getLocationsAction()
    }
    this.props.GetPeopleTagsSetting(this.props.option.appid)
  }
  componentWillReceiveProps (nextProps) {
    const dayhours = nextProps.option.setingData.dayHours
    if (dayhours.length > 0) {
      this.setState({
        dayHours: dayhours
      })
    }
  }
  setBudget (num) {
    this.props.setBudgetAction({budget: num, campaign_type: this.props.option.appid})
      .then((data) => {
        if (data.msg) {
          Modal.error({
            title: '提示',
            content: data.msg
          })
        }
      })
  }
  setCpc (num) {
    this.props.setCPCAction({cpc: num, campaign_type: this.props.option.appid})
      .then((data) => {
        if (data.msg) {
          Modal.error({
            title: '提示',
            content: data.msg
          })
        }
      })
  }
  showTimeSelection () {
    this.setState({
      timeSeleting: !this.state.timeSeleting,
      dayHours: this.props.option.setingData.dayHours
    })
  }
  showLocationHandler () {
    let bool = this.state.locationSelecting
    this.setState({
      locationSelecting: !bool
    })
  }
  setLocationHandler (data) {
    const self = this
    if (data.length === 0) {
      Modal.error({
        title: '提示',
        content: '请选择投放地域'
      })
      return
    }
    this.props.setLocationsAction({
      campaign_type: self.props.option.appid,
      locations: data.join(',')
    }).then((data) => {
      if (data.msg) {
        Modal.error({
          title: '提示',
          content: data.msg
        })
      }
      this.showLocationHandler()
    }).catch(() => {
      Modal.error({
        title: '提示',
        content: '稍后重试'
      })
    })
  }
  showPeopleChart () {
    var bool = this.state.showPeopleBool
    this.setState({
      showPeopleBool: !bool
    })
  }
  setPeopleTagsHeader (data) {
    const self = this
    if (!data.categories) {
      Modal.error({
        title: '提示',
        content: '请选择投放优质人群'
      })
      return
    }
    this.props.setPeopleTagsAction({
      campaign_type: self.props.option.appid,
      categories: JSON.stringify(data.categories)
    }).then((data) => {
      if (data.msg) {
        Modal.error({
          title: '提示',
          content: data.msg
        })
      }
      this.showPeopleChart()
    }).catch(() => {
      Modal.error({
        title: '提示',
        content: '稍后重试'
      })
    })
  }
  timeItemClick (dindex, hindex) {
    const obj = this.state.dayHours[dindex][hindex]
    const timeItem = [obj[0], obj[1] === 1 ? 0 : 1, obj[2]]
    const changeDay = this.state.dayHours[dindex]
    const dn = [...changeDay.slice(0, hindex), timeItem, ...changeDay.slice(hindex + 1)]

    const hours = {dayHours: [...this.state.dayHours.slice(0, dindex),
      dn,
      ...this.state.dayHours.slice(dindex + 1)]}
    this.setState(hours)
  }
  selectAllDays (dayArray) {
    let hours = this.state.dayHours
    let newHours = []
    const len = dayArray.length
    if (len === 2) {
      for (let i = 0; i < hours.length; i++) {
        if (i === 0 || i === 6) {
          newHours[i] = changeDayItem(hours[i], 1)
        } else {
          newHours[i] = changeDayItem(hours[i], 0)
        }
      }
    }
    if (len === 5) {
      for (var j = 0; j < hours.length; j++) {
        if (j > 0 && j < 6) {
          newHours[j] = changeDayItem(hours[j], 1)
        } else {
          newHours[j] = changeDayItem(hours[j], 0)
        }
      }
    }
    if (len === 7) {
      for (let i = 0; i < len; i++) {
        var index = dayArray[i]
        newHours[index] = changeDayItem(hours[index], 1)
      }
    }

    //const newHours = [...hours.slice(0)]
    this.setState({
      dayHours: newHours
    })
  }
  saveTimeSetting () {
    const self = this
    const campaign_type = this.props.option.appid
    const data = this.state.dayHours
    const hours = {
      d0: data[0],
      d1: data[1],
      d2: data[2],
      d3: data[3],
      d4: data[4],
      d5: data[5],
      d6: data[6]
    }
    this.props.SetTargetHoursSetting({
      campaign_type, hours
    }).then(data => {
      if (data.msg) {
        Modal.error({
          title: '提示',
          content: data.msg
        })
        return
      }
      self.showTimeSelection()
    })
  }
  renderTimeModal () {
    const self = this
    const timeData = this.state.dayHours
    const option = {
      timeItemClick: self.timeItemClick.bind(self),
      allSelected: self.selectAllDays.bind(self)
    }
    return (
      <Modal
        title='选择投放时间段' width={750}
        visible={this.state.timeSeleting}
        onCancel={this.showTimeSelection.bind(this)}
        onOk={this.saveTimeSetting.bind(this)}
      >{
       timeData.length > 0 ? <TimeSelectionView ref='timeSelect' timedata={timeData} option={option} /> : '没有数据'
      }
      </Modal>
    )
  }
  renderTagCloud () {
    //const sexdata = this.props.userShopChart.sexChart
    //const agedata = this.props.userShopChart.ageChart
    //const focusdata = this.props.userShopChart.focusChart
    const campaign_type = this.props.option.appid
    let tagsData = {
      0: this.props.store.setitems,
      1: this.props.store.shoptrans,
      3: this.props.store.mobile
    }
    let curTags = tagsData[campaign_type]
    const option = {
      all_cates: curTags.settings.tags,
      user_cates: curTags.settings.userCates,
      bidratio: curTags.settings.catePrice,
      showPeopleTagsSelection: this.showPeopleChart.bind(this),
      setPeopleTags: this.setPeopleTagsHeader.bind(this)
    }
    const tagdata = option.tagdata

    /*if (sexdata && sexdata.value && sexdata.value.length > 0) {
      return <PeopleGroupChartView closePeopleChart={this.showPeopleChart.bind(this)} showPeopleChart={this.state.showPeopleBool} dataSource={{sexdata, agedata, focusdata}} />
    }*/
    //if (this.props.option.tagCloud) {
    return (
      <Modal
        title='投放优质人群'
        visible={this.state.showPeopleBool}
        footer={[null]}
        className='nofooterModal'
        onCancel={this.showPeopleChart.bind(this)}>
        {
            tagdata !== null ? <PeopleTagsView tags={option}/> : <p>没有数据</p>
        }
      </Modal>
    )
    //}
    /*return (
      <Modal title='人群画像' visible={this.state.showPeopleBool}
            onCancel={this.showPeopleChart.bind(this)} onOk={this.showPeopleChart.bind(this)}>
        <p>没有数据</p>
      </Modal>
    )*/
  }
  renderLocationsModal () {
    const select = this.props.option.setingData.locations
    let sArr = select && select.split(',')
    if (!select) {
      sArr = []
    }
    const option = {
      locations: this.props.locations.locations,
      regions: this.props.locations.regions,
      showLoactionSelection: this.showLocationHandler.bind(this),
      setLocation: this.setLocationHandler.bind(this),
      select: sArr
    }
    return (
      <Modal
        title='选择投放地域' width={750}
        visible={this.state.locationSelecting}
        onCancel={this.showLocationHandler.bind(this)}
        footer={[null]}
        className='nofooterModal'
      >
       {
         option.regions.length === 0 ? <LoadingView /> : <LocationsView option={option} />
       }
      </Modal>
    )
  }
  render () {
    return (
      <div>
        <BidSettingView
          title={this.props.option.title}
          bidSetingData={this.props.option.setingData}
          url={this.props.option.url}
          setBudget={this.setBudget.bind(this)}
          setCpc={this.setCpc.bind(this)}
          showTimeSelection={this.showTimeSelection.bind(this)}
          showPeopleChart={this.showPeopleChart.bind(this)}
          appid={this.props.option.appid}
          showLoactionSelection={this.showLocationHandler.bind(this)}
        />
        {
          this.state.timeSeleting
            ? this.renderTimeModal()
            : null
        }
        {
          this.state.locationSelecting
            ? this.renderLocationsModal()
            : null
        }
        {
          this.state.showPeopleBool
            ? this.renderTagCloud()
            : null
        }
      </div>
    )
  }
}

SettingContainer.propTypes = {
  option: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  userShopChart: state.userShopChart,
  store: state,
  locations: state.auth.locations
})
export default connect(mapStateToProps, loadActions)(SettingContainer)
