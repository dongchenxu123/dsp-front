import React, {PropTypes} from 'react'
import Checkbox from 'antd/lib/checkbox'
import Button from 'antd/lib/button'
import InputNumber from 'antd/lib/input-number'

class PeopleTagsView extends React.Component {
  static propTypes = {
    tags: PropTypes.object
  };
  constructor () {
    super()
    this.state = {
      select: [],
      bidraio: 100,
      allChecked: false,
      all_cates: []
    }
    //this.bidRatioOnChange = this.bidRatioOnChange.bind(this)
    this.checkSendValue = this.checkSendValue.bind(this)
    //this.onAllClickChange = this.onAllClickChange.bind(this)
  }
  componentWillMount () {
    this.setState({
      select: this.props.tags.user_cates,
      all_cates: this.props.tags.all_cates
    })
  }
  componentDidMount () {
    //if (this.state.select.length === 0) {
    //this.onAllClickChange(true)
    //}
    const select = this.state.select
    let all_cates = this.state.all_cates
    if (all_cates) {
      for (var j = 0; j < all_cates.length; j++) {
        all_cates[j].key = j
        if (!all_cates[j].price) {
          all_cates[j].price = 100
        }
        if (select.length > 0) {
          for (var i = 0; i < select.length; i++) {
            if (parseInt(select[i].cate_id, 10) === parseInt(all_cates[j].id, 10)) {
              all_cates[j].price = select[i].price
              break
            }
          }
        }
      }
    }
    this.setState({
      all_cates: all_cates
    })
  }
  onClickChange (checked, id) {
    const select = this.state.select
    const bidraio = this.state.bidraio
    let newselect
    if (checked) {
      newselect = [...select, {cate_id: parseInt(id, 10), price: bidraio}]
    } else {
      var newArr = []
      for (var i = 0; i < select.length; i++) {
        newArr.push(select[i].cate_id)
      }
      let idx = newArr.indexOf(parseInt(id, 10))
      newselect = [...select.slice(0, idx), ...select.slice(idx + 1)]
    }
    this.setState({
      select: newselect
    })
  }
  /*onAllClickChange (bool) {
    var all_cates = this.state.all_cates
    let select = this.state.select
    if (bool) {
      this.setState({
        allChecked: true,
        select: all_cates
      })
    } else {
      this.setState({
        allChecked: false,
        select: []
      })
    }
  }*/
  bidRatioOnChange (id, value) {
    var select = this.state.select
    for (var i = 0; i < select.length; i++) {
      if (parseInt(select[i].cate_id, 10) === parseInt(id, 10)) {
        select[i].price = value
      }
    }
  }
  checkSendValue () {
    this.props.tags.setPeopleTags({
      categories: this.state.select
    })
  }
   render () {
     const tagsname = this.state.all_cates ? this.state.all_cates : this.props.tags.all_cates
     const self = this
     const select = self.state.select
     var newselcetId = []
     if (select) {
       for (var i = 0; i < select.length; i++) {
         if (select[i].cate_id) {
           newselcetId.push(select[i].cate_id)
         } else {
           newselcetId.push(select[i].id)
         }
       }
     }
     return (
       <div>
          {/*<div>
              <Checkbox
                  defaultChecked={this.state.allChecked}
                  onChange={(e) => { this.onAllClickChange(e.target.checked) }}
                  checked={this.state.allChecked}
                 >
                  全选
              </Checkbox>
          </div>*/}
          {tagsname ? tagsname.map((item, index) => {
            return (
                  <div key={item.key + item.name}>
                    <Checkbox
                        style={{lineHeight: '35px', marginRight: 8}}
                        onChange={ (e) => { this.onClickChange(e.target.checked, item.id) } }
                        defaultChecked={newselcetId.indexOf(parseInt(item.id, 10)) > -1}
                        checked={newselcetId.indexOf(parseInt(item.id, 10)) > -1}
                      >
                        {item.name}
                        <div style={{margin: '16px', display: 'inline', textAlign: 'right'}} >
                            设置溢价: <InputNumber min={100} max={200} defaultValue={item.price} onChange={this.bidRatioOnChange.bind(this, item.id)}/>&nbsp;% <br/>
                        </div>
                    </Checkbox>

                  </div>
               )
          })
            : null
          }
          {/*<div style={{margin: '16px 0'}}>
              设置溢价: <InputNumber min={100} max={200} onChange={this.bidRatioOnChange} defaultValue={this.state.bidratio} />&nbsp;% <br/>
            <span style={{color: '#999'}}>对所选人群做价格调整，最小100%，最大200%</span>
          </div>*/}
          <div style={{padding: '20px 18px 10px 10px', textAlign: 'right', borderTop: '1px solid #e9e9e9'}}>
              <Button size='large' type='ghost' onClick={ () => { this.props.tags.showPeopleTagsSelection() } }>取消</Button>
              <Button style={{marginLeft: '8px'}} onClick={this.checkSendValue } size='large' type='primary'>确定</Button>
          </div>
       </div>
     )
   }
}

export default PeopleTagsView
