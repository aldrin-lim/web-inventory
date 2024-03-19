import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from 'contexts/AuthContext.tsx'
import Big from 'big.js'
import { Analytics } from 'util/analytics.ts'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import ErrorBoundary from 'components/ErrorBoundary.tsx'

import { registerSW } from 'virtual:pwa-register'
import ReloadPrompt from 'components/ReloadPrompt/index.tsx'

Big.DP = 4

Analytics.init()

const updateSW = registerSW({})

updateSW()

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }}
      >
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <QueryClientProvider client={queryClient}>
              <Router>
                <App />
              </Router>
            </QueryClientProvider>
          </LocalizationProvider>
        </AuthProvider>
      </Auth0Provider>
      <ReloadPrompt />
    </ErrorBoundary>
  </React.StrictMode>,
)
