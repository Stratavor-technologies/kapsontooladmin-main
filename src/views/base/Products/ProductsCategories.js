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
  CFormLabel,
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
import { getRequest, putRequest, postRequest, deleteRequest } from '../../../Services/apiMethods'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const ProductsCategories = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentEditItem, setCurrentEditItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // New state for edit form
  const [editSubCategory, setEditSubCategory] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [subCategory, setSubCategory] = useState('')
  const [category, setCategory] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [image1, setImage1] = useState(null)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [userRole, setUserRole] = useState('')
  const [quantities, setQuantities] = useState({})
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [viewCategoryName, setViewCategoryName] = useState('')
  const [viewCategoryImage, setViewCategoryImage] = useState('')  

  const categoryOptions = [
    { value: 'Hand Tools', label: 'Hand Tools' },
    { value: 'Power Tools', label: 'Power Tools' },
    { value: 'Cutting Tools', label: 'Cutting Tools' },
    { value: 'Woodworking Tools', label: 'Woodworking Tools' },
  ]

  // Set up initial data
  useEffect(() => {
    getCategory()
    const role = localStorage.getItem('role')
    setUserRole(role)
  }, [currentPage, pageSize])

  // Calculate total pages
  const totalPages = Math.ceil(filteredItems.length / pageSize)

  // Generate array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Function to display success message for a few seconds
  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const getCategory = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    setLoading(true)
    try {
      let url = `/categories?pageNo=${currentPage}&pageSize=${pageSize}`
      const response = await getRequest(url, token)
      // console.log('Raw API response:', response) // Log the entire response

      if (!response.items || !Array.isArray(response.items)) {
        console.error('Invalid response format:', response)
        setError('Invalid data format received from server')
        setLoading(false)
        return
      }

      // Process the data to ensure image URLs are correct
      const processedItems = response.items.map((item) => {
        // console.log('Processing item:', item) // Log each item

        // Check if the image property exists and log its value
        if (item.categoryImage) {
          // console.log('Image found for item:', item.name, item.categoryImage)
        } else {
          // console.log('No image found for item:', item.name)
        }

        return {
          ...item,
          // Make sure we're using the correct property name for the image
          image: item.image || item.categoryImage || null,
        }
      })

      setCategories(processedItems)
      setAllItems(processedItems)
      setFilteredItems(processedItems)
      setTotalItems(response.total || response.items.length)
      setPageSize(response.pageSize || 10)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to load categories. Please try again.')
      setLoading(false)
    }
  }

  const handleEditOpen = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    setLoading(true)
    try {
      const response = await getRequest(`/categories/${id}`, token)
      setCurrentEditItem(response.data)
      setEditSubCategory(response.data.name)
      setEditImagePreview(response.data.image)
      setEditModalVisible(true)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching category details:', error)
      setError('Failed to load category details. Please try again.')
      setLoading(false)
    }
  }

  const handledelete = (id) => {
    setDeleteId(id)
    setOpen(true)
  }

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('token')
    if (!token || !deleteId) {
      console.error('No authentication token found or no item selected')
      return
    }

    setLoading(true)
    try {
      await deleteRequest(`/categories/${deleteId}`, {}, token)

      // Update the local state to remove the deleted item
      const updatedItems = allItems.filter((item) => item.id !== deleteId)
      setAllItems(updatedItems)
      setFilteredItems(updatedItems)

      showSuccessMessage('Category deleted successfully')
      setOpen(false)
      setLoading(false)
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('Failed to delete category. Please try again.')
      setLoading(false)
    }
  }
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setEditImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImage1(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddCategory = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    if (!subCategory) {
      setError('Category name is required')
      return
    }

    if (!selectedImage) {
      setError('Category image is required')
      return
    }

    setLoading(true)

    try {
      // Convert image to base64
      const base64Image = await toBase64(selectedImage)

      // Create payload with base64 image
      const payload = {
        name: subCategory,
        categoryImage: base64Image,
      }

      const response = await postRequest('/categories/create', payload, token)

      // Add the new category to the local state
      const newCategory = {
        id: response.id,
        name: response.name,
        image: response.image,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }

      setAllItems([...allItems, newCategory])
      setFilteredItems([...filteredItems, newCategory])

      // Reset form fields
      setSubCategory('')
      setSelectedImage(null)
      setImage1(null)

      showSuccessMessage('Category added successfully')
      setVisible(false)
      setLoading(false)
      getCategory()
    } catch (error) {
      console.error('Error adding category:', error)
      setError('Failed to add category. Please try again.')
      setLoading(false)
    }
  }

  const handleViewOpen = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }

    setLoading(true)
    try {
      const response = await getRequest(`/categories/${id}`, token)
      setViewCategoryName(response.data.name)
      setViewCategoryImage(response.data.image || response.data.categoryImage || image)
      setViewModalVisible(true)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching category details:', error)
      setError('Failed to load category details. Please try again.')
      setLoading(false)
    }
  }
  const handleUpdateSubCategory = async () => {
    const token = localStorage.getItem('token')
    if (!token || !currentEditItem) {
      console.error('No authentication token found or no item selected')
      return
    }

    setLoading(true)

    try {
      let base64Image = null
      if (editImage && typeof editImage !== 'string') {
        base64Image = await toBase64(editImage)
      }

      // Create JSON payload with base64 image string
      const payload = {
        name: editSubCategory,
        categoryImage: base64Image || (typeof editImage === 'string' ? editImage : null),
      }

      const response = await putRequest(`/categories/${currentEditItem.id}`, payload, token)

      const updatedItems = allItems.map((item) => {
        if (item.id === currentEditItem.id) {
          return {
            ...item,
            name: editSubCategory,
            image: response.image || item.image,
            updatedAt: new Date().toISOString(),
          }
        }
        return item
      })

      setAllItems(updatedItems)
      setFilteredItems(updatedItems)
      showSuccessMessage('Category updated successfully')
      setEditModalVisible(false)
      setLoading(false)
      getCategory()
    } catch (error) {
      console.error('Error updating category:', error)
      setError('Failed to update category. Please try again.')
      setLoading(false)
    }
  }

  const handleAddItem = (categoryId) => {
    setQuantities(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || 0) + 1
    }))
  }

  const handleAddToCart = (categoryId) => {
    const quantity = quantities[categoryId] || 0
    if (quantity > 0) {
      console.log('Adding to cart:', { categoryId, quantity })
      // Add your cart logic here
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
      cartItems.push({ categoryId, quantity })
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      // Reset quantity after adding to cart
      setQuantities(prev => ({ ...prev, [categoryId]: 0 }))
    }
  }

  const columns = [
    {
      Header: 'S No.',
      accessor: 'serialNumber',
      width: '5%',
      Cell: ({ row }) => (currentPage - 1) * pageSize + row.index + 1,
    },
    {
      Header: 'Image',
      accessor: 'categoryImage',
      width: '10%',
      Cell: ({ value }) => (
        <img
          src={value || image}
          alt="Category"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
        />
      ),
    },
    { Header: 'Category Name', accessor: 'name', width: '15%' },
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
            onClick={() => handledelete(row.id)}
          />
        </div>
      ),
    }] : []),
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Categories</strong>
              {userRole === 'ADMIN' && (
                <CButton
                  color="primary"
                  onClick={() => setVisible(true)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                  Add Category
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
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setError(null)}
                  style={{ float: 'right' }}
                ></button>
              </div>
            )}

            {loading ? (
              <div className="text-center my-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
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
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Delete Confirmation Modal */}
      <CModal visible={open} onClose={() => setOpen(false)} alignment="center">
        <CModalHeader closeButton className="bg-danger text-white">
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this category?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOpen(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add Category Modal */}
      <CModal
        visible={visible}
        onClose={() => {
          setVisible(false)
          setSubCategory('')
          setSelectedImage(null)
          setImage1(null)
        }}
        aria-labelledby="AddCategoryModalLabel"
        alignment="center"
        size="lg"
      >
        <CModalHeader className="bg-primary text-white">
          <CModalTitle id="AddCategoryModalLabel">Add New Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label fw-bold">
              Category Name*
            </label>
            <CFormInput
              id="categoryName"
              placeholder="Enter Category Name"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border-secondary"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="categoryImage" className="form-label fw-bold">
              Category Image*
            </label>
            <div className="d-flex align-items-center">
              <div>
                <label
                  htmlFor="categoryImage"
                  className="btn btn-primary mb-2"
                  style={{ cursor: 'pointer' }}
                >
                  {image1 ? 'Change Image' : 'Add Category Image'}
                </label>
                <input
                  type="file"
                  id="categoryImage"
                  accept="image/*"
                  onChange={handleAddImageChange}
                  style={{ display: 'none' }}
                />
                <p className="text-muted small">(Recommended size: 400x400px, max 2MB)</p>
              </div>
            </div>
            {image1 && (
              <div className="me-3 mt-2">
                <img
                  src={image1}
                  alt="Category Preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6',
                  }}
                />
              </div>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false)
              setSubCategory('')
              setSelectedImage(null)
              setImage1(null)
            }}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleAddCategory}
            disabled={loading || !subCategory || !selectedImage}
          >
            {loading ? 'Saving...' : 'Save Category'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* View modal */}
      <CModal
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        aria-labelledby="ViewCategoryModalLabel"
        alignment="center"
        size="lg"
      >
        <CModalHeader closeButton className="bg-primary text-white">
          <CModalTitle id="ViewCategoryModalLabel">View Category</CModalTitle>
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
            <label htmlFor="viewCategoryImage" className="form-label fw-bold">
              Category Image
            </label>
            <div className="d-flex align-items-center">
              <CCol xs={12} className="mb-4">
                <div className="image-preview-container p-2 border rounded d-inline-block">
                  <img
                    src={viewCategoryImage}
                    alt="Category Preview"
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

      {/* Edit modal */}
      <CModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        aria-labelledby="EditCategoryModalLabel"
        alignment="center"
        size="lg"
      >
        <CModalHeader closeButton className="bg-primary text-white">
          <CModalTitle id="EditCategoryModalLabel">Edit Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="editSubCategory" className="form-label fw-bold">
              Category Name*
            </label>
            <CFormInput
              id="editSubCategory"
              value={editSubCategory}
              onChange={(e) => setEditSubCategory(e.target.value)}
              placeholder="Enter Category Name"
              className="border-secondary"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="editImage" className="form-label fw-bold">
              Category Image
            </label>
            <div className="d-flex align-items-center">
              <CCol xs={12} className="mb-4">
                <div className="flex flex-col items-start gap-3">
                  <label
                    htmlFor="editImage"
                    className="btn btn-primary mb-2"
                    style={{ cursor: 'pointer' }}
                  >
                    {editImage ? 'Change Image' : 'Change Image'}
                  </label>
                  <input
                    type="file"
                    id="editImage"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    style={{ display: 'none' }}
                  />
                  <p className="text-muted small">(Recommended size: 400x400px, max 2MB)</p>

                  {editImage && (
                    <div className="w-40 h-40 rounded-lg overflow-hidden border border-gray-300 mt-3">
                      <img
                        src={
                          typeof editImage === 'string' ? editImage : URL.createObjectURL(editImage)
                        }
                        alt="Selected"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </CCol>
            </div>
            {editImagePreview && (
              <div className="me-3 mt-2">
                <img
                  src={editImagePreview}
                  alt="Category Preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6',
                  }}
                />
              </div>
            )}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleUpdateSubCategory}
            disabled={loading || !editSubCategory}
          >
            {loading ? 'Updating...' : 'Update'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ProductsCategories
