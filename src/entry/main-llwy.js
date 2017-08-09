import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { useRouterHistory } from 'react-router'
//import { createHistory } from 'history'
import { createHashHistory } from 'history'
import Root from '../containers/Root'
import configureStore from '../redux/configureStore'
import '../styles/index-ant.less'

import routes from '../routes/llwy'

const historyConfig = { basename: __BASENAME__, queryKey: false }
const history = useRouterHistory(createHashHistory)(historyConfig)
const initialState = window.__INITIAL_STATE__

const store = configureStore({ initialState, history })

window.isBackbone = true
if (__DEBUG__) {
  window.ga = (parms) => {
    //console.log(parms)
  }
}

history.listen(function (location) {
  if (window.ga) {
    //location.action === 'POP' &&
    //console.log('send ga')
    window.ga('send', {
      'hitType': 'pageview',
      'page': window.location.pathname + window.location.search + window.location.hash,
      'title': window.document.title
    })
  }
})
ReactDOM.render(
  <Root history={history} routes={routes(store)} store={store} />,
  document.getElementById('root')
)
