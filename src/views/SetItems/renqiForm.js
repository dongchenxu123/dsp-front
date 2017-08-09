/**
 * Created by CY on 2016/6/7.
 */
import React from 'react'

import Button from 'antd/lib/button'
import Alert from 'antd/lib/alert'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'

import LoadingView from 'components/loading'

const Option = Select.Option

export default class RenqiForm extends React.Component {
  static propTypes = {
    handleModal: React.PropTypes.func,
    getPkgs: React.PropTypes.func,
    addPkgs: React.PropTypes.func,
    buyItem: React.PropTypes.string,
    data: React.PropTypes.object,
    isFetching: React.PropTypes.bool
  };
  constructor () {
    super()
    this.state = {
      activePtype: 1,
      activeDays: 14,
      activePkg: null
    }
    this.setAllState = this.setAllState.bind(this)
  }
  componentWillMount () {
    const pkgtypes = this.props.data.pkgtypes
    const pkgdays = this.props.data.pkgdays
    if (pkgtypes.length > 0 && pkgdays.length > 0) {
      this.setAllState(pkgtypes[0], pkgdays[0])
    }
  }
  componentDidMount () {
    const pkgtypes = this.props.data.pkgtypes
    const pkgdays = this.props.data.pkgdays
    if (pkgtypes.length === 0 || pkgdays.length === 0) {
      this.props.getPkgs()
    }
  }
  componentWillReceiveProps (nextProps) {
    const pkgtypes = nextProps.data.pkgtypes
    const pkgdays = nextProps.data.pkgdays
    const pkgs = nextProps.data.pkgs
    if (pkgtypes.length > 0 && pkgdays.length > 0 && !this.state.activePkg) {
      this.setAllState(pkgtypes[0], pkgdays[0], pkgs)
    }
  }
  setAllState (pkgtype, pkgday, pkgs) {
    const pkgKey = pkgtype.id + '_' + pkgday
    this.setState({
      activePtype: parseInt(pkgtype.id, 10),
      activeDays: parseInt(pkgday, 10),
      activePkg: pkgs ? pkgs[pkgKey] : this.props.data.pkgs[pkgKey]
    })
  }
  handleProTypeClick (item) {
    const activeDay = this.props.data.pkgdays[0]
    this.setState({
      activePtype: parseInt(item.id, 10),
      activeDays: parseInt(activeDay, 10),
      activePkg: this.props.data.pkgs[item.id + '_' + activeDay]
    })
  }
  handleSelectChange (v) {
    this.setState({
      activeDays: parseInt(v, 10),
      activePkg: this.props.data.pkgs[this.state.activePtype + '_' + v]
    })
  }
  buyRenqi () {
    const me = this
    const item_id = this.props.buyItem
    const pid = this.state.activePkg.id
    this.props.addPkgs({item_id, pid}).then((data) => {
      if (data.msg) {
        Modal.error({
          title: '提示',
          content: data.msg
        })
        return
      }
      me.props.handleModal()
    })
  }
  renderElement () {
    const me = this
    const pkgtypes = this.props.data.pkgtypes
    const pkgdays = this.props.data.pkgdays
    if (pkgtypes.length === 0 || pkgdays.length === 0) {
      return null
    }
    const activePkg = this.state.activePkg
    //activePkg.uv = '0'
    //activePkg.favshops = '0'
    //activePkg.favitems = '0'
    //activePkg.carts = '0'

    return (
      <div>
        <div style={{margin: '15px 0'}}>
          {
            pkgtypes.map((item) => {
              return (
                <Button key={item.id}
                        type={ parseInt(item.id, 10) === me.state.activePtype ? 'primary' : 'ghost'}
                        onClick={() => { this.handleProTypeClick(item) }}
                        size='large' style={{marginLeft: '5px'}}> {item.name} </Button>
              )
            })
          }
        </div>
        <div style={{margin: '15px 0'}}>
          引流天数
          <Select
            value={this.state.activeDays}
            style={{width: 120, marginLeft: '5px'}} onChange={this.handleSelectChange.bind(this)}>
            {
              this.props.data.pkgdays.map((item) => {
                return (
                  <Option key={item} value={item}>{item}天</Option>
                )
              })
            }
          </Select>
        </div>
                <p style={{color: '#999'}}> <span style={{color: '#333'}}>效果预估 </span> 效果预估根据经验得出，除访问量外的效果数据(收藏、成交等)仅供参考，本公司不做承诺</p>
                <p style={{color: '#999', padding: '8px 0'}}>{activePkg.msg}</p>
                  {activePkg.uv !== '0' && <span>预计访客 <span style={{color: '#CC0000', fontSize: '16px'}}> {activePkg.uv} </span>人，</span>}
                  {activePkg.favshops !== '0' && <span>店铺收藏 <span style={{color: '#CC0000', fontSize: '16px'}}> {activePkg.favshops} </span>个，</span>}
                  {activePkg.favitems !== '0' && <span>宝贝收藏 <span style={{color: '#CC0000', fontSize: '16px'}}> {activePkg.favitems} </span>个，</span>}
                  {activePkg.carts !== '0' && <span>加购物车数 <span style={{color: '#CC0000', fontSize: '16px'}}> {activePkg.carts} </span>个</span>}
                <p style={{margin: '15px 0'}}>优惠价: <span style={{color: '#CC0000', fontSize: '16px'}}> ￥{activePkg.price} </span> <span style={{textDecoration: 'line-through', color: '#999'}}> 原价：{activePkg.orig_price} </span></p>
      </div>
    )
  }
  render () {
    let isFetching = this.props.isFetching
    const pkgdays = this.props.data.pkgdays
    const pkgtypes = this.props.data.pkgtypes
    return (
      <div>
        <Alert
          message='什么是人气升级'
          description='针对投放商品进行站内流量引入，整合优质PC、无线端站内流量资源，帮助商家投放商品，提高站内流量、收藏、加购物车几率，进一步提升站内搜索排名。'
          type='warning' />
        <h3>推广类型 <span style={{color: '#999', fontWeight: 'normal', fontSize: '12px'}}>系统根据选择的不同推广类型匹配相应的站内流量</span></h3>
        {
          isFetching && pkgdays.length === 0 && <LoadingView />
        }
        {
          pkgdays.length > 0 && pkgtypes.length > 0 && this.renderElement()
        }
        <div className='modal-footer' style={{paddingTop: '15px', textAlign: 'right', borderTop: 'solid 1px #e9e9e9'}}>
          <Button type='ghost' onClick={() => this.props.handleModal()}>关闭</Button> &nbsp;
          {
            pkgdays.length === 0
              ? <Button type='primary' disabled>立即购买</Button>
              : <Button type='primary' loading={pkgdays.length > 0 && isFetching} onClick={this.buyRenqi.bind(this)}>立即购买</Button>
          }

        </div>
    </div>
    )
  }
}
