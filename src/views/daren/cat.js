/**
 * Created by CY on 2016/6/24.
 */
import React, { PropTypes } from 'react'
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

class CatMenuView extends React.Component {
  onChange (e) {
    //console.log(`radio checked:${e.target.value}`)
    this.props.onChange(e.target.value)
  }
  render () {
    const catStyle = {
      border: 'none',
      height: 44,
      lineHeight: '44px',
      borderRadius: 0,
      fontSize: 14,
      boxShadow: '0px 0 0 0'
    }
    return (
      <div style={{backgroundColor: '#fff', borderBottom: 'solid 1px #eee'}}>
        <RadioGroup onChange={this.onChange.bind(this)} defaultValue='0'>
          <RadioButton style={catStyle} value='0' key={'c0'}>ALL</RadioButton>
          {
            this.props.data.map((item) => {
              return <RadioButton style={catStyle} value={item.category_id} key={'c' + item.category_id}>{item.name}</RadioButton>
            })
          }
        </RadioGroup>
      </div>
    )
  }
}
CatMenuView.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.array
}

export default CatMenuView
