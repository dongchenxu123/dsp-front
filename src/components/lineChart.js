/**
 * Created by CY on 2016/2/18.
 */
import React from 'react'
const Echarts = window.echarts

let charCloudOption = {
  title: {
    text: '点击量&花费',
    textStyle: {
      color: '#333',
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: 50,
    right: 20
  },
  legend: {
    data: ['点击量', '花费']
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {},
      dataView: {readOnly: false},
      magicType: {type: ['line', 'bar']},
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '点击量',
      type: 'line',
      data: []
    },
    {
      name: '花费',
      type: 'line',
      data: []
    }
  ]
}
let mychart = null
export class LineChart extends React.Component {
  static propTypes = {
    //dataSource: PropTypes.object.isRequired
  };
  componentDidMount () {
    mychart = Echarts.init(document.getElementById('linechart'))
    mychart.setOption(charCloudOption)
  }
  updateChart (clicks = [], cost = [], recordOn = []) {
    charCloudOption.series[0].data = clicks
    charCloudOption.series[1].data = cost
    charCloudOption.xAxis[0].data = recordOn
    mychart.setOption(charCloudOption)
  }
  componentWillReceiveProps (nextProps) {
    let clicks = []
    let cost = []
    let recordOn = []
    if (nextProps.dataSource && nextProps.dataSource.length > 0) {
      const datasource = nextProps.dataSource
      var data = [].concat(datasource).reverse()
      for (var i = 0; i < data.length; i++) {
        if (data[i].record_on === '') {
          continue
        }
        clicks.push(data[i].click)
        cost.push(data[i].cost)
        recordOn.push(data[i].record_on)
      }
      this.updateChart(clicks, cost, recordOn)
    } else {
      this.updateChart(clicks, cost, recordOn)
    }
  }
  render () {
    return (
      <div style={{height: '400px'}} className='linechart' id='linechart'></div>
    )
  }
}

export default LineChart
