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
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useNavigate } from 'react-router-dom'
import { getRequest, deleteRequest, putRequest, postRequest } from 'src/Services/apiMethods'

const ProductHsn = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentEditItem, setCurrentEditItem] = useState(null)
  const [userRole, setUserRole] = useState('')
  const [quantities, setQuantities] = useState({})

  // Separate state variables for add and edit
  const [addHsnNumber, setAddHsnNumber] = useState('')
  const [addGstPercentage, setAddGstPercentage] = useState('')
  const [editHsnNumber, setEditHsnNumber] = useState('')
  const [editGstPercentage, setEditGstPercentage] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [deleteItemId, setDeleteItemId] = useState(null)

  const navigate = useNavigate()

  // Show success message function
  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  const getHsn = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      let url = `/hsnNumbers?pageNo=${currentPage}&pageSize=${pageSize}`
      
      const response = await getRequest(url, token)
      if (response && response.items) {
        setAllItems(response.items)
        setFilteredItems(response.items)
        setTotalItems(response.total || response.items.length)
        setPageSize(response.pageSize || 10)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching HSN numbers:', error)
      setError('Failed to fetch HSN numbers')
      setLoading(false)
    }
  }

  useEffect(() => {
    getHsn()
    const role = localStorage.getItem('role')
    setUserRole(role)
  }, [currentPage, pageSize])

  const handleAddHSN = async () => {
    if (!addHsnNumber || !addGstPercentage) {
      setError('HSN Number and GST % are required')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const payload = {
        hsnNumber: addHsnNumber,
        gstPercentage: addGstPercentage,
      }

      const response = await postRequest('/hsnNumbers/create', payload, token)

      if (response && response.isSuccess) {
        showSuccessMessage('HSN Number added successfully')
        setVisible(false)
        setAddHsnNumber('')
        setAddGstPercentage('')
        setError('')
        setSuccessMessage('')
        // Update the local stat
        getHsn()

      } else {
        setError('Failed to add HSN Number')
      }
      setLoading(false)
    } catch (error) {
      console.error('Error adding HSN Number:', error)
      setError('Failed to add HSN Number')
      setLoading(false)
    }
  }

  const handleEditOpen = async (id) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await getRequest(`/hsnNumbers/${id}`, token)

      if (response && response.data) {
        setEditHsnNumber(response.data.hsnNumber)
        setEditGstPercentage(response.data.gstPercentage)
        setCurrentEditItem(response.data)
        setEditModalVisible(true)
      } else {
        setError('Failed to fetch HSN Number details')
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching HSN Number details:', error)
      setError('Failed to fetch HSN Number details')
      setLoading(false)
    }
  }

  const handleUpdateHSNNumber = async () => {
    if (!editHsnNumber || !editGstPercentage) {
      setError('HSN Number and GST % are required')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const payload = {
        hsnNumber: editHsnNumber,
        gstPercentage: editGstPercentage,
      }

      const response = await putRequest(`/hsnNumbers/${currentEditItem.id}`, payload, token)

      if (response && response.isSuccess) {
        // Update the local state
        const updatedItems = allItems.map((item) => {
          if (item.id === currentEditItem.id) {
            return {
              ...item,
              hsnNumber: response.hsnNumber,
              gstPercentage: response.gstPercentage,
              updatedAt: response.updatedAt,
            }
          }
          return item
        })

        setAllItems(updatedItems)
        setFilteredItems(updatedItems)

        // Reset form fields
        setEditHsnNumber('')
        setEditGstPercentage('')

        showSuccessMessage('HSN Number updated successfully')
        setEditModalVisible(false)
      } else {
        setError('Failed to update HSN Number')
      }
      setLoading(false)
    } catch (error) {
      console.error('Error updating HSN Number:', error)
      setError('Failed to update HSN Number')
      setLoading(false)
    }
  }

  const handleOpen = (id) => {
    setDeleteItemId(id)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setDeleteItemId(null)
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await deleteRequest(`/hsnNumbers/${deleteItemId}`, {}, token)

      if (response && response.isSuccess) {
        // Remove the deleted item from local state
        const updatedItems = allItems.filter((item) => item.id !== deleteItemId)
        setAllItems(updatedItems)
        setFilteredItems(updatedItems)

        showSuccessMessage('HSN Number deleted successfully')
      } else {
        setError('Failed to delete HSN Number')
      }
      setLoading(false)
      handleClose()
    } catch (error) {
      console.error('Error deleting HSN Number:', error)
      setError('Failed to delete HSN Number')
      setLoading(false)
      handleClose()
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    const filtered = allItems.filter((item) =>
      item.hsnNumber.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredItems(filtered)
  }

  const handleAddItem = (hsnId) => {
    setQuantities((prev) => ({
      ...prev,
      [hsnId]: (prev[hsnId] || 0) + 1,
    }))
  }

  const handleAddToCart = (hsnId) => {
    const quantity = quantities[hsnId] || 0
    if (quantity > 0) {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
      cartItems.push({ hsnId, quantity })
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      setQuantities((prev) => ({ ...prev, [hsnId]: 0 }))
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
    { Header: 'HSN Number', accessor: 'hsnNumber', width: '15%' },
    { Header: 'GST %', accessor: 'gstPercentage', width: '8%' },
    {
      Header: 'Updated On',
      accessor: 'updatedAt',
      width: '10%',
      Cell: ({ value }) => {
        const date = new Date(value)
        return date.toLocaleDateString()
      },
    },
    ...(userRole === 'ADMIN'
      ? [
          {
            Header: 'Action',
            accessor: 'action',
            width: '8%',
            Cell: ({ row }) => (
              <div
                className="flex justify-center"
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
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
          },
        ]
      : []),
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong> Product HSN </strong>
              <div className="d-flex align-items-center gap-3 mr-3">
                {/* <CFormInput
                  type="text"
                  placeholder="Search HSN Number"
                  value={searchTerm}
                  onChange={handleSearch}
                /> */}
                {userRole === 'ADMIN' && (
                  <CButton
                    color="primary"
                    onClick={() => setVisible(!visible)}
                    style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  >
                    <AddIcon fontSize="small" />
                    Add HSN Number
                  </CButton>
                )}
              </div>
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
      <CModal visible={open} onClose={handleClose} alignment="center">
        <CModalHeader closeButton className="bg-danger text-white">
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this HSN Number?</p>
          <p className="text-danger mb-0">
            <small>This action cannot be undone.</small>
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleClose}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Edit Modal */}
      <CModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        aria-labelledby="EditHSNModalLabel"
        alignment="center"
        className="dark-modal"
      >
        <CModalHeader closeButton>
          <CModalTitle id="EditHSNModalLabel">Edit HSN Number</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="editHsnNumber" className="form-label fw-bold">
              HSN Number*
            </label>
            <CFormInput
              id="editHsnNumber"
              value={editHsnNumber}
              onChange={(e) => setEditHsnNumber(e.target.value)}
              placeholder="Enter HSN Number"
              className="border-secondary"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="editGstPercentage" className="form-label fw-bold">
              GST %*
            </label>
            <CFormInput
              id="editGstPercentage"
              value={editGstPercentage}
              onChange={(e) => setEditGstPercentage(e.target.value)}
              placeholder="Enter GST %"
              className="border-secondary"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleUpdateHSNNumber} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Add Modal */}
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="AddHSNModalLabel"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle id="AddHSNModalLabel">Add HSN Number</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="addHsnNumber" className="form-label fw-bold">
              HSN Number*
            </label>
            <CFormInput
              id="addHsnNumber"
              value={addHsnNumber}
              onChange={(e) => setAddHsnNumber(e.target.value)}
              placeholder="Enter HSN Number"
              className="border-secondary"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="addGstPercentage" className="form-label fw-bold">
              GST %*
            </label>
            <CFormInput
              id="addGstPercentage"
              value={addGstPercentage}
              onChange={(e) => setAddGstPercentage(e.target.value)}
              placeholder="Enter GST %"
              className="border-secondary"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddHSN} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ProductHsn
