import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CButton,
  CImage,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { cilUser, cilPhone, cilShieldAlt, cilPencil, cilCloudUpload } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { getRequest, putRequest } from 'src/Services/apiMethods'

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    profilePicture: '',
  })
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        const roleName = role ? role.replace(/"/g, '') : 'No Role Assigned'
        const userId = localStorage.getItem('id')
        const cleanUserId = userId.replace(/"/g, '')
        
        if (!token) {
          setError('No authentication token found')
          setLoading(false)
          return
        }
        
        const response = await getRequest(`/users/${cleanUserId}`, token)
        console.log('Profile API Response:', response) // Debug log
        
        if (response && response.isSuccess) {
          const userData = {
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            email: response.data.email || '',
            phoneNumber: response.data.phone || '',
            role: roleName,
            profilePicture: response.data.imgUrl || 'https://bit.ly/3v0QZqQ',
          }
          console.log('Setting user data:', userData) // Debug log
          setUserData(userData)
          setEditData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
          })
          setImagePreview(userData.profilePicture)
        } else {
          setError('Failed to fetch profile data')
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Error fetching profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleEditClick = () => {
    setEditModalVisible(true)
    setImagePreview(userData.profilePicture || 'https://bit.ly/3v0QZqQ')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('id')
      const cleanUserId = userId.replace(/"/g, '')

      const formData = new FormData()
      
      // Add text fields with correct field names
      formData.append('firstName', editData.firstName)
      formData.append('lastName', editData.lastName)
      formData.append('email', editData.email)
      formData.append('phone', editData.phoneNumber)
      formData.append('username', editData.firstName.toLowerCase())
      formData.append('fullName', `${editData.firstName} ${editData.lastName}`)
      
      // Add profile picture URL if selected
      if (selectedImage) {
        // Convert the selected image to base64 URL
        const imageUrl = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(selectedImage)
        })
        formData.append('imgUrl', imageUrl)
      }

      // Log the actual FormData contents
      console.log('=== FormData Payload ===')
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }
      console.log('=======================')

      const response = await putRequest(`/users/${cleanUserId}`, formData, token, {
        'Content-Type': 'multipart/form-data'
      })

      console.log('Update response:', response)

      if (response && response.isSuccess) {
        setUserData(prev => ({
          ...prev,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phoneNumber: response.data.phone,
          profilePicture: response.data.imgUrl
        }))
        setEditModalVisible(false)
        setError('')
        setSelectedImage(null)
      } else {
        setError('Failed to update profile')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Error updating profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            <CCard className="shadow-sm">
              <CCardHeader className="bg-white border-0">
                <h4 className="mb-0">Profile Information</h4>
              </CCardHeader>
              <CCardBody>
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <CImage
                      rounded
                      src={userData.profilePicture || 'https://bit.ly/3v0QZqQ'}
                      alt="Profile"
                      width={180}
                      height={180}
                      className="border border-4 border-primary rounded-circle shadow-sm"
                      style={{ objectFit: 'cover' }}
                    />
                    <CButton
                      color="primary"
                      shape="rounded-pill"
                      size="sm"
                      className="position-absolute bottom-0 end-0"
                      onClick={handleEditClick}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                  </div>
                  <div className="mt-3">
                    <CBadge color="primary" className="fs-6 px-3 py-2">
                      <CIcon icon={cilShieldAlt} className="me-2" />
                      {userData.role}
                    </CBadge>
                  </div>
                </div>

                <CForm>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormInput
                        label="First Name"
                        value={userData.firstName}
                        readOnly
                        className="bg-light"
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        label="Last Name"
                        value={userData.lastName}
                        readOnly
                        className="bg-light"
                      />
                    </CCol>
                  </CRow>

                  <div className="mb-3">
                    <CFormInput
                      label="Email"
                      value={userData.email}
                      readOnly
                      className="bg-light"
                    />
                  </div>

                  <div className="mb-3">
                    <CFormInput
                      label="Phone Number"
                      value={userData.phoneNumber || 'Not provided'}
                      readOnly
                      className="bg-light"
                      icon={<CIcon icon={cilPhone} />}
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {/* Edit Modal */}
      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Edit Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="text-center mb-4">
            <div className="position-relative d-inline-block">
              <CImage
                rounded
                src={imagePreview}
                alt="Profile Preview"
                width={150}
                height={150}
                className="border border-3 border-primary rounded-circle shadow-sm"
                style={{ objectFit: 'cover' }}
              />
              <label
                htmlFor="profileImage"
                className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2"
                style={{ cursor: 'pointer' }}
              >
                <CIcon icon={cilCloudUpload} />
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="d-none"
                />
              </label>
            </div>
          </div>

          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="First Name"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleInputChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Last Name"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>

            <div className="mb-3">
              <CFormInput
                label="Email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                disabled
                className="bg-light"
              />
            </div>

            <div className="mb-3">
              <CFormInput
                label="Phone Number"
                name="phoneNumber"
                value={editData.phoneNumber || 'Not provided'}
                onChange={handleInputChange}
                icon={<CIcon icon={cilPhone} />}
                disabled
                className="bg-light"
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CSpinner size="sm" /> Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Profile