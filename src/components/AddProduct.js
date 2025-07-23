import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormSelect,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CFormCheck,
  CButton,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from 'react-router-dom'
import { postRequest, getRequest } from '../Services/apiMethods'
import { useSelector } from 'react-redux'

const AddProduct = () => {
  // Form state
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [hsnNumbers, setHsnNumbers] = useState([])
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    ArtNumber: '',
    hsnNumber: '',
    mrp: '',
    basicPrice: '',
    productName: '',
    productDescription: '',
    productFeature: [''],
    stock: '',
    packagingDetails: {
      piecesInPack: '',
      piecesInBox: '',
    },
    applicationDetails: [],
    productImage: [],
  })

  // New validation state
  const [errors, setErrors] = useState({
    category: '',
    subCategory: '',
    ArtNumber: '',
    hsnNumber: '',
    mrp: '',
    basicPrice: '',
    productName: '',
    productDescription: '',
    productFeature: '',
    stock: '',
    packagingDetails: {
      piecesInPack: '',
      piecesInBox: '',
    },
    productImage: '',
  })

  // Flag to track if form was submitted
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Derived state
  const [subCategories, setSubCategories] = useState([])
  // For display purposes, to preview images
  const [imagePreview, setImagePreview] = useState({
    primary: null,
    additional: [],
  })

  const getCategory = async () => {
    const token = localStorage.getItem('token') // Adjust based on your auth logic
    if (!token) {
      console.error('No authentication token found')
      return
    }
    try {
      const response = await getRequest('/categories', token)
      setCategories(response.items)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Handle error (e.g., show a message to the user)
    }
  }

  const getSubCategory = async (categoryID) => {
    const token = localStorage.getItem('token')
    if (!token || !categoryID) return

    try {
      const response = await getRequest(`/subcategories?categoryId=${categoryID}`, token)
      console.log('Subcategories:', response.items)
      setSubCategories(response.items) // Keep full subcategory objects with id + name
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const getHSN = async () => {
    const token = localStorage.getItem('token') // Adjust based on your auth logic
    if (!token) {
      console.error('No authentication token found')
      return
    }
    try {
      const response = await getRequest('/hsnNumbers', token)
      console.log('HSN:', response.items)
      setHsnNumbers(response.items)
    } catch (error) {
      console.error('Error fetching HSN:', error)
      // Handle error (e.g., show a message to the user)
    }
  }

  useEffect(() => {
    getCategory()
    getHSN()
  }, [])

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      // Pass the selected category ID directly to get subcategories
      getSubCategory(formData.category)
    } else {
      setSubCategories([])
    }
  }, [formData.category])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Handle packaging details separately
    if (name === 'piecesInPack' || name === 'piecesInBox') {
      setFormData({
        ...formData,
        packagingDetails: {
          ...formData.packagingDetails,
          [name]: value,
        },
      })

      // Clear error when user types
      if (formSubmitted) {
        setErrors({
          ...errors,
          packagingDetails: {
            ...errors.packagingDetails,
            [name]: ''
          }
        })
      }
    } else {
      // Handle all other inputs normally
      setFormData({
        ...formData,
        [name]: value,
      })

      // Clear error when user types
      if (formSubmitted) {
        setErrors({
          ...errors,
          [name]: ''
        })
      }
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target

    // Update applicationDetails array instead of applications object
    if (checked) {
      setFormData({
        ...formData,
        applicationDetails: [...formData.applicationDetails, name],
      })
    } else {
      setFormData({
        ...formData,
        applicationDetails: formData.applicationDetails.filter((app) => app !== name),
      })
    }
  }

  // Handle feature changes
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.productFeature]
    updatedFeatures[index] = value
    setFormData({
      ...formData,
      productFeature: updatedFeatures,
    })

    // Clear feature error when user types
    if (formSubmitted) {
      setErrors({
        ...errors,
        productFeature: ''
      })
    }
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

  // Handle primary image upload (adds to productImage array)
  const handlePrimaryImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Update preview for UI
    setImagePreview({
      ...imagePreview,
      primary: URL.createObjectURL(file),
    })

    // Update form data by adding to productImage array
    setFormData({
      ...formData,
      productImage: [file, ...formData.productImage.slice(1)], // Replace first item or add as first
    })

    // Clear image error
    if (formSubmitted) {
      setErrors({
        ...errors,
        productImage: ''
      })
    }
  }

  // Handle additional images upload (adds to productImage array)
  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Update previews for UI
    const additionalPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreview({
      ...imagePreview,
      additional: additionalPreviews,
    })

    // Update form data - add primary image (if exists) plus additional images
    const primaryImage = formData.productImage[0] || null

    setFormData({
      ...formData,
      productImage: primaryImage ? [primaryImage, ...files] : [...files],
    })
  }

  // Validate form fields
  const validateForm = () => {
    let isValid = true
    let newErrors = {
      category: '',
      subCategory: '',
      ArtNumber: '',
      hsnNumber: '',
      mrp: '',
      basicPrice: '',
      productName: '',
      productDescription: '',
      productFeature: '',
      stock: '',
      packagingDetails: {
        piecesInPack: '',
        piecesInBox: '',
      },
      productImage: '',
    }

    // Validate required fields
    if (!formData.category) {
      newErrors.category = 'Please select a category'
      isValid = false
    }

    if (!formData.subCategory) {
      newErrors.subCategory = 'Please select a sub category'
      isValid = false
    }

    if (!formData.ArtNumber) {
      newErrors.ArtNumber = 'Art number is required'
      isValid = false
    }

    if (!formData.hsnNumber) {
      newErrors.hsnNumber = 'Please select an HSN number'
      isValid = false
    }

    if (!formData.mrp) {
      newErrors.mrp = 'MRP is required'
      isValid = false
    }

    if (!formData.basicPrice) {
      newErrors.basicPrice = 'Basic price is required'
      isValid = false
    }

    if (!formData.productName) {
      newErrors.productName = 'Product name is required'
      isValid = false
    }

    if (!formData.productDescription) {
      newErrors.productDescription = 'Product description is required'
      isValid = false
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock is required'
      isValid = false
    }

    if (!formData.packagingDetails.piecesInPack) {
      newErrors.packagingDetails.piecesInPack = 'Please enter the number of pieces in a pack'
      isValid = false
    }

    if (!formData.packagingDetails.piecesInBox) {
      newErrors.packagingDetails.piecesInBox = 'Please enter the number of pieces in a box'
      isValid = false
    }
    if(formData.applicationDetails.length === 0) {
      newErrors.applicationDetails = 'Please select at least one application'
      isValid = false
    }

    // Validate features - check if at least one feature has content
    const hasValidFeature = formData.productFeature.some(feature => feature.trim() !== '')
    if (!hasValidFeature) {
      newErrors.productFeature = 'At least one feature is required'
      isValid = false
    }

    // Validate product image
    if (formData.productImage.length === 0) {
      newErrors.productImage = 'Please upload at least one image'
      isValid = false
    }


    setErrors(newErrors)
    return isValid
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitted(true)

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.text-danger.error-message')
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    try {
      // We'll use FileReader to convert image files to base64 strings
      const imagePromises = formData.productImage.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target.result)
          reader.onerror = (e) => reject(e)
          reader.readAsDataURL(file)
        })
      })

      // Wait for all images to be converted to base64
      const imageBase64Array = await Promise.all(imagePromises)

      // Create a single JSON payload with all data including images
      const payload = {
        productName: formData.productName,
        ArtNumber: formData.ArtNumber,
        stock: formData.stock,
        category: formData.category,
        subCategory: formData.subCategory,
        hsnNumber: formData.hsnNumber,
        mrp: formData.mrp,
        basicPrice: formData.basicPrice,
        productDescription: formData.productDescription,
        productFeature: formData.productFeature.filter((feature) => feature.trim() !== ''),
        applicationDetails: formData.applicationDetails,
        packagingDetails: {
          piecesInPack: formData.packagingDetails.piecesInPack,
          piecesInBox: formData.packagingDetails.piecesInBox,
        },
        // Include the base64 encoded images directly in the JSON
        productImage: imageBase64Array,
      }

      console.log('Submitting product with single JSON payload')
      const response = await postRequest('/products/create', payload, token)

      console.log('Product added:', response.data)
      // Redirect or show success
      navigate(-1)
    } catch (error) {
      console.error('Error submitting product:', error)
      // Show user error message
    }
  }

  // Check if an application is selected
  const isApplicationSelected = (appName) => {
    return formData.applicationDetails.includes(appName)
  }

  // Error message component
  const ErrorMessage = ({ message }) => {
    return message ? (
      <div className="text-danger error-message" style={{ fontSize: '0.875rem', marginTop: '4px' }}>
        {message}
      </div>
    ) : null
  }

  return (
    <CRow>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        <strong>Add Product</strong>
      </div>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader style={{ borderBottom: '1px solid #132f4c' }}>
            <strong>New Products</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <p className="text-muted small">
                  Fields marked with <span className="text-danger">*</span> are required
                </p>
              </div>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="category">
                    Select Category <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormSelect
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </CFormSelect>
                  <ErrorMessage message={errors.category} />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="subCategory">
                    Select Sub Category <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormSelect
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    disabled={!formData.category}
                  >
                    <option value="">Select Sub Category</option>
                    {subCategories.map((subCategory) => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </option>
                    ))}
                  </CFormSelect>
                  <ErrorMessage message={errors.subCategory} />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="ArtNumber">
                    Art No. <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="ArtNumber"
                    name="ArtNumber"
                    value={formData.ArtNumber}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage message={errors.ArtNumber} />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="hsnNumber">
                    Select HSN Number <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormSelect
                    id="hsnNumber"
                    name="hsnNumber"
                    value={formData.hsnNumber}
                    onChange={handleInputChange}
                  >
                    <option value="">Select HSN Number</option>
                    {hsnNumbers.map((hsn) => (
                      <option key={hsn.id} value={hsn.id}>
                        {hsn.hsnNumber} - {hsn.description}
                      </option>
                    ))}
                  </CFormSelect>
                  <ErrorMessage message={errors.hsnNumber} />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={4}>
                  <CFormLabel htmlFor="mrp">
                    MRP <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="mrp"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage message={errors.mrp} />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="basicPrice">
                    Basic Price <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="basicPrice"
                    name="basicPrice"
                    value={formData.basicPrice}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage message={errors.basicPrice} />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="stock">
                    Stock <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage message={errors.stock} />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CFormLabel htmlFor="productName">
                    Product Name <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage message={errors.productName} />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel htmlFor="productDescription">
                    Product Description <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormTextarea
                    id="productDescription"
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    rows={3}
                  />
                  <ErrorMessage message={errors.productDescription} />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <div className="d-flex justify-content-between mb-2">
                    <CFormLabel className="">Features  <span className="text-danger">*</span></CFormLabel>
                    <CButton color="primary" size="sm" onClick={addFeature}>
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
                  <ErrorMessage message={errors.productFeature} />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel className="">Packaging Details  <span className="text-danger">*</span></CFormLabel>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="piecesInPack" style={{fontSize: '14px'}}>No. of Pcs. In Single Pack</CFormLabel>
                  <CFormInput
                    type="number"
                    id="piecesInPack"
                    name="piecesInPack"
                    value={formData.packagingDetails.piecesInPack}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage message={errors.packagingDetails?.piecesInPack} />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="piecesInBox" style={{fontSize: '14px'}}>No. of Pcs. In Box</CFormLabel>
                  <CFormInput
                    type="number"
                    id="piecesInBox"
                    name="piecesInBox"
                    value={formData.packagingDetails.piecesInBox}
                    onChange={handleInputChange}
                  />
                  <ErrorMessage message={errors.packagingDetails?.piecesInBox} />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                    <CFormLabel className="">Application Details  <span className="text-danger">*</span></CFormLabel>
                </CCol>
                <CCol xs={12}>
                  <CFormCheck
                    inline
                    id="Automobile"
                    name="Automobile"
                    label="Automobile"
                    checked={isApplicationSelected('Automobile')}
                    onChange={handleCheckboxChange}
                    className="me-3"
                  />
                  <CFormCheck
                    inline
                    id="Industries"
                    name="Industries"
                    label="Industries"
                    checked={isApplicationSelected('Industries')}
                    onChange={handleCheckboxChange}
                    className="me-3"
                  />
                  <CFormCheck
                    inline
                    id="Agriculture"
                    name="Agriculture"
                    label="Agriculture"
                    checked={isApplicationSelected('Agriculture')}
                    onChange={handleCheckboxChange}
                    className="me-3"
                  />
                  <CFormCheck
                    inline
                    id="Construction"
                    name="Construction"
                    label="Construction"
                    checked={isApplicationSelected('Construction')}
                    onChange={handleCheckboxChange}
                  />
                </CCol>
                <ErrorMessage message={errors.applicationDetails} />
              </CRow>

              <CRow className="mb-3">
                <CCol xs={12}>
                  <CFormLabel className="">
                    Add Images <span style={{fontSize: '12px'}}>(Image Size should be in ratio of (WxH = 1200x1000) in pixels)</span>
                  </CFormLabel>
                </CCol>
                <CCol xs={12} className="mb-3">
                  <CFormLabel htmlFor="primaryImage">Primary Image Upload  <span className="text-danger">*</span></CFormLabel>
                  <CFormInput
                    type="file"
                    id="primaryImage"
                    onChange={handlePrimaryImageUpload}
                    accept="image/*"
                  />
                  {imagePreview.primary && (
                    <div className="mt-2">
                      <img
                        src={imagePreview.primary}
                        alt="Primary preview"
                        style={{ maxWidth: '200px', maxHeight: '150px' }}
                      />
                    </div>
                  )}
                  <ErrorMessage message={errors.productImage} />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="additionalImages">Additional Images Upload</CFormLabel>
                  <CFormInput
                    type="file"
                    id="additionalImages"
                    onChange={handleAdditionalImagesUpload}
                    accept="image/*"
                    multiple
                  />
                  {imagePreview.additional.length > 0 && (
                    <div className="mt-2 d-flex gap-2">
                      {imagePreview.additional.map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`Additional preview ${index + 1}`}
                          style={{ maxWidth: '150px', maxHeight: '100px' }}
                        />
                      ))}
                    </div>
                  )}
                </CCol>
              </CRow>

              <CRow className="mt-4">
                <CCol xs={12} className="d-flex justify-content-end gap-2">
                  <CButton onClick={() => navigate(-1)} className="px-4 border ">
                    Cancel
                  </CButton>
                  <CButton color="primary" type="submit" className="px-4">
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddProduct