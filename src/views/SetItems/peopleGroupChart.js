/**
 * Created by CY on 2016/2/29.
 */
import React, { PropTypes } from 'react'

import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'

import AgeChart from '../shopchart/agechart'
import SexChart from '../shopchart/sexchart'
import FocusChart from '../shopchart/focusChart'

export class PeopleGroupChart extends React.Component {
  static propTypes = {
    showPeopleChart: PropTypes.bool.isRequired,
    dataSource: PropTypes.object.isRequired,
    closePeopleChart: PropTypes.func.isRequired
  };
  componentDidMount () {
  }
  componentWillReceiveProps (nextProps) {
  }
  handleOk () {
    this.props.closePeopleChart()
  }
  render () {
    return (
      <Modal title='访问人群画像'
             closable={false}
             visible={this.props.showPeopleChart}
             width='600'
             footer={[
               <Button key='submit' type='primary' size='large' onClick={this.handleOk.bind(this)}>
                关 闭
               </Button>
             ]}
      >
        <div style={{height: '420px', overflowY: 'scroll'}}>
          <SexChart width='12' dataSource={this.props.dataSource.sexdata} />
          <AgeChart width='12' dataSource={this.props.dataSource.agedata}/>
          <FocusChart width='12' dataSource={this.props.dataSource.focusdata} />
        </div>
      </Modal>
    )
  }
}
export default PeopleGroupChart

