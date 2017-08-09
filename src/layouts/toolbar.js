/**
 * Created by CY on 2016/8/25.
 */
import React from 'react'
import Button from 'antd/lib/button'
const ToolBar = () => {
  return (
    <a href='/logout' style={{position: 'absolute',
      right: '20px',
      lineHeight: '17px',
      margin: '10px 0'
    }} className='btn btn-sm'><Button style={{backgroundColor: '#B71C1C', color: '#fff'}} size='small'>退出</Button>
   </a>
  )
}


export default ToolBar
