/**
 * Created by CY on 2016/1/27.
 */
import React from 'react'

export default class FrameSelection extends React.Component {
  constructor () {
    super()
    this.state = {
      mouseDown: false,
      showMask: false,
      maskLeft: 0,
      maskTop: 0,
      maskWidth: 0,
      maskHeight: 0
    }
  }
  onMouseDownHandler (e) {
    e.stopPropagation()
    var nativeEvt = e.nativeEvent
    this.setState({
      mouseDown: true,
      maskLeft: nativeEvt.offsetX,
      maskTop: nativeEvt.offsetY
    })
  }
  onMouseMoveHandler (e) {
    e.stopPropagation()
    var mouseDown = this.state.mouseDown
    var nativeEvt = e.nativeEvent
    //var newleft = null
   //var newtop = null
    if (mouseDown) {
      //newleft = nativeEvt.offsetX < this.state.maskLeft ? nativeEvt.offsetX : this.state.maskLeft
      this.setState({
        showMask: true,
        //maskLeft: newleft,
        //maskTop: Math.min(nativeEvt.offsetY, this.state.maskTop),
        maskWidth: Math.abs(nativeEvt.offsetX - this.state.maskLeft),
        maskHeight: Math.abs(nativeEvt.offsetY - this.state.maskTop)
      })
    }
  }
  onMouseUpHandler (event) {
    this.setState({
      mouseDown: false,
      mouseMove: false,
      showMask: false,
      maskLeft: 0,
      maskTop: 0,
      maskWidth: 0,
      maskHeight: 0
    })
  }
  render () {
    var selectmask = {
      'position': 'absolute',
      'fontSize': '0px',
      'margin': '0px',
      'padding': '0px',
      'border': '1px dashed #0099FF',
      'backgroundColor': '#C3D5ED',
      'zIndex': '1000',
      'filter': 'alpha(opacity:60)',
      'opacity': '0.6',
      'display': this.state.showMask ? 'block' : 'none',
      'left': this.state.maskLeft,
      'top': this.state.maskTop,
      'width': this.state.maskWidth,
      'height': this.state.maskHeight
    }
    var containerMask = {
      'position': 'relative',
      'height': '200px',
      'backgroundColor': '#ddd'
    }
    return (
      <div>
        <div
          onMouseDown={this.onMouseDownHandler.bind(this) }
          onMouseMove={this.onMouseMoveHandler.bind(this)}
          onMouseUp={this.onMouseUpHandler.bind(this)}
          style={containerMask}
          ref='maskContainer'
        >
          <div className='selectmask' style={selectmask}></div>
        </div>
      </div>
    )
  }
}

export default FrameSelection
