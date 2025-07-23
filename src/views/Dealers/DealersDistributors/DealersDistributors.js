import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTooltip,
  CSpinner,
  CRow,
} from '@coreui/react'
import DataTable from 'src/components/DataTable'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import { getRequest, deleteRequest } from '../../../Services/apiMethods'
import Switch from '@mui/material/Switch'

const DealersDistributors = () => {
  const [dealers, setDealers] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [userRole, setUserRole] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)

  const navigate = useNavigate()

  const handleOpen = (id) => {
    console.log('Selected item ID:', id)
    setSelectedItemId(id)
    setOpen(true)
  }
  
  const handleClose = () => setOpen(false)

  // Function to truncate text and add ellipsis
  const truncateText = (text, maxLength) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }

  // Handle page change from DataTable
  const handlePageChange = (newPage) => {
    console.log('Changing to page:', newPage)
    setCurrentPage(newPage)
  }
  const handleAddProduct=()=>{
   
  }

  const fetchDealers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      const cleanRole = role?.replace(/"/g, '')
      setUserRole(cleanRole)

      const response = await getRequest(`/users?pageNo=${currentPage}&pageSize=${pageSize}`, token)
      
      if (response && response.items) {
        const formattedItems = response.items.map((item, index) => ({
          id: item.id,
          SrNo: (currentPage - 1) * pageSize + index + 1,
          firm: item.fullName || item.firmName || 'N/A',
          contactPerson: item.contactPerson || 'N/A',
          contactNo: item.phone || 'N/A',
          area: item.address || 'N/A',
          createdBy: item.createdBy?.fullName || 'Self',
          status: item.status === 'active',
          action: '',
        }))

        setDealers(formattedItems)
        setTotalItems(response.total || 0)
        setPageSize(response.pageSize || 10)
      } else {
        console.error('Invalid response format:', response)
        setDealers([])
        setTotalItems(0)
      }
    } catch (error) {
      console.error('Error fetching dealers:', error)
      setDealers([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }
  

  useEffect(() => {
    fetchDealers()
  }, [currentPage])

  const columns = [
    { Header: 'S No.', accessor: 'SrNo', width: '5%' },
    { Header: 'Firm Name', accessor: 'firm', width: '8%' },
    { Header: 'Contact Person', accessor: 'contactPerson', width: '15%' },
    { Header: 'Contact No.', accessor: 'contactNo', width: '10%' },
    { Header: 'Dealership Area', accessor: 'area', width: '10%' },
    { Header: 'Created By', accessor: 'createdBy', width: '8%' },
    // {
    //   Header: 'Status',
    //   accessor: 'status',
    //   width: '8%',
    //   Cell: ({ row }) => {
    //     const status = row?.status || false
    //     return <Switch checked={status} onChange={() => handleStatusChange(row.id)} />
    //   },
    // },
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
            onClick={() => navigate(`/DealersDistributors/DealerShipView/${row.id}`)}
          />
          <DriveFileRenameOutlineIcon
            fontSize="small"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/DealersDistributors/DealerShipEdit/${row.id}`)}
          />
          <DeleteIcon 
            fontSize="small" 
            style={{ cursor: 'pointer' }} 
            onClick={() => handleOpen(row.id)} 
          />
        </div>
      ),
    },
  ]

  const handleDelete = async () => {
    const token = localStorage.getItem('token')
    try {
      await deleteRequest(`users/${selectedItemId}`, token)
      // Refresh the data after deletion
      fetchDealers()
      handleClose()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Dealers / Distributors</strong>
              {(userRole === 'ADMIN' || userRole === 'DISTRIBUTER') && (
                <CButton
                  color="primary"
                  onClick={() => navigate('/DealersDistributors/AddDealerDistributor')}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                  {userRole === 'ADMIN' ? 'Add Dealers / Distributors' : 'Add Dealers'}
                </CButton>
              )}
            </div>
          </CCardHeader>
          <CCardBody style={{ paddingTop: '10px' }}>
            {loading ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
                <p className="mt-2">Loading data...</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                  Page {currentPage} • Showing {dealers.length} items
                </div>
                <DataTable
                  data={dealers}
                  columns={columns}
                  currentPage={currentPage}
                  setcurrentPage={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={pageSize}
                />
              </>
            )}
          </CCardBody>
        </CCard>
        <CModal visible={open} onClose={handleClose} alignment="center">
          <CModalHeader closeButton>
            <CModalTitle>Confirm Deletion</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this item?</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleClose}>
              Cancel
            </CButton>
            <CButton color="danger" onClick={handleDelete}>
              Delete
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}

export default DealersDistributors