import React, { useState, useEffect, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormSelect,
  CBadge,
  CSpinner
} from '@coreui/react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import DataTable from 'src/components/DataTable'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import image from 'src/assets/images/k-101.png'
import { useNavigate } from 'react-router-dom'
import { getRequest, deleteRequest, postRequest } from 'src/Services/apiMethods'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const AllProducts = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false) // Added loading state
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const navigate = useNavigate()

  // Count unique products in cart (not total quantity)
  const uniqueProductsInCart = cartItems.length

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true) // Show loading state when fetching data
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        setLoading(false)
        return
      }

      let url = `/products?pageNo=${currentPage}&pageSize=${pageSize}`

      // Add category and subcategory filters if selected
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`
      }
      if (selectedSubCategory) {
        url += `&subCategory=${encodeURIComponent(selectedSubCategory)}`
      }

      const response = await getRequest(url, token)
      console.log('API Response:', response) // Keep existing debug log

      if (response.isSuccess && response.items) {
        setAllItems(response.items)
        setFilteredItems(response.items)
        setTotalItems(response.total || response.items.length)
        setPageSize(response.pageSize || 10)
      } else {
        console.error('Invalid response format:', response)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false) // Hide loading state after fetching
    }
  }, [currentPage, pageSize, selectedCategory, selectedSubCategory])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const role = localStorage.getItem('role')
    setUserRole(role)
  }, [])

  // Get subcategories based on selected category
  const subCategories = selectedCategory
    ? [
        ...new Set(
          allItems
            .filter((item) => item?.category?.name === selectedCategory)
            .map((item) => item?.subCategory?.name || ''),
        ),
      ].filter(Boolean)
    : [...new Set(allItems.map((item) => item?.subCategory?.name || ''))].filter(Boolean)

  // Extract unique categories
  const categories = [...new Set(allItems.map((item) => item?.category?.name || ''))].filter(
    Boolean,
  )

  // Handlers for form controls
  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    setSelectedSubCategory('') // Reset subcategory when category changes
    setCurrentPage(1) // Reset to first page when changing category
  }

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value)
    setCurrentPage(1) // Reset to first page when changing subcategory
  }

  // Handler for search button
  const handleSearch = () => {
    setCurrentPage(1) // Reset to first page when searching
    fetchProducts() // Fetch products with new filters
  }

  // Handler for add new product
  const handleAddProduct = () => {
    navigate('/Products/AllProducts/AddProduct')
  }

  // Navigate to cart page and send cart data to API
  const navigateToCart = async () => {
    try {
      // Don't proceed if cart is empty
      if (uniqueProductsInCart === 0) {
        return
      }

      setLoading(true) // Add loading state
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        setLoading(false)
        return
      }

      // Format cart items according to the required payload structure
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price || 0,
        })),
      }

      // console.log('Sending cart data:', payload)

      // Send the cart data to the API
      try {
        const response = await postRequest('/carts/addToCart', payload, token)

        // console.log('Cart API response:', response)

        if (response.data && response.success === true) {
          // Navigate to cart page after successful API call
          navigate('/CreateOrder')
        } else {
          setError('Failed to add items to cart')
        }
      } catch (apiError) {
        console.error('API error:', apiError)
        setError('Error adding items to cart')
      }
    } catch (error) {
      console.error('Error sending cart data:', error)
      setError('Error adding items to cart')
    } finally {
      setLoading(false) // Hide loading state
    }
  }

  // Handlers for the action buttons
  const handleViewOpen = (id) => {
    navigate(`/Products/AllProducts/ViewProduct/${id}`)
  }

  const handleEditOpen = (id) => {
    navigate(`/Products/AllProducts/EditProduct/${id}`)
  }

  const handleDeleteOpen = (id) => {
    setSelectedProductId(id)
    setOpen(true)
  }

  const handleDelete = async () => {
    try {
      setLoading(true) // Add loading state
      console.log('Delete item with ID:', selectedProductId)
      const token = localStorage.getItem('token')
      const response = await deleteRequest(`/products/${selectedProductId}`, {}, token)
      console.log('Delete response:', response)

      if (response && response.isSuccess) {
        setSuccess('Product deleted successfully')
        fetchProducts()
        setOpen(false)
        setSelectedProductId(null)
      } else {
        setError('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product')
    } finally {
      setLoading(false) // Hide loading state
    }
  }

  const handleAddToCart = (productId) => {
    const product = allItems.find((item) => item.id === productId)
    if (!product) return

    const price = product?.basicPrice || 0

    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex((item) => item.productId === productId)

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedCartItems = [...cartItems]
      updatedCartItems[existingItemIndex].quantity += 1
      setCartItems(updatedCartItems)
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          productId,
          quantity: 1,
          price,
          name: product.productName,
          image: product.productImage?.[0] || image,
        },
      ])
    }
  }

  const columns = [
    {
      Header: 'S No.',
      accessor: 'serialNumber',
      width: '5%',
    },
    {
      Header: 'Image',
      accessor: 'productImage',
      width: '10%',
      Cell: ({ value }) => (
        <img
          src={value?.[0] || image}
          alt="Product"
          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          loading="lazy" // Add lazy loading for better performance
        />
      ),
    },
    { Header: 'Art No.', accessor: 'ArtNumber', width: '8%' },
    { Header: 'Tool Name', accessor: 'productName', width: '15%' },
    {
      Header: 'Sub Category',
      accessor: 'subCategory.name',
      width: '10%',
      Cell: ({ row }) => row.subCategory?.name || 'N/A',
    },
    {
      Header: 'Category',
      accessor: 'category.name',
      width: '10%',
      Cell: ({ row }) => row.category?.name || 'N/A',
    },
    { Header: 'M.R.P', accessor: 'mrp', width: '8%' },
    { Header: 'Basic Price', accessor: 'basicPrice', width: '8%' },
    { Header: 'Stock', accessor: 'stock', width: '8%' },
    {
      Header: 'Updated On',
      accessor: 'updatedAt',
      width: '10%',
      Cell: ({ value }) => {
        const date = new Date(value)
        return date.toLocaleDateString()
      },
    },
    {
      Header: 'Action',
      accessor: 'action',
      width: '12%',
      Cell: ({ row }) => (
        <div className="flex gap-2" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <VisibilityIcon
            fontSize="small"
            className="text-gray-700 mr-3 cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => handleViewOpen(row.id)}
          />
          {userRole === 'ADMIN' ? (
            <>
              <DriveFileRenameOutlineIcon
                fontSize="small"
                style={{ cursor: 'pointer' }}
                onClick={() => handleEditOpen(row.id)}
              />
              <DeleteIcon
                fontSize="small"
                style={{ cursor: 'pointer' }}
                onClick={() => handleDeleteOpen(row.id)}
              />
            </>
          ) : (
            <CButton color="primary" size="sm" onClick={() => handleAddToCart(row.id)}>
              Add
            </CButton>
          )}
        </div>
      ),
    },
  ]

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize)

  // Generate array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>All Products</strong>
              <div className="d-flex align-items-center gap-3">
                {userRole !== 'ADMIN' && (
                  <div
                    onClick={navigateToCart}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: uniqueProductsInCart > 0 ? 'pointer' : 'not-allowed',
                      position: 'relative',
                    }}
                  >
                    <ShoppingCartIcon
                      style={{
                        fontSize: '24px',
                        color: uniqueProductsInCart > 0 ? '#0d6efd' : '#ccc',
                      }}
                    />
                    {uniqueProductsInCart > 0 && (
                      <CBadge
                        color="danger"
                        shape="rounded-pill"
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          fontSize: '12px',
                        }}
                      >
                        {uniqueProductsInCart}
                      </CBadge>
                    )}
                  </div>
                )}
                {userRole === 'ADMIN' && (
                  <CButton
                    color="primary"
                    onClick={handleAddProduct}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                    Add Product
                  </CButton>
                )}
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3 mb-4">
              <CCol md={4}>
                <CFormSelect
                  id="categorySelect"
                  label="Category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  id="subCategorySelect"
                  label="Sub Category"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                >
                  <option value="">All Sub Categories</option>
                  {subCategories.map((subCategory, index) => (
                    <option key={index} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2} className="d-flex align-items-end">
                <CButton
                  color="primary"
                  className="w-100"
                  onClick={handleSearch}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  disabled={loading}
                >
                  {loading ? (
                    <CSpinner size="sm" />
                  ) : (
                    <>
                      <SearchIcon fontSize="small" style={{ marginRight: '5px' }} />
                      Search
                    </>
                  )}
                </CButton>
              </CCol>
            </CForm>

            {/* Add loading indicator */}
            {loading ? (
              <div className="text-center my-4">
                <CSpinner color="primary" />
                <p className="mt-2">Loading products...</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredItems.map((item, index) => ({
                  ...item,
                  serialNumber: (currentPage - 1) * pageSize + index + 1,
                }))}
                currentPage={currentPage}
                setcurrentPage={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                pageNumbers={pageNumbers}
              />
            )}
            
            {/* Display success/error messages */}
            {success && (
              <div className="alert alert-success mt-3" role="alert">
                {success}
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={open} onClose={handleClose} alignment="center">
        <CModalHeader closeButton>
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this item?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AllProducts