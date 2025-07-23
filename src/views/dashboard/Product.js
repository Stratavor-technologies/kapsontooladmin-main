import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow
} from '@coreui/react'
import DataTable from 'src/components/DataTable'
import { useNavigate } from 'react-router-dom'
import { getRequest } from '../../Services/apiMethods'

const DashProducts = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersData, setOrdersData] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Get today's date in YYYY-MM-DD format
  const today = new Date()
  const formattedDate = today.toISOString().split('T')[0]

  const navigate = useNavigate()
  
  const getTodayOrders = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await getRequest(`/orders?startDate=${formattedDate}&endDate=${formattedDate}&pageNo=${currentPage}&pageSize=${pageSize}`, token)
      if (response?.isSuccess && response?.items) {
        console.log("API Response:", response.items);
        
        // Pre-process the data to ensure all required fields exist
        const processedData = response.items.map((order, index) => {
          return {
            ...order,
            // Auto-generate serial number based on pagination
            _serialNumber: (currentPage - 1) * pageSize + index + 1,
            _partyName: order.addressId?.partyDetails?.partyName || order.userId?.fullName || "N/A",
            _contact: order.addressId?.partyDetails?.contactNo || order.userId?.phone || "N/A",
            _address: order.addressId?.partyDetails?.address || order.userId?.address || "N/A"
          };
        });
        
        console.log("Processed Data:", processedData);
        setOrdersData(processedData);
        setTotalItems(response.total || response.items.length);
        setPageSize(response.pageSize || 10);
      }
    } catch (error) {
      console.error('Error fetching today\'s orders:', error)
    }
  }

  useEffect(() => {
    getTodayOrders()
  }, [currentPage]) // Re-fetch when page changes

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  }

  const columns = [
    { 
      Header: 'S No.', 
      accessor: '_serialNumber', 
      width: '5%',
      Cell: ({ value }) => value
    },
    { Header: 'Party Name', accessor: '_partyName', width: '15%' },
    { Header: 'Contact', accessor: '_contact', width: '12%' },
    { Header: 'Address', accessor: '_address', width: '25%' },
    { 
      Header: 'Items', 
      accessor: 'items', 
      width: '15%', 
      Cell: ({ value }) => value?.length || 0
    },
    { 
      Header: 'Total Amount', 
      accessor: 'totalAmount', 
      width: '15%',
      Cell: ({ value }) => {
        const amount = parseFloat(value);
        return isNaN(amount) ? '₹0.00' : `₹${amount.toFixed(2)}`;
      }
    },
    { 
      Header: 'Status', 
      accessor: 'status', 
      width: '8%',
      Cell: ({ value }) => {
        let statusClass = '';
        switch(value?.toUpperCase()) {
          case 'PENDING':
            statusClass = 'text-warning';
            break;
          case 'COMPLETED':
            statusClass = 'text-success';
            break;
          case 'CANCELLED':
            statusClass = 'text-danger';
            break;
          default:
            statusClass = '';
        }
        return <span className={statusClass}>{value || 'N/A'}</span>;
      }
    }
  ];

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Today's Orders ({formattedDate})</strong>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '100%' }}>
                <DataTable
                  data={ordersData}
                  columns={columns}
                  currentPage={currentPage}
                  setcurrentPage={handlePageChange}
                  totalItems={totalItems}
                  pageSize={pageSize}
                />
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DashProducts