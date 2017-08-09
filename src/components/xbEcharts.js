import React, {PropTypes} from 'react'
const Echarts = window.echarts

export class XbEcharts extends React.Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    theme: React.PropTypes.string
  };
  componentDidMount () {
    this.renderEchartDom()
  }
  //update
  componentDidUpdate () {
    this.renderEchartDom()
  }
  //remove
  componentWillUnmount () {
    Echarts.dispose(this.refs.echartsDom)
  }
  renderEchartDom () {
    let echartObj = this.getEchartsInstance()
    //set the echart option
    echartObj.setOption(this.props.option)
    return echartObj
  }
  getEchartsInstance () {
    //return the echart object
    return Echarts.getInstanceByDom(this.refs.echartsDom) || Echarts.init(this.refs.echartsDom, this.props.theme)
  }
  render () {
    let style = this.props.style || {height: '300px'}
    //for render
    return (
        <div ref='echartsDom'
            className={this.props.className}
            style={style} />
    )
  }
}

export default XbEcharts
