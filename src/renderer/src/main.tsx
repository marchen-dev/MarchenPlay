import './styles/main.css'

import { ClickToComponent } from 'click-to-react-component'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { initializeApp } from './lib/init'
import { reactRouter } from './router'

initializeApp()

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <>
    <RouterProvider router={reactRouter} />
    <ClickToComponent />
  </>,
)
