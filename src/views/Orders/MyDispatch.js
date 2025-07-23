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
const MyDispatch = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const itemsPerPage = 10 // Set items per page to 10

  const navigate = useNavigate()

  const getDispatchList = async () => {
    // console.log("Fetching dispatch list...")
    const role = localStorage.getItem('role')
    const cleanRole = role?.replace(/"/g, '')
    try {
      const token = localStorage.getItem('token')
      const response = await getRequest(`/dispatches?role==${cleanRole}&type=1`, token)
      console.log("Dispatch list response:", response)
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
      }
    } catch (error) {
      console.error('Error fetching dispatch list:', error)
    }
  }

  useEffect(() => {
    getDispatchList()
  }, [])

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
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <strong> My Order Dispatch List</strong>
            </div>
          </CCardHeader>
          <CCardBody style={{ paddingTop: '10px' }}>
            <DataTable
              data={filteredItems}
              columns={columns}
              currentPage={currentPage}
              setcurrentPage={setCurrentPage}
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MyDispatch
