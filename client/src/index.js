import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './utilities/serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import './sass/main.sass'

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)

serviceWorker.unregister()
