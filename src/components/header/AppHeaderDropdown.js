import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CButton,
  CSpinner,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { postRequest, putRequest } from '../../Services/apiMethods'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { IconButton } from '@mui/material'
import { getRequest } from '../../Services/apiMethods'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')


  const handleLogout = () => {
    // Clear all items from localStorage
    localStorage.clear()
    // Redirect to login page
    navigate('/login')
  }
  const getProfilePicture = async () => {
    const token = localStorage.getItem('token')
    const id = JSON.parse(localStorage.getItem('id'))
    const response = await getRequest(`users/${id}`, token)
    // return response.data.imgUrl
    // console.log(response.data.imgUrl)
    setProfilePicture(response.data.imgUrl)
  }
  useEffect(() => {
    getProfilePicture()
  }, [])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validate passwords
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match')
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long')
      }

      const id = JSON.parse(localStorage.getItem('id'))
      console.log(id)

      const response = await putRequest(`auths/updatePassword/${id}`, {
        password: oldPassword,
        newPassword: newPassword,
      })

      if (response.isSuccess) {
        setSuccess('Password changed successfully')

        // Clear form and close modal after 2 seconds
        setTimeout(() => {
          setShowChangePasswordModal(false)
          setOldPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setSuccess('')
        }, 1000)
      }
    } catch (error) {
      setError(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar 
            src={profilePicture} 
            size="md" 
            style={{ 
              width: '40px', 
              height: '40px', 
              objectFit: 'cover',
              border: '2px solid #fff',
              borderRadius: '50%',
              overflow: 'hidden'
            }} 
          />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem onClick={() => navigate('/profile')}>
            <CIcon icon={cilSettings} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem onClick={() => setShowChangePasswordModal(true)}>
            <CIcon icon={cilSettings} className="me-2" />
            Change Password
          </CDropdownItem>
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {/* Change Password Modal */}
      <CModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        backdrop="static"
        centered
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh' }}
        size="lg"
      >
        <div style={{ width: '100%', padding: '20px', maxWidth: '1000px' }}>
          <CModalHeader>
            <CModalTitle>Change Password</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleChangePassword}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}
              <div className="mb-4">
                <label className="form-label">Old Password</label>
                <CInputGroup>
                  <CFormInput
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '20px' }}
                  />
                  <CInputGroupText
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconButton style={{ height: '24px', width: '24px' }}>
                      {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </CInputGroupText>
                </CInputGroup>
              </div>
              <div className="mb-4">
                <label className="form-label">New Password</label>
                <CInputGroup>
                  <CFormInput
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '20px' }}
                  />
                  <CInputGroupText
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconButton style={{ height: '24px', width: '24px' }}>
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </CInputGroupText>
                </CInputGroup>
              </div>
              <div className="mb-4">
                <label className="form-label">Confirm New Password</label>
                <CInputGroup>
                  <CFormInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '20px' }}
                  />
                  <CInputGroupText
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconButton style={{ height: '24px', width: '24px' }}>
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </CInputGroupText>
                </CInputGroup>
              </div>
              <div className="d-flex justify-content-end">
                <CButton
                  color="secondary"
                  className="me-2"
                  onClick={() => setShowChangePasswordModal(false)}
                  disabled={loading}
                >
                  Cancel
                </CButton>
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Change Password'}
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </div>
      </CModal>
    </>
  )
}

export default AppHeaderDropdown
