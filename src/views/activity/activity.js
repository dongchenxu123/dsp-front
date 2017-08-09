/**
 * Created by CY on 2016/2/18.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { actions as loadItemsActions } from '../../redux/activity/activityAction'
import Pagination from 'antd/lib/pagination'
import LoadingView from 'components/loading'
import ActivityListItem from './activityListItem'
import NoDataView from 'views/share/nodata'

import UnionItemView from 'views/activity/union/unionItem'

const pageSize = 6

const mapStateToProps = (state) => ({
  activity: state.activity
})
export class ActivityView extends React.Component {
  static propTypes = {
    loadActivityItemsAction: PropTypes.func.isRequired,
    loadUnionActivitysAction: PropTypes.func.isRequired,
    joinActivityItemsAction: PropTypes.func.isRequired,
    loadActivityDetailAction: PropTypes.func.isRequired,
    activity: PropTypes.object.isRequired
  };
  constructor () {
    super()
    this.state = {
      page: 1
    }
  }
  componentDidMount () {
    document.title = '报活动'
    //var data = this.props.activity.items['0']
    //if (!data) {
    this.props.loadActivityItemsAction(1).then(() => {
      return this.props.loadUnionActivitysAction()
    })
   //}
  }
  onPageChange (page) {
    this.setState({page})
  }
  renderActivityItem () {
    const {unionlist, uniondata, items} = this.props.activity
    let alldata = []
    if (unionlist.length > 0) {
      alldata = [uniondata[unionlist[0]]].concat(items)
    } else {
      alldata = items
    }
    if (!alldata) { return }
    if (alldata && alldata.length === 0) {
      return NoDataView()
    }
    var data = alldata.slice((this.state.page - 1) * pageSize, this.state.page * pageSize)
    return data.map((item, i) => {
      if (item.activty_type && item.activty_type === 'union') {
        return (
          <UnionItemView key={'union' + item.id} data={item} />
        )
      }
      return (
          <ActivityListItem
            dataSource={item}
            key={item.id}
            joinActivity={this.props.joinActivityItemsAction}
            detailActivity={this.props.loadActivityDetailAction}
            detailFetching={this.props.activity.detailFetching}
          />
      )
    })
  }
  renderPage () {
    const data = this.props.activity.items
    const len = data.length + 1
    return (<div className='margin10'><Pagination defaultCurrent={1} current={this.state.page} total={len} pageSize={6} onChange={this.onPageChange.bind(this)} /></div>)
  }
  render () {
    const activity = this.props.activity
    return (
      <div style={{padding: '15px 0'}}>
        <div className='clearfix'>

            {
              activity.isFetching ? <LoadingView /> : this.renderActivityItem()
            }
        </div>
        {
          activity.isFetching ? '' : this.renderPage()
        }
      </div>
    )
  }
}
export default connect(mapStateToProps, loadItemsActions)(ActivityView)
