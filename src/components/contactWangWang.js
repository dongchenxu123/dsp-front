/**
 * Created by CY on 2016/8/23.
 */
import React from 'react'
const ContactWangWang = ({wws}) => {
  return (
    <ul style={{marginBottom: 16}}>
      {
        wws.map(ww => {
          return (
            <li style={{margin: '8px 0'}} key={ww.name + ww.id}>{ww.name}: {ww.link()}</li>
          )
        })
      }
    </ul>
  )
}


export default ContactWangWang
