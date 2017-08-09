/**
 * Created by CY on 2016/5/17.
 */
import React, {PropTypes} from 'react'
import Checkbox from 'antd/lib/checkbox'
import Button from 'antd/lib/button'
import Alert from 'antd/lib/alert'
class LocationsView extends React.Component {
  static propTypes = {
    option: PropTypes.object
  };
  constructor () {
    super()
    this.state = {
      select: [],
      allChecked: false
    }
  }
  componentWillMount () {
    const regions = this.props.option.regions
    console.log(regions)
    let select = this.props.option.select.slice()
    let obj = {}
    for (let j = 0; j < regions.length; j++) {
      let data = regions[j].data
      for (let i = 0; i < select[i]; i++) {
        if (data.indexOf(select[i]) > -1) {
          obj['r' + regions[j].id] = (obj['r' + regions[j].id] || 0) + 1
        }
      }
    }
    obj.select = select
    this.setState(obj)
    console.log(obj)
  }
  componentDidMount () {
    if (!this.state.select.length) {
      this.onGroupAllChange(true)
    }
  }
  onCheckboxChange (bool, id, gid) {
    //console.log(bool, id)
    var select = this.state.select
    var region = this.state['r' + gid] || 0
    if (bool) {
      this.setState({
        select: [...select.slice(), id],
        ['r' + gid]: region + 1
      })
    } else {
      let index = select.indexOf(id)
      this.setState({
        select: [...select.slice(0, index), ...select.slice(index + 1)],
        ['r' + gid]: (region - 1) <= 0 ? 0 : region - 1
      })
    }
  }
  onGroupCheckboxChange (checked, gid) {
    var data = this.props.option.regions
    // console.log(data)
    const select = this.state.select
    var changeItem = data.filter((item) => {
      return item.id === gid
    })
    var region = this.state['r' + gid] || 0
    if (checked) {
      let tmparr = []
      for (let j = 0; j < changeItem[0].data.length; j++) {
        if (select.indexOf(changeItem[0].data[j]) === -1) {
          tmparr.push(changeItem[0].data[j])
        }
      }
      this.setState({
        select: this.state.select.concat(tmparr),
        ['r' + gid]: changeItem[0].data.length
      })
    } else {
      let newselect = select.slice()
      for (let m = 0; m < changeItem[0].data.length; m++) {
        if (newselect.indexOf(changeItem[0].data[m]) > -1) {
          var index = newselect.indexOf(changeItem[0].data[m])
          newselect.splice(index, 1)
          region = region - 1
        }
      }
      this.setState({
        select: newselect,
        ['r' + gid]: 0
      })
    }
  }
  onGroupAllChange (bool) {
    const select = this.state.select
    const regions = this.props.option.regions
    if (bool) {
      let newselect = select.slice()
      for (let key in this.props.option.locations) {
        if (select.indexOf(key) === -1) {
          newselect.push(key)
        }
      }
      this.setState({
        select: newselect,
        allChecked: true,
        r1: regions[0].data.length,
        r2: regions[1].data.length,
        r3: regions[2].data.length,
        r4: regions[3].data.length,
        r5: regions[4].data.length,
        r6: regions[5].data.length,
        r7: regions[6].data.length
      })
    } else {
      this.setState({
        allChecked: false,
        select: [],
        r1: 0,
        r2: 0,
        r3: 0,
        r4: 0,
        r5: 0,
        r6: 0,
        r7: 0
      })
    }
  }
  render () {
    const self = this
    const select = self.state.select
    return (
      <div>
        <div className='ant-checkbox-group' style={{lineHeight: '30px', padding: '0 5px', borderBottom: 'solid 1px #F4F7F9'}}>
          <label style={{marginRight: '25px'}}>
            <Checkbox
                      checked={this.state.allChecked}
                      onChange={(e) => { this.onGroupAllChange(e.target.checked) }}
                      defaultChecked={this.state.allChecked}
            >中国
            </Checkbox>
          </label>
        </div>
        {
          this.props.option.regions.map((item, index) => {
            var data = item.data
            var newData = data.map((item) => {
              return self.props.option.locations[item]
            })
            // console.log(newData)
            return (
              <div key={item.id} className='ant-checkbox-group' style={{lineHeight: '30px', backgroundColor: index % 2 === 0 ? '#fbfbfb' : '#fff', padding: '0 5px', borderBottom: 'solid 1px #F4F7F9'}}>
                  <label style={{marginRight: '25px'}}>
                    <Checkbox
                      checked={this.state['r' + item.id] && this.state['r' + item.id] === data.length }
                      onChange={(e) => { this.onGroupCheckboxChange(e.target.checked, item.id) }}
                    >
                      {item.name}:
                    </Checkbox>
                  </label>
                  {
                    newData.map((subItem) => {
                      return (
                        <label key={subItem.id} style={{marginRight: '30px'}}>
                           <Checkbox
                             onChange={(e) => { this.onCheckboxChange(e.target.checked, subItem.id, item.id) }}
                             defaultChecked={ select.indexOf(subItem.id) > -1 }
                             checked={select.indexOf(subItem.id) > -1}
                           >
                           {subItem.name}
                           </Checkbox>
                        </label>
                      )
                    })
                  }
              </div>
            )
          })
        }
        <div style={{lineHeight: '30px', padding: '0 5px'}}>
          <label style={{marginRight: '25px'}}>
             <Checkbox
               defaultChecked={false} disabled
             >
             港澳台地区:
             </Checkbox>
          </label>
          <label style={{marginRight: '30px'}}>
             <Checkbox
               defaultChecked={false} disabled
             >
             台湾
             </Checkbox>
          </label>
          <label style={{marginRight: '30px'}}>
             <Checkbox
               defaultChecked={false} disabled
             >
             香港
             </Checkbox>
          </label>
          <label style={{marginRight: '30px'}}>
             <Checkbox
               defaultChecked={false} disabled
             >
             澳门
             </Checkbox>
          </label>
        </div>
        <Alert message='港澳台地区暂无流量资源' type='warning' showIcon />
        <div style={{padding: '10px 18px 10px 10px', textAlign: 'right', borderTop: '1px solid #e9e9e9'}}>
            <Button size='large' type='ghost' onClick={ () => { this.props.option.showLoactionSelection() } }>取消</Button>
            <Button style={{marginLeft: '8px'}} onClick={ () => { this.props.option.setLocation(this.state.select) } } size='large' type='primary'>确定</Button>
        </div>
      </div>
    )
  }
}

export default LocationsView
