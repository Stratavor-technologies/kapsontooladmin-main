import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormSelect,
} from '@coreui/react'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import DataTable from 'src/components/DataTable'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import { getRequest } from '../../Services/apiMethods'

const OtherOrders = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedParty, setSelectedParty] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [uniqueParties, setUniqueParties] = useState([])
  const [uniqueStatuses, setUniqueStatuses] = useState([])

  const navigate = useNavigate()
  
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const getGetOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      const cleanRole = role?.replace(/"/g, '')
      const response = await getRequest(`orders?role=${cleanRole}&type=1`, token)
      
      console.log('API Response:', response)
      
      if (response && response.items && Array.isArray(response.items)) {
        const formattedItems = response.items.map((item) => ({
          OrderNo: item.orderNumber || '',
          Partyname: item.addressId?.partyDetails?.partyName || '',   
          OrderAmount: item.totalAmount || 
            (item.items?.reduce((total, orderItem) => total + (orderItem.totalPrice || 0), 0) || 0),
          Dated: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
          Status: item.status || '',
          PaymentStatus: item.paymentStatus || '',
          PaymentMode: item.paymentMode || '',
          PaymentDate: item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '',
          DeliveryDate: item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : '',
          DeliveryStatus: item.deliveryStatus || '',
          Address: item.addressId?.address || '',
          OrderItems: item.items || [],
          OrderId: item.id || '',
          OrderType: item.orderType || '',  
          action: '',
        }))
        
        // Extract unique party names and statuses for filters
        const parties = [...new Set(formattedItems
          .map(item => item.Partyname)
          .filter(name => name))]
        
        const statuses = [...new Set(formattedItems
          .map(item => item.Status)
          .filter(status => status))]
        
        setUniqueParties(parties)
        setUniqueStatuses(statuses)
        setAllItems(formattedItems)
        setFilteredItems(formattedItems)
      } else {
        console.error('Invalid response format:', response)
        setAllItems([])   
        setFilteredItems([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setAllItems([])
      setFilteredItems([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders on component mount
  useEffect(() => {
    getGetOrders()
    const role = localStorage.getItem('role')
    setUserRole(role)
  }, [])

  // Handlers for form controls
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value)
  }

  const handlePartyChange = (e) => {
    setSelectedParty(e.target.value)
  }

  // Handler for search button
  const handleSearch = () => {
    let results = [...allItems]

    if (selectedStatus) {
      results = results.filter((item) => item.Status === selectedStatus)
    }

    if (selectedParty) {
      results = results.filter((item) => item.Partyname === selectedParty)
    }

    setFilteredItems(results)
    setCurrentPage(1) // Reset to first page after filtering
  }

  // Handler for reset filters
  const handleResetFilters = () => {
    setSelectedStatus('')
    setSelectedParty('')
    setFilteredItems(allItems)
    setCurrentPage(1)
  }

  // Handler for navigate to my orders
  const handleMyOrders = () => {
    navigate('/Orders')
  }

  // Handlers for the action buttons
  const handleViewOrder = (orderId) => {
    navigate(`/Orders/ViewOtheroders/${orderId}`)
  }

  const handleShipOrder = (orderId) => {
    navigate(`/Orders/ShipOrder/${orderId}`)
  }

  const columns = [
    { Header: 'Order No.', accessor: 'OrderNo', width: '10%' },
    // { Header: 'Party Name', accessor: 'Partyname', width: '20%' },
    { Header: 'Order Amount ($)', accessor: 'OrderAmount', width: '15%', 
      Cell: ({ value }) => `$${Number(value).toFixed(2)}` },
    { Header: 'Date', accessor: 'Dated', width: '15%' },
    { Header: 'Status', accessor: 'Status', width: '15%',
      Cell: ({ value }) => (
        <span className={`badge ${getStatusBadgeClass(value)}`}>
          {value}
        </span>
      )},
    {
      Header: 'Action',
      accessor: 'action',
      width: '15%',
      Cell: ({ row }) => (
        <div className="flex gap-2" style={{ display: 'flex', gap: '10px' }}>
          <VisibilityIcon
            fontSize="small"
            className="text-primary cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => handleViewOrder(row.OrderId)}
            title="View Order Details"
          />
        </div>
      ),
    },
  ]

  // Helper function to get badge class based on status
  const getStatusBadgeClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-success text-white';
      case 'PENDING':
        return 'bg-warning text-dark';
      case 'CANCELLED':
        return 'bg-danger text-white';
      case 'PROCESSING':
        return 'bg-info text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Other Orders</strong>
              <CButton
                color="primary"
                onClick={handleMyOrders}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                Other Orders
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3 mb-4">
              <CCol md={4}>
                <CFormSelect
                  id="statusSelect"
                  label="Status"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  <option value="">All Statuses</option>
                  {uniqueStatuses.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  id="partySelect"
                  label="Party Name"
                  value={selectedParty}
                  onChange={handlePartyChange}
                >
                  <option value="">All Parties</option>
                  {uniqueParties.map((party, index) => (
                    <option key={index} value={party}>
                      {party}
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
                >
                  <SearchIcon fontSize="small" style={{ marginRight: '5px' }} />
                  Search
                </CButton>
              </CCol>
              <CCol md={2} className="d-flex align-items-end">
                <CButton
                  color="secondary"
                  className="w-100"
                  onClick={handleResetFilters}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Reset
                </CButton>
              </CCol>
            </CForm>

            {loading ? (
              <div className="text-center p-4">Loading orders...</div>
            ) : (
              <DataTable
                data={filteredItems}
                columns={columns}
                currentPage={currentPage}
                setcurrentPage={setCurrentPage}
                totalItems={filteredItems.length}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={open} onClose={handleClose} alignment="center">
        <CModalHeader closeButton>
          <CModalTitle>Confirm Action</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to perform this action?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleClose}>
            Confirm
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default OtherOrders