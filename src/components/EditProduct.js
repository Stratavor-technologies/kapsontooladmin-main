import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CFormTextarea,
  CButton,
  CInputGroup,
  CInputGroupText,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import { getRequest, putRequest } from 'src/Services/apiMethods'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const primaryImageInputRef = useRef(null)
  const additionalImagesInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    artNo: '',
    hsnNumber: '',
    basicPrice: '',
    mrp: '',
    productName: '',
    productDescription: '',
    stock: '',
    packagingDetails: {
      piecesInPack: '',
      piecesInBox: '',
    },
    productFeature: [''], // Initialize with one empty feature
  })

  const [primaryImage, setPrimaryImage] = useState(null)
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null)
  const [additionalImages, setAdditionalImages] = useState([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([])
  const [selectedApplications, setSelectedApplications] = useState([])

  // Available application types
  const applicationTypes = ['Automobile', 'Industries', 'Agriculture', 'Construction']

  // Load existing product data if id is provided in URL params
  useEffect(() => {
    if (id) {
      setIsEditMode(true)
      fetchProductData(id)
    }
  }, [id])

  const fetchProductData = async (productId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }
    try {
      setLoading(true)
      const response = await getRequest(`/products/${productId}`, token)
      const productData = response.data
      console.log('Fetched product data:', productData)

      // Populate form data - mapping API data to form fields
      setFormData({
        category: productData.category?._id || '',
        subCategory: productData.subCategory?._id || '',
        artNo: productData.ArtNumber || '',
        hsnNumber: productData.hsnNumber?._id || '',
        basicPrice: productData.basicPrice || '',
        mrp: productData.mrp || '',
        productName: productData.productName || '',
        productDescription: productData.productDescription || '',
        stock: productData.stock || '',
        packagingDetails: {
          piecesInPack: productData.packagingDetails?.piecesInPack || '',
          piecesInBox: productData.packagingDetails?.piecesInBox || '',
        },
        productFeature: productData.productFeature?.length ? productData.productFeature : [''],
      })

      // Set application details
      if (productData.applicationDetails && Array.isArray(productData.applicationDetails)) {
        setSelectedApplications(productData.applicationDetails)
      }

      // Set image previews if available
      if (productData.productImage && productData.productImage.length > 0) {
        setPrimaryImagePreview(productData.productImage[0])

        // Set additional images (skip first image as it's the primary)
        if (productData.productImage.length > 1) {
          setAdditionalImagePreviews(productData.productImage.slice(1))
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error)
      // Handle error (show message to user)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleApplicationToggle = (application) => {
    if (selectedApplications.includes(application)) {
      setSelectedApplications(selectedApplications.filter((app) => app !== application))
    } else {
      setSelectedApplications([...selectedApplications, application])
    }
  }

  const renderApplicationButton = (application) => {
    const isActive = selectedApplications.includes(application)
    return (
      <div
        key={application}
        className={`category-btn small px-2 py-1 rounded me-2 ${isActive ? 'bg-secondary text-white' : 'bg-dark text-white border border-secondary'}`}
        onClick={() => handleApplicationToggle(application)}
        style={{ cursor: 'pointer', display: 'inline-block' }}
      >
        {application}
      </div>
    )
  }

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.productFeature]
    updatedFeatures[index] = value
    setFormData({
      ...formData,
      productFeature: updatedFeatures,
    })
  }

  // Add a new feature field
  const addFeature = () => {
    setFormData({
      ...formData,
      productFeature: [...formData.productFeature, ''],
    })
  }

  // Delete a feature
  const deleteFeature = (index) => {
    // Don't delete if it's the only feature left
    if (formData.productFeature.length <= 1) {
      return
    }

    const updatedFeatures = formData.productFeature.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      productFeature: updatedFeatures,
    })
  }

  // Handle primary image upload
  const handlePrimaryImageUpload = (e) => {
    const file = e.target.files[0]

    if (file) {
      // Validate file size (400KB = 409600 bytes)
      if (file.size > 409600) {
        alert('Image size should not exceed 400KB')
        return
      }

      setPrimaryImage(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPrimaryImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle additional images upload
  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files)

    // Limit to 10 images max
    if (files.length + additionalImages.length > 10) {
      alert('You can upload a maximum of 10 images')
      return
    }

    // Validate file sizes
    const validFiles = files.filter((file) => {
      if (file.size > 409600) {
        alert(`Image ${file.name} exceeds 400KB and won't be uploaded`)
        return false
      }
      return true
    })

    setAdditionalImages([...additionalImages, ...validFiles])

    // Create preview URLs for all valid files
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdditionalImagePreviews((prevPreviews) => [...prevPreviews, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  // Trigger file input click when the button is clicked
  const handlePrimaryImageButtonClick = () => {
    primaryImageInputRef.current.click()
  }

  const handleAdditionalImagesButtonClick = () => {
    additionalImagesInputRef.current.click()
  }

  // Remove an additional image
  const removeAdditionalImage = (index) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
    setAdditionalImagePreviews(additionalImagePreviews.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    navigate('/Products/AllProducts') // Navigate back to products list
  }

  /*************  ✨ Codeium Command 🌟  *************/
  /**
   * Handle form submission.
   * @param {Event} e - Form submission event.
   */
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        ArtNumber: formData.artNo,
        category: formData.category,
        subCategory: formData.subCategory,
        hsnNumber: formData.hsnNumber,
        basicPrice: formData.basicPrice,
        mrp: formData.mrp,
        stock: Number(formData.stock),
        packagingDetails: {
          piecesInPack: formData.packagingDetails.piecesInPack,
          piecesInBox: formData.packagingDetails.piecesInBox,
        },
        productFeature: formData.productFeature,
        applicationDetails: selectedApplications,
        productImage: [],
      }

      if (primaryImage) {
        const base64 = await toBase64(primaryImage)
        submitData.productImage.push(base64)
      }

      for (let file of additionalImages) {
        const base64 = await toBase64(file)
        submitData.productImage.push(base64)
      }

      const token = localStorage.getItem('token')
      if (!token) {
        alert('You must be logged in to submit.')
        return
      }

      const url = isEditMode ? `/products/${id}` : '/products'
      const method = isEditMode ? 'putRequest' : 'postRequest'

      const response = await (isEditMode
        ? putRequest(url, submitData, token)
        : postRequest(url, submitData, token))

      if (response?.code === 200 || response?.code === 201) {
        alert(`Product ${isEditMode ? 'updated' : 'created'} successfully!`)
        navigate('/Products/AllProducts')
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('An error occurred. Please check the console.')
    } finally {
      setLoading(false)
    }
  }

  /******  971f7b15-e3a0-405b-a95d-3beee57e58dc  *******/

  if (loading && isEditMode) {
    return (
      <CCard className="border-0">
        <CCardBody
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '300px' }}
        >
          <CSpinner color="danger" />
          <span className="ms-2">Loading product data...</span>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard className="border-0">
      <CCardBody>
        <h4>{isEditMode ? 'Edit Product' : 'Add New Product'}</h4>
        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="category">Select Category*</CFormLabel>
                <CFormSelect
                  id="category"
                  className="border-secondary"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="67d02f2381e81cc42becfd4a">Accesories6</option>
                  {/* Add more categories as needed */}
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="artNo">Art No.*</CFormLabel>
                <CFormInput
                  id="artNo"
                  className="border-secondary"
                  value={formData.artNo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="basicPrice">Basic Price*</CFormLabel>
                <CFormInput
                  id="basicPrice"
                  className="border-secondary"
                  value={formData.basicPrice}
                  onChange={handleInputChange}
                  type="number"
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="stock">Stock*</CFormLabel>
                <CFormInput
                  id="stock"
                  className="border-secondary"
                  value={formData.stock}
                  onChange={handleInputChange}
                  type="number"
                />
              </div>
            </CCol>

            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel htmlFor="subCategory">Select Sub Category*</CFormLabel>
                <CFormSelect
                  id="subCategory"
                  className="border-secondary"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                >
                  <option value="">Select Sub Category</option>
                  <option value="67d02f2c81e81cc42becfd4d">OIL PIPE</option>
                  {/* Add more sub-categories as needed */}
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="hsnNumber">Select HSN Number*</CFormLabel>
                <CFormSelect
                  id="hsnNumber"
                  className="border-secondary"
                  value={formData.hsnNumber}
                  onChange={handleInputChange}
                >
                  <option value="">Select HSN Number</option>
                  <option value="67d139f2e4d6847bbcaec543">11111 (GST: 18%)</option>
                  {/* Add more HSN numbers as needed */}
                </CFormSelect>
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="productName">Product Name*</CFormLabel>
                <CFormInput
                  id="productName"
                  className="border-secondary"
                  value={formData.productName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="mrp">MRP*</CFormLabel>
                <CFormInput
                  id="mrp"
                  className="border-secondary"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  type="number"
                />
              </div>
            </CCol>
          </CRow>
          <CRow>
            <div className="mb-3">
              <CFormLabel htmlFor="productDescription">Product Description*</CFormLabel>
              <CFormTextarea
                id="productDescription"
                rows={4}
                className="border-secondary"
                value={formData.productDescription}
                onChange={handleInputChange}
              />
            </div>

            <CRow className="mb-3">
              <CCol xs={12}>
                <div className="d-flex justify-content-between mb-2">
                  <CFormLabel>Features</CFormLabel>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={addFeature}
                    style={{ backgroundColor: '#f05123', borderColor: '#f05123' }}
                  >
                    <AddIcon fontSize="small" /> Add More Features
                  </CButton>
                </div>
                {formData.productFeature.map((feature, index) => (
                  <div key={index} className="d-flex mb-2">
                    <CFormInput
                      type="text"
                      placeholder="Add Feature"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="border-secondary"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={() => deleteFeature(index)}
                      style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                      disabled={formData.productFeature.length <= 1}
                    >
                      <DeleteIcon style={{ color: '#f05123' }} />
                    </button>
                  </div>
                ))}
              </CCol>
            </CRow>
          </CRow>
          <div className="border-top border-secondary mt-3 pt-3">
            <CFormLabel>Packaging Details</CFormLabel>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="piecesInPack">No. of Pcs in Single Pack</CFormLabel>
                  <CFormInput
                    id="piecesInPack"
                    className="border-secondary"
                    value={formData.packagingDetails.piecesInPack}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        packagingDetails: {
                          ...formData.packagingDetails,
                          piecesInPack: e.target.value,
                        },
                      })
                    }
                    type="number"
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="piecesInBox">No. of Pcs in Box</CFormLabel>
                  <CFormInput
                    id="piecesInBox"
                    className="border-secondary"
                    value={formData.packagingDetails.piecesInBox}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        packagingDetails: {
                          ...formData.packagingDetails,
                          piecesInBox: e.target.value,
                        },
                      })
                    }
                    type="number"
                  />
                </div>
              </CCol>
            </CRow>
          </div>

          <div className="border-top border-secondary mt-3 pt-3">
            <CFormLabel>Application Details</CFormLabel>
            <div className="mt-2">
              {applicationTypes.map((app) => renderApplicationButton(app))}
            </div>
          </div>

          <div className="border-top border-secondary mt-3 pt-3">
            <CFormLabel>Add Images (Images must be in ratio of 1:1 with 4000x4000 px)</CFormLabel>
            <CRow>
              <CCol md={6}>
                {/* Hidden file input for primary image */}
                <input
                  type="file"
                  ref={primaryImageInputRef}
                  className="d-none"
                  accept="image/*"
                  onChange={handlePrimaryImageUpload}
                />
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  className="mb-2"
                  onClick={handlePrimaryImageButtonClick}
                >
                  <CIcon icon={cilPlus} />{' '}
                  {primaryImagePreview ? 'Change Primary Image' : 'Add Primary Image'}
                </CButton>
                <p className="small text-white">(Select one image with max size of 400kb)</p>

                <div
                  className="border border-secondary p-2 d-flex justify-content-center align-items-center"
                  style={{ height: '150px', width: '100%' }}
                >
                  {primaryImagePreview && (
                    <img
                      src={primaryImagePreview}
                      alt="Primary"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  )}
                </div>
              </CCol>

              <CCol md={6}>
                {/* Hidden file input for additional images */}
                <input
                  type="file"
                  ref={additionalImagesInputRef}
                  className="d-none"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesUpload}
                />
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  className="mb-2"
                  onClick={handleAdditionalImagesButtonClick}
                >
                  <CIcon icon={cilPlus} /> Add Additional Images
                </CButton>
                <p className="small text-white">
                  (Max CTRL to select multiple (maximum 10 images of max size 400kb each.)
                </p>

                <div
                  className="border border-secondary p-2"
                  style={{
                    height: '150px',
                    width: '100%',
                    overflowY: 'auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {additionalImagePreviews.map((preview, index) => (
                    <div key={index} className="position-relative m-1">
                      <img
                        src={preview}
                        alt={`Additional ${index}`}
                        style={{ height: '60px', width: '60px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        style={{ padding: '0 4px', fontSize: '10px' }}
                        onClick={() => removeAdditionalImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CCol>
            </CRow>
          </div>

          <CRow className="mt-4">
            <CCol className="text-end">
              <CButton color="secondary" type="button" className="me-2" onClick={handleCancel}>
                Cancel
              </CButton>
              <CButton color="danger" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    {isEditMode ? 'Updating...' : 'Submitting...'}
                  </>
                ) : isEditMode ? (
                  'Update Product'
                ) : (
                  'Submit'
                )}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ProductForm
