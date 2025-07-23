import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton,
  CForm,
  CFormSelect,
} from '@coreui/react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import DataTable from 'src/components/DataTable'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import image from 'src/assets/images/k-101.png'
import { useNavigate } from 'react-router-dom'
import { getRequest } from '../../Services/apiMethods'

const AllOrders = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const navigate = useNavigate()

  // Fetch orders from API
  const getOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      const cleanRole = role?.replace(/"/g, '')

      const response = await getRequest(`/orders?pageNo=${currentPage}&pageSize=${pageSize}`, token)
      // console.log('API Response:', response)

      if (response && response.items) {
        const formattedItems = response.items.map((item, index) => ({
          id: item.id,
          OrderNo: (currentPage - 1) * pageSize + index + 1,
          Partyname: item.addressId?.partyDetails?.partyName || item.userId?.fullName || '',
          OrderAmount: item.totalAmount || 0,
          Dated: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
          Status: item.status || 'PENDING',
          action: '',
        }))

        setAllItems(formattedItems)
        setFilteredItems(formattedItems)
        setTotalItems(response.total || 0)
        setPageSize(response.pageSize || 10)
      } else {
        console.error('Invalid response format:', response)
        setAllItems([])
        setFilteredItems([])
        setTotalItems(0)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setAllItems([])
      setFilteredItems([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  // Set up initial data
  useEffect(() => {
    getOrders()
    const role = localStorage.getItem('role')
    setUserRole(role)
  }, [currentPage]) // Add currentPage as dependency

  // Extract unique categories and subcategories from API data
  const categories = [...new Set(allItems.map((item) => item.category))].filter(Boolean)
  const subCategories = selectedCategory
    ? [
        ...new Set(
          allItems
            .filter((item) => item.category === selectedCategory)
            .map((item) => item.subCategory),
        ),
      ].filter(Boolean)
    : [...new Set(allItems.map((item) => item.subCategory))].filter(Boolean)

  // Handlers for form controls
  const handleCategoryChange = (e) => {
    const category = e.target.value
    setSelectedCategory(category)
    setSelectedSubCategory('') // Reset subcategory when category changes
  }

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value)
  }

  // Handler for search button
  const handleSearch = () => {
    let results = [...allItems]

    if (selectedCategory) {
      results = results.filter((item) => item.category === selectedCategory)
    }

    if (selectedSubCategory) {
      results = results.filter((item) => item.subCategory === selectedSubCategory)
    }

    setFilteredItems(results)
    setCurrentPage(1) // Reset to first page after filtering
  }

  // Handler for add new product
  const handleAddProduct = () => {
    navigate('/Orders/OtherOrders')
    // Implement your add product functionality here
    // This would typically navigate to a form or open a modal
  }

  // Handlers for the action buttons
  const handleViewOpen = (id) => {
    navigate(`/Orders/ViewOrder/${id}`)
  }

  const handleEditOpen = (id) => {
    // console.log('Edit item with ID:',id)
    navigate(`/Orders/OrderDispatch/${id}`)
    // Implement your edit functionality here
  }

  const handleDeleteOpen = (id) => {
    // console.log('Delete item with ID:', id)
    // Implement your delete functionality here
  }

  const columns = [
    { Header: 'Sr No.', accessor: 'OrderNo', width: '5%' },
    { Header: 'Party Name.', accessor: 'Partyname', width: '8%' },
    { Header: 'Order Amt $', accessor: 'OrderAmount', width: '8%' },
    { Header: 'Dated', accessor: 'Dated', width: '10%' },
    { Header: 'Status', accessor: 'Status', width: '8%' },
    ...(userRole !== 'DEALER' ? [
      {
        Header: 'Action',
        accessor: 'action',
        width: '8%',
        Cell: ({ row }) => (
          <div className="flex gap-2" style={{ display: 'flex', gap: '10px' }}>
            <VisibilityIcon
              fontSize="small"
              className="text-gray-700 mr-3 cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                // console.log('View order with ID:', row.id)
                handleViewOpen(row.id)
              }}
            />
            <LocalShippingIcon
              fontSize="small"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                // console.log('Edit order with ID:', row.id)
                handleEditOpen(row.id)
              }}
            />
          </div>
        ),
      }
    ] : []),
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong> All Orders</strong>
              {userRole === 'DISTRIBUTER' && (
                <CButton
                  color="primary"
                  onClick={handleAddProduct}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                  My Orders
                </CButton>
              )}
            </div>
          </CCardHeader>
          <CCardBody style={{ paddingTop: '10px' }}>
            <DataTable
              data={filteredItems}
              columns={columns}
              currentPage={currentPage}
              setcurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={pageSize}
            />
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
          <CButton color="danger" onClick={() => console.log('Item deleted')}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AllOrders
