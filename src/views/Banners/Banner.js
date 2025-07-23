import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CBreadcrumb,
  CBreadcrumbItem,
  CSpinner,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CModal, 
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormText,
  CAlert,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilHome } from '@coreui/icons'
import image from '../../assets/images/K-101.png'
import { getRequest, putRequest, deleteRequest, postRequest } from '../../Services/apiMethods'

const BannersList = () => {
  // Banner list state
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [toaster, setToaster] = useState(null)

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('Add New Banner')
  const [modalError, setModalError] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    titleBanner: '',
    placement: '',
    status: '',
    type: 'web',
    imageUrl: '',
    description: ''
  })
  const [bannerImage, setBannerImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [isImageUpdated, setIsImageUpdated] = useState(false)

  // Fetch banners from API
  const getBanners = async () => {
    try {
      setLoading(true)
      const response = await getRequest('/banners')
      console.log('Banners response:', response)
      if (response.isSuccess && Array.isArray(response.items)) {
        const formattedBanners = response.items.map(banner => ({
          id: banner.id,
          titleBanner: banner.titleBanner || '-',
          imageUrl: banner.imageUrl || '',
          updatedOn: new Date(banner.updatedAt).toLocaleDateString(),
          status: banner.status,
          type: banner.type,
          placement: banner.placement,
          description: banner.description || '-'
        }))
        setBanners(formattedBanners)
      } else {
        setBanners([])
        showToast('Error fetching banners', 'danger')
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
      setBanners([])
      showToast('Error fetching banners', 'danger')
    } finally {
      setLoading(false)
    }
  }

  // Fetch banners on component mount
  useEffect(() => {
    getBanners()
  }, [])

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (modalVisible) {
      if (selectedBanner) {
        // For editing, pull the data from the selected banner
        setFormData({
          titleBanner: selectedBanner.titleBanner || '',
          placement: selectedBanner.placement || '',
          status: selectedBanner.status || '',
          type: selectedBanner.type || '',
          imageUrl: selectedBanner.imageUrl || '',
          description: selectedBanner.description || ''
        })
        setImagePreview(selectedBanner.imageUrl || '')
        setIsImageUpdated(false)
      } else {
        // For new banner, reset the form
        setFormData({
          titleBanner: '',
          placement: '',
          status: '',
          type: '',
          imageUrl: '',
          description: ''
        })
        setImagePreview('')
        setIsImageUpdated(false)
      }
      setModalError('')
    }
  }, [modalVisible, selectedBanner])

  // Open modal for adding new banner
  const handleAddBanner = () => {
    setSelectedBanner(null)
    setModalVisible(true)
  }

  // Open modal for editing banner
  const handleEditBanner = async (bannerId) => {
    try {
      setLoading(true)
      const banner = banners.find((banner) => banner.id === bannerId)
      if (banner) {
        // Get full banner details from API if needed
        const response = await getRequest(`/banners/${bannerId}`)
        console.log('Banner API Response:', response)
        
        if (response.isSuccess) {
          // Use API response data if available
          const bannerDetails = response.data || response.items || banner
          console.log('Banner Details:', bannerDetails)
          
          // Set selected banner first
          setSelectedBanner(bannerDetails)
          
          // Then set form data
          setFormData({
            titleBanner: bannerDetails.titleBanner || '',
            placement: bannerDetails.placement || '',
            status: bannerDetails.status || '',
            type: bannerDetails.type || '',
            imageUrl: bannerDetails.imageUrl || '',
            description: bannerDetails.description || ''
          })
          
          // Set image preview
          setImagePreview(bannerDetails.imageUrl || '')
          setIsImageUpdated(false)
          
          // Set modal title and show modal
          setModalTitle('Edit Banner')
          setModalVisible(true)
        } else {
          // If API call fails, use the data from the table
          setSelectedBanner(banner)
          setFormData({
            titleBanner: banner.titleBanner || '',
            placement: banner.placement || '',
            status: banner.status || '',
            type: banner.type || '',
            imageUrl: banner.imageUrl || '',
            description: banner.description || ''
          })
          setImagePreview(banner.imageUrl || '')
          setIsImageUpdated(false)
          setModalTitle('Edit Banner')
        setModalVisible(true)
        }
      }
    } catch (error) {
      console.error('Error fetching banner details:', error)
      showToast('Error fetching banner details', 'danger')
    } finally {
      setLoading(false)
    }
  }

  // Handle banner deletion
  const handleDeleteBanner = async (bannerId) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await deleteRequest(`/banners/${bannerId}`, token)
      
      if (response.isSuccess) {
        setBanners(banners.filter((banner) => banner.id !== bannerId))
        showToast('Banner deleted successfully', 'success')
        setDeleteModalVisible(false)
      } else {
        showToast('Failed to delete banner', 'danger')
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      showToast('Error deleting banner', 'danger')
    } finally {
      setLoading(false)
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBannerImage(file)
      // Create a preview URL
      const fileReader = new FileReader()
      fileReader.onload = () => {
        const result = fileReader.result
        setImagePreview(result)
        // Set the image URL in formData
        setFormData(prev => ({
          ...prev,
          imageUrl: result
        }))
        setIsImageUpdated(true)  // Mark that image has been updated
      }
      fileReader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setModalLoading(true)
    const token = localStorage.getItem('token')

    try {
      // Validate required fields
      // For editing, don't require imageUrl if it hasn't been updated
      const isEdit = !!selectedBanner
      const isImageRequired = !isEdit || isImageUpdated
      
      if (!formData.titleBanner || !formData.placement || !formData.status || !formData.type) {
        setModalError('Title, placement, status, and type are required')
        setModalLoading(false)
        return
      }

      if (isImageRequired && !formData.imageUrl) {
        setModalError('Please select an image')
        setModalLoading(false)
        return
      }

      // Clone form data for submission (to keep any existing image URL when not updated)
      const submissionData = { ...formData }
      
      // If editing and image not updated, use existing image URL
      if (isEdit && !isImageUpdated) {
        submissionData.imageUrl = selectedBanner.imageUrl
      }

      // Create or update banner
      let response
      if (isEdit) {
        response = await putRequest(`/banners/${selectedBanner.id}`, submissionData, token)
      } else {
        response = await postRequest('/banners/create', submissionData, token)
      }
      
      if (response.isSuccess) {
        setModalVisible(false)
        getBanners()
        showToast(isEdit ? 'Banner updated successfully' : 'Banner added successfully', 'success')
      } else {
        setModalError(response.message || 'Error saving banner. Please try again.')
      }
    } catch (err) {
      console.error('Error saving banner:', err)
      setModalError('Error saving banner. Please try again.')
    } finally {
      setModalLoading(false)
    }
  }

  // Show toast notification
  const showToast = (message, color = 'primary') => {
    setToast(
      <CToast autohide={true} visible={true}>
        <CToastHeader closeButton>
          <strong className="me-auto">Banner Management</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>,
    )
  }

  return (
    <div className="min-vh-100">
      <CToaster ref={setToaster} push={toast} placement="top-end" />
      <CRow>
        <CCol>
          <CCard className="mb-4 border-0">
            <CCardHeader className="border-0 p-3">
              <h4 className="mb-0">Banners list</h4>
            </CCardHeader>
            <CCardBody className="p-0">
              <div className="d-flex justify-content-end mb-3">
                <CButton color="primary" className="text-white" onClick={handleAddBanner}>
                  Add New Banner
                </CButton>
              </div>

              {loading ? (
                <div className="text-center p-5">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CTable responsive bordered className="mb-0">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="" style={{ width: '5%' }}>
                        Sr. No.
                      </CTableHeaderCell>
                      <CTableHeaderCell className="" style={{ width: '15%' }}>
                        Banner Title
                      </CTableHeaderCell>
                      <CTableHeaderCell className="" style={{ width: '20%' }}>
                        Image
                      </CTableHeaderCell>
                      <CTableHeaderCell className="" style={{ width: '10%' }}>
                        Placement
                      </CTableHeaderCell>
                      <CTableHeaderCell className="" style={{ width: '10%' }}>
                        Status
                      </CTableHeaderCell>
                      <CTableHeaderCell className="" style={{ width: '10%' }}>
                        Type
                      </CTableHeaderCell>
                      <CTableHeaderCell className="" style={{ width: '15%' }}>
                        Updated On
                      </CTableHeaderCell>
                      <CTableHeaderCell className="" style={{ width: '15%' }}>
                        Description
                      </CTableHeaderCell>
                      <CTableHeaderCell className="" style={{ width: '15%' }}>
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {banners.length > 0 ? (
                      banners.map((banner, index) => (
                        <CTableRow key={banner.id}>
                          <CTableDataCell className="" style={{ width: '10px' }}>{index + 1}</CTableDataCell>
                          <CTableDataCell className="" style={{ 
                            width: '10px', 
                            maxWidth: '10px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{banner.titleBanner}</CTableDataCell>
                          <CTableDataCell className="" style={{ width: '10px' }}>
                            <img
                              src={banner.imageUrl}
                              alt={banner.titleBanner}
                              style={{ height: '60px', width: '100px', objectFit: 'cover' }}
                            />
                          </CTableDataCell>
                          <CTableDataCell className="" style={{ 
                            width: '10px', 
                            maxWidth: '10px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{banner.placement}</CTableDataCell>
                          <CTableDataCell className="" style={{ width: '10px' }}>
                            <span className={`badge bg-${banner.status === 'active' ? 'success' : 'danger'}`}>
                              {banner.status}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell className="" style={{ 
                            width: '10px', 
                            maxWidth: '10px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{banner.type}</CTableDataCell>
                          <CTableDataCell className="" style={{ 
                            width: '10px', 
                            maxWidth: '10px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{banner.updatedOn}</CTableDataCell>
                          <CTableDataCell className="" style={{ 
                            width: '10px', 
                            maxWidth: '10px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{banner.description}</CTableDataCell>
                          <CTableDataCell className="" style={{ width: '10px' }}>
                            <div className="d-flex gap-1">
                              <CButton
                                size="sm"
                                color="success"
                                variant="outline"
                                onClick={() => handleEditBanner(banner.id)}
                              >
                                <CIcon icon={cilPencil} size="sm" />
                              </CButton>
                              <CButton
                                size="sm"
                                color="danger"
                                variant="outline"
                                onClick={() => {
                                  setBannerToDelete(banner.id)
                                  setDeleteModalVisible(true)
                                }}
                              >
                                <CIcon icon={cilTrash} size="sm" />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center">
                          No banners found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Banner Add/Edit Modal */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        size="lg"
        alignment="center"
      >
        <CModalHeader closeButton className="border-bottom border-secondary">
          <CModalTitle>{modalTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modalError && <CAlert color="danger">{modalError}</CAlert>}
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="titleBanner">Banner Title</CFormLabel>
              <CFormInput
                type="text"
                id="titleBanner"
                name="titleBanner"
                value={formData.titleBanner}
                onChange={handleInputChange}
                placeholder="Enter banner title"
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="description">Description</CFormLabel>
              <CFormInput
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter banner description"
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="placement">Placement</CFormLabel>
              <CFormSelect
                id="placement"
                name="placement"
                value={formData.placement}
                onChange={handleInputChange}
                required
              >
                <option value="">Select placement</option>
                <option value="homepage">Homepage</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
                <option value="popup">Popup</option>
                <option value="landing_page">Landing Page</option>
                <option value="category_page">Category Page</option>
              </CFormSelect>
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="status">Status</CFormLabel>
              <CFormSelect
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              > 
                 <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="type">Type</CFormLabel>
              <CFormSelect
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                <option value="web">Web</option>
                <option value="android">Android</option>
                <option value="ios">IOS</option>
              </CFormSelect>
            </div>

            <div className="mb-3">
              <CFormLabel htmlFor="bannerImage">
                Banner Image {selectedBanner && !isImageUpdated ? '(Optional for edit)' : '(Required)'}
              </CFormLabel>
              <CFormInput
                type="file"
                id="bannerImage"
                accept="image/*"
                onChange={handleImageChange}
                required={!selectedBanner} // Only required for new banners
              />
              <CFormText>Recommended size: 1200x300 pixels</CFormText>
            </div>

            {(imagePreview || (selectedBanner && selectedBanner.imageUrl && !isImageUpdated)) && (
              <div className="mb-3">
                <p>Image Preview:</p>
                <img
                  src={imagePreview || selectedBanner?.imageUrl}
                  alt="Banner preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter className="border-top border-secondary">
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleSubmit} disabled={modalLoading}>
            {modalLoading ? <CSpinner size="sm" /> : selectedBanner ? 'Update' : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        alignment="center"
      >
        <CModalHeader closeButton>
          <CModalTitle>Delete Banner</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this banner? This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </CButton>
          <CButton 
            color="danger" 
            onClick={() => handleDeleteBanner(bannerToDelete)}
            disabled={loading}
          >
            {loading ? <CSpinner size="sm" /> : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default BannersList