import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ForgotPassword = React.lazy(() => import('./views/pages/login/ForgotPassword'))
const VerifyOTP = React.lazy(() => import('./views/pages/login/VerifyOTP'))
const ResetPassword = React.lazy(() => import('./views/pages/login/ResetPassword'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  // const storedTheme = useSelector((state) => state.theme)

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.href.split('?')[1])
  //   const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
  //   if (theme) {
  //     setColorMode(theme)
  //   }

  //   if (isColorModeSet()) {
  //     return
  //   }

  //   setColorMode(storedTheme)
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route
            exact
            path="/auth/forgot-password"
            name="Forgot Password"
            element={<ForgotPassword />}
          />
          <Route exact path="/auth/verify-otp" name="Verify OTP" element={<VerifyOTP />} />
          <Route
            exact
            path="/auth/reset-password"
            name="Reset Password"
            element={<ResetPassword />}
          />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
