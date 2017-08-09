/**
 * Created by CY on 2016/1/25.
 */
import React, {PropTypes} from 'react'

export default class EditInline extends React.Component {
  componentDidMount () {
    this.refs.sendEl.focus()
  }
  submitHandler () {
    var sendvalue = this.refs.sendEl.value
    this.props.sendvalue(sendvalue)
  }
  render () {
    var props = this.props
    return (
      <div className='text-center ant-input-group' style={{margin: '0 auto', width: '80%'}}>
        <span>
          <input type='text' defaultValue={props.defaultValue} ref='sendEl' className='ant-input' name='sendEl' onBlur={props.blur}/>
        </span>
        <div className='ant-input-group-wrap'>
          <button className='ant-btn ant-btn-primary' onClick={ this.submitHandler.bind(this) } style={{borderBottomLeftRadius: 0, borderTopLeftRadius: 0}}>确定</button>
        </div>
      </div>
    )
  }
}
EditInline.propTypes = {
  blur: PropTypes.func.isRequired,
  sendvalue: PropTypes.func.isRequired
}
export default EditInline
