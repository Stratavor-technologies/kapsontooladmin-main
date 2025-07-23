import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CFormCheck,
} from '@coreui/react'
import { IconButton } from '@mui/material'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import mainlogo from '../../../assets/images/MainLogo.png'
import { postRequest } from '../../../Services/apiMethods'
import Cookies from 'js-cookie'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Load saved credentials from cookies on component mount
  useEffect(() => {
    const savedEmail = Cookies.get('rememberedEmail')
    const savedPassword = Cookies.get('rememberedPassword')
    if (savedEmail && savedPassword) {
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await postRequest('/auths/login', {
        username: email,
        password: password,
        authMethod: 'email',
        verificationType: 'password',
      })
      console.log('response', response)

      if (response.data.session.accessToken) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.session.accessToken)
        // Store user data if available
        if (response.data.id) {
          localStorage.setItem('id', JSON.stringify(response.data.id))
        }
        if (response.data.role) {
          // Store role without JSON.stringify to ensure it's stored as "ADMIN"
          localStorage.setItem('role', response.data.role)
        }

        // Handle remember me functionality
        if (rememberMe) {
          // Set cookies to expire in 30 days
          Cookies.set('rememberedEmail', email, { expires: 30 })
          Cookies.set('rememberedPassword', password, { expires: 30 })
        } else {
          // Remove cookies if remember me is not checked
          Cookies.remove('rememberedEmail')
          Cookies.remove('rememberedPassword')
        }

        navigate('/dashboard')
      } else {
        setError('Invalid response from server')
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <CInputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer', color: 'black' }}
                      >
                        <IconButton style={{ height: '24px', width: '24px' }}>
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </CInputGroupText>
                    </CInputGroup>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormCheck
                          label="Remember me"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={loading}>
                          {loading ? <CSpinner size="sm" /> : 'Login'}
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right text-primary">
                        <CButton
                          color=""
                          className="px-0 text-primary"
                          onClick={() => navigate('/auth/forgot-password')}
                        >
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white py-5" style={{ width: '44%', backgroundColor: 'gray' }}>
                {/* <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody> */}
                <img src={mainlogo} alt="login" />
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
