/**
 * Created by CY on 2016/1/19.
 */
import React, { PropTypes } from 'react'
import { companySet } from 'help/companySetting'

const companyData = companySet[__TARGETAGENCY__]

function HomeLayout ({ children }) {
  return (
    <div className='home' style={{backgroundColor: '#fff'}}>
      <div style={{backgroundColor: '#D52D2D'}}>
        <div className='container' >
          {
            companyData.phone ? <a style={{color: '#fff', lineHeight: '30px'}} href={'tel:' + companyData.phone}>电话：{companyData.phone}</a> : null
          }
        </div>
      </div>
        {children}
    </div>
  )
}

HomeLayout.propTypes = {
  children: PropTypes.element
}

export default HomeLayout
