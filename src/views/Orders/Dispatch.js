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
import { getRequest, postRequest } from '../../Services/apiMethods'
const Dispatch = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = React.useState(false)
  const [userRole, setUserRole] = useState('')
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const navigate = useNavigate()

  const getDispatchList = async () => {
    try {
      const token = localStorage.getItem('token')
      let url = `/dispatches?pageNo=${currentPage}&pageSize=${pageSize}`
      const response = await getRequest(url, token)
      if (response && response.items) {
        const transformedData = response.items.map(item => {
          if (!item?.orderId?.items) return { ...item, totalWeight: 0 }
          
          const totalWeight = item.orderId.items.reduce((sum, item) => {
            if (!item?.totalWeight) return sum
            const weight = parseFloat(item.totalWeight.split(' ')[0]) || 0
            return sum + weight
          }, 0)

          return {
            ...item,
            'invoiceId.invoiceId': item?.invoiceId?.invoiceId || '',
            'orderId.orderNumber': item?.orderId?.orderNumber || '',
            customerName: item?.customerName || '',
            dispatchedFrom: item?.dispatchedFrom || '',
            grNo: item?.grNo || '',
            transport: item?.transport || '',
            vehicleNo: item?.vehicleNo || '',
            ewayBillNo: item?.ewayBillNo || '',
            privateMark: item?.privateMark || '',
            freightCharge: item?.freightCharge || 0,
            courierCharge: item?.courierCharge || 0,
            gstOnCourier: item?.gstOnCourier || 0,
            grandTotal: item?.grandTotal || 0,
            dueDate: item?.dueDate || '',
            dueDays: item?.dueDays || 0,
            totalWeight
          }
        })
        setFilteredItems(transformedData)
        setAllItems(transformedData)
        setTotalItems(response.total || response.items.length)
        setPageSize(response.pageSize || 10)
      }
    } catch (error) {
      console.error('Error fetching dispatch list:', error)
    }
  }

  useEffect(() => {
    getDispatchList()
    const role = localStorage.getItem('role')
    const cleanRole = role?.replace(/"/g, '')
    setUserRole(cleanRole)
  }, [currentPage, pageSize])

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize)

  // Generate array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Handlers for the action buttons
  const handleViewOpen = (id) => {
    navigate(`/Dispatch/ViewDispatch/${id}`)
  }

  const columns = [
    {
      Header: 'Date',
      accessor: 'updatedAt',
      width: '8%',
      Cell: ({ value }) => {
        if (!value) return ''
        const date = new Date(value)
        return date.toLocaleDateString('en-GB') // Will format as DD/MM/YYYY
      },
    },
    { Header: 'Invoice No.', accessor: 'invoiceId.invoiceId', width: '8%' },
    { Header: 'Order No.', accessor: 'orderId.orderNumber', width: '8%' },
    { Header: 'Gr. No.', accessor: 'grNo', width: '10%' },
    { Header: 'Transport', accessor: 'transport', width: '8%' },
    // {
    //   Header: 'Total Weight',
    //   accessor: 'totalWeight',
    //   width: '8%',
    //   Cell: ({ row }) => {
    //     if (!row?.original) return '0 kg'
    //     const items = row.original.orderId?.items || []
    //     const totalWeight = items.reduce((sum, item) => {
    //       if (!item?.totalWeight) return sum
    //       const weight = parseFloat(item.totalWeight.split(' ')[0]) || 0
    //       return sum + weight
    //     }, 0)
    //     return `${totalWeight} kg`
    //   }
    // },
    { Header: 'Private Mark', accessor: 'privateMark', width: '8%' },
    { Header: 'Due Days', accessor: 'dueDays', width: '8%' },
    {
      Header: 'Due Date',
      accessor: 'dueDate',
      width: '8%',
      Cell: ({ value }) => {
        if (!value) return ''
        const date = new Date(value)
        return date.toLocaleDateString('en-GB') // Will format as DD/MM/YYYY
      },
    },
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
            onClick={() => handleViewOpen(row.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
              <strong> Dispatch List</strong>
            </div>
            {userRole === 'DISTRIBUTER' && (
              <div className="d-flex justify-content-end align-items-center">
                <CButton color="primary" onClick={() => navigate('/Dispatch/MyDispatch')}>My Order Dispatch</CButton>
              </div>
            )}
          </CCardHeader>
          <CCardBody style={{ paddingTop: '10px' }}>
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
    </CRow>
  )
}

export default Dispatch
