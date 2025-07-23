import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import DataTable from 'src/components/DataTable'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import image from 'src/assets/images/k-101.png'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Category } from '@mui/icons-material'
import { getRequest, putRequest, postRequest, deleteRequest } from '../../../Services/apiMethods'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const SubCategoryProducts = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = React.useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentEditItem, setCurrentEditItem] = useState(null)
  const handleOpen = (id) => {
    setDeleteItemId(id)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setDeleteItemId(null)
  }

  // New state for edit form
  const [editSubCategory, setEditSubCategory] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [subCategory, setSubCategory] = useState('')
  const [category, setCategory] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [image1, setImage1] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [categories, setCategories] = useState([])
  const [userRole, setUserRole] = useState('')
  const [quantities, setQuantities] = useState({})
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [viewSubCategoryName, setViewSubCategoryName] = useState('')
  const [viewSubCategoryImage, setViewSubCategoryImage] = useState('')
  const [viewCategoryName, setViewCategoryName] = useState('')

  // Add showSuccessMessage function
  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  // Add toBase64 function
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const getCategory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await getRequest('/categories', token)
      // console.log('Category:', response)
      if (response && response.items) {
        setCategories(response.items)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to fetch categories')
    }
  }

  const navigate = useNavigate()
  const getSubCategory = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      let url = `/subCategories?pageNo=${currentPage}&pageSize=${pageSize}`
      
      const response = await getRequest(url, token)
      if (response && response.items) {
        setAllItems(response.items)
        setFilteredItems(response.items)
        setTotalItems(response.total || response.items.length)
        setPageSize(response.pageSize || 10)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sub categories:', error)
      setError('Failed to fetch sub categories')
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubCategory()
    getCategory()
    const role = localStorage.getItem('role')
    setUserRole(role)
  }, [currentPage, pageSize])

  const handleEditOpen = async (id) => {
    setEditModalVisible(true)
    const token = localStorage.getItem('token')
    const response = await getRequest(`/subCategories/${id}`, token)
    // console.log('Sub Category:', response)
    setCurrentEditItem(response.data)
    setEditSubCategory(response.data.name)
    setEditCategory(response.data.category.name)
    setEditImagePreview(response.data.image)
  }

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // console.log('Selected file:', file) // Debug log
      setEditImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        // console.log('File loaded:', reader.result) // Debug log
        setEditImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // console.log('Selected file:', file) // Debug log
      setSelectedImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        // console.log('File loaded:', reader.result) // Debug log
        setImage1(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddSubCategory = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    if (!subCategory) {
      setError('Sub Category name is required')
      return
    }

    if (!category) {
      setError('Category is required')
      return
    }

    if (!selectedImage) {
      setError('Sub Category image is required')
      return
    }

    setLoading(true)

    try {
      // Convert image to base64
      const base64Image = await toBase64(selectedImage)
      // console.log('Base64 image created:', base64Image.substring(0, 100) + '...') // Debug log

      // Create payload with base64 image
      const payload = {
        name: subCategory,
        category: category,
        image: base64Image,
      }

      // console.log('Sending payload:', { ...payload, image: 'base64 string...' }) // Debug log
      const response = await postRequest('/subCategories/create', payload, token)
      // console.log('API Response:', response) // Debug log

      // Add the new sub category to the local state
      const newSubCategory = {
        id: response.id,
        name: response.name,
        image: response.image,
        category: {
          id: category,
          name: categories.find((cat) => cat.id === category)?.name || category,
        },
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }

      setAllItems([...allItems, newSubCategory])
      setFilteredItems([...filteredItems, newSubCategory])

      // Reset form fields
      setSubCategory('')
      setCategory('')
      setSelectedImage(null)
      setImage1(null)

      showSuccessMessage('Sub Category added successfully')
      setVisible(false)
      setLoading(false)
      getSubCategory()
    } catch (error) {
      console.error('Error adding sub category:', error)
      setError('Failed to add sub category. Please try again.')
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await deleteRequest(`/subCategories/${id}`,{}, token)
      // console.log('Delete API Response:', response)
      if (response.isSuccess) {
        showSuccessMessage('Sub Category deleted successfully')
        getSubCategory()
      } else {
        setError('Failed to delete sub category')
      }
    } catch (error) {
      console.error('Error deleting sub category:', error)
      setError('Failed to delete sub category')
    }
    handleClose()
  }

  const handleUpdateSubCategory = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    if (!editSubCategory) {
      setError('Sub Category name is required')
      return
    }

    setLoading(true)

    try {
      let payload = {
        name: editSubCategory,
        categoryId: editCategory,
      }

      // Only include image in payload if a new one is selected
      if (editImage) {
        const base64Image = await toBase64(editImage)
        // console.log('Base64 image created:', base64Image.substring(0, 100) + '...') // Debug log
        payload.image = base64Image
      }

      // console.log('Sending update payload:', {
      //   ...payload,
      //   image: payload.image ? 'base64 string...' : 'unchanged',
      // }) // Debug log
      const response = await putRequest(`/subCategories/${currentEditItem.id}`, payload, token)
      // console.log('Update API Response:', response) // Debug log

      // Update the local state
      const updatedItems = allItems.map((item) => {
        if (item.id === currentEditItem.id) {
          return {
            ...item,
            name: response.name,
            image: response.image || item.image,
            category: {
              id: response.categoryId,
              name:
                categories.find((cat) => cat.id === response.categoryId)?.name ||
                response.categoryId,
            },
            updatedAt: response.updatedAt,
          }
        }
        return item
      })

      setAllItems(updatedItems)
      setFilteredItems(updatedItems)

      // Reset form fields
      setEditSubCategory('')
      setEditCategory('')
      setEditImage(null)
      setEditImagePreview(null)

      showSuccessMessage('Sub Category updated successfully')
      setEditModalVisible(false)
      setLoading(false)
      getSubCategory()
    } catch (error) {
      console.error('Error updating sub category:', error)
      setError('Failed to update sub category. Please try again.')
      setLoading(false)
    }
  }

  const handleAddItem = (subCategoryId) => {
    setQuantities(prev => ({
      ...prev,
      [subCategoryId]: (prev[subCategoryId] || 0) + 1
    }))
  }

  const handleAddToCart = (subCategoryId) => {
    const quantity = quantities[subCategoryId] || 0
    if (quantity > 0) {
      console.log('Adding to cart:', { subCategoryId, quantity })
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
      cartItems.push({ subCategoryId, quantity })
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      // Reset quantity after adding to cart
      setQuantities(prev => ({ ...prev, [subCategoryId]: 0 }))
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize)

  // Generate array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const columns = [
    {
      Header: 'S No.',
      accessor: 'serialNumber',
      width: '5%',
      Cell: ({ row }) => (currentPage - 1) * pageSize + row.index + 1,
    },
    {
      Header: 'Image',
      accessor: 'image',
      width: '10%',
      Cell: ({ value }) => (
        <img
          src={value || image}
          alt="Sub Category"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    { Header: 'Sub Category Name', accessor: 'name', width: '15%' },
    {
      Header: 'Category',
      accessor: 'category.name',
      width: '15%',
    },
    ...(userRole === 'ADMIN' ? [{
      Header: 'Action',
      accessor: 'action',
      width: '15%',
      Cell: ({ row }) => (
        <div className="flex gap-2" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <VisibilityIcon
            fontSize="small"
            className="text-gray-700 mr-3 cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => handleViewOpen(row.id)}
          />
          <DriveFileRenameOutlineIcon
            fontSize="small"
            style={{ cursor: 'pointer' }}
            onClick={() => handleEditOpen(row.id)}
          />
          <DeleteIcon
            fontSize="small"
            style={{ cursor: 'pointer' }}
            onClick={() => handleOpen(row.id)}
          />
        </div>
      ),
    }] : []),
  ]

  const handleViewOpen = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    setLoading(true)
    try {
      const response = await getRequest(`/subCategories/${id}`, token)
      setViewSubCategoryName(response.data.name)
      setViewSubCategoryImage(response.data.image || image)
      setViewCategoryName(response.data.category.name)
      setViewModalVisible(true)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sub category details:', error)
      setError('Failed to load sub category details. Please try again.')
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Sub Categories</strong>
              {userRole === 'ADMIN' && (
              <CButton
                color="primary"
                  onClick={() => setVisible(true)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                Add Sub Category
              </CButton>
              )}
            </div>
          </CCardHeader>
          <CCardBody>
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <DataTable
              data={filteredItems.map((item, index) => ({
                ...item,
                serialNumber: (currentPage - 1) * pageSize + index + 1,
              }))}
              columns={[
                {
                  Header: 'S No.',
                  accessor: 'serialNumber',
                  width: '5%',
                },
                ...columns.slice(1),
              ]}
              currentPage={currentPage}
              setcurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              pageNumbers={pageNumbers}
            />
          </CCardBody>
        </CCard>
      </CCol>
      {/* Delete Confirmation Modal */}
      <CModal visible={open} onClose={handleClose} alignment="center">
        <CModalHeader closeButton className="bg-danger text-white">
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this sub-category?</p>
          <p className="text-danger mb-0">
            <small>This action cannot be undone.</small>
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={() => handleDelete(deleteItemId)} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Add Sub Category Modal */}
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Add New Sub Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="category" className="form-label fw-bold">
              Category*
            </label>
            <CFormSelect
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-secondary"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label htmlFor="subCategory" className="form-label fw-bold">
              Sub Category Name*
            </label>
            <CFormInput
              id="subCategory"
              placeholder="Enter Sub Category Name"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border-secondary"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="categoryImage" className="form-label fw-bold">
              Sub Category Image*
            </label>
            <div className="d-flex align-items-center">
              <div className="w-100">
                <div className="image-upload-container p-3 border rounded bg-light">
                  <div className="text-center mb-3">
                    <label
                      htmlFor="categoryImage"
                      className="btn btn-primary btn-lg w-100"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fas fa-cloud-upload-alt me-2"></i>
                      {image1 ? 'Change Image' : 'Upload Sub Category Image'}
                    </label>
                    <input
                      type="file"
                      id="categoryImage"
                      accept="image/*"
                      onChange={handleAddImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <p className="text-muted text-center mb-0">
                    <small>
                      Recommended size: 400x400px, max 2MB
                      <br />
                      Supported formats: JPG, PNG, GIF
                    </small>
                  </p>
                </div>
                {image1 && (
                  <div className="mt-3 text-center">
                    <div className="image-preview-container p-2 border rounded d-inline-block">
                      <img
                        src={image1}
                        alt="Sub Category Preview"
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #dee2e6',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleAddSubCategory}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Edit modal */}
      <CModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        aria-labelledby="EditSubCategoryModalLabel"
        alignment="center"
        className="dark-modal"
      >
        <CModalHeader closeButton>
          <CModalTitle id="EditSubCategoryModalLabel">Edit Sub Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="editSubCategory" className="form-label">
              Sub Category Name
            </label>
            <CFormInput
              id="editSubCategory"
              value={editSubCategory}
              onChange={(e) => setEditSubCategory(e.target.value)}
              placeholder="Enter Sub Category Name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="editCategory" className="form-label">
              Category
            </label>
            <CFormInput
              id="editCategory"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              placeholder="Enter Category Name"
              disabled
            />
            {/* <CFormSelect
              id="editCategory"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CFormSelect> */}
          </div>

          <div className="mb-3">
            <label htmlFor="editImage" className="form-label fw-bold">
              Sub Category Image
            </label>
            <div className="d-flex align-items-center">
              <div className="w-100">
                <div className="image-upload-container p-3 border rounded bg-light">
                  <div className="text-center mb-3">
                    <label
                      htmlFor="editImage"
                      className="btn btn-primary btn-lg w-100"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fas fa-cloud-upload-alt me-2"></i>
                      {editImage ? 'Change Image' : 'Upload New Image'}
                    </label>
                    <input
                      type="file"
                      id="editImage"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <p className="text-muted text-center mb-0">
                    <small>
                      Recommended size: 400x400px, max 2MB
                      <br />
                      Supported formats: JPG, PNG, GIF
                    </small>
                  </p>
                </div>
                {(editImagePreview || currentEditItem?.image) && (
                  <div className="mt-3 text-center">
                    <div className="image-preview-container p-2 border rounded d-inline-block">
                      <img
                        src={editImagePreview || currentEditItem?.image}
                        alt="Sub Category Preview"
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #dee2e6',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleUpdateSubCategory}
            // style={{ backgroundColor: '#FF6B1F', border: 'none' }}
          >
            Update
          </CButton>
        </CModalFooter>
      </CModal>
      {/* View modal */}
      <CModal
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        aria-labelledby="ViewSubCategoryModalLabel"
        alignment="center"
        size="lg"
      >
        <CModalHeader closeButton className="bg-primary text-white">
          <CModalTitle id="ViewSubCategoryModalLabel">View Sub Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="viewCategoryName" className="form-label fw-bold">
              Category Name
            </label>
            <CFormInput
              id="viewCategoryName"
              value={viewCategoryName}
              disabled
              className="border-secondary"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="viewSubCategoryName" className="form-label fw-bold">
              Sub Category Name
            </label>
            <CFormInput
              id="viewSubCategoryName"
              value={viewSubCategoryName}
              disabled
              className="border-secondary"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="viewSubCategoryImage" className="form-label fw-bold">
              Sub Category Image
            </label>
            <div className="d-flex align-items-center">
              <CCol xs={12} className="mb-4">
                <div className="image-preview-container p-2 border rounded d-inline-block">
                  <img
                    src={viewSubCategoryImage}
                    alt="Sub Category Preview"
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                    }}
                  />
                </div>
              </CCol>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default SubCategoryProducts
