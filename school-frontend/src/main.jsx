import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import './styles/design-system.css'
import './styles/global.css'

import { ToastProvider } from './components/ui/Toast.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Setup Laravel Echo for Real-Time Sync
window.Pusher = Pusher
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'edusaas-pusher-key',
  cluster: 'mt1',
  forceTLS: true
})

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
