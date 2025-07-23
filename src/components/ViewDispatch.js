import React, { useState } from 'react'
import {
  CContainer,
  CBreadcrumb,
  CBreadcrumbItem,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from '../Services/apiMethods'

const ViewDispatch = () => {
  const { id } = useParams()
  const [dispatchData, setDispatchData] = useState([])
  const [vehicleDetails, setVehicleDetails] = useState([])
  const [productDetails, setProductDetails] = useState([])
  const [charges, setCharges] = useState([])
  const [grandTotal, setGrandTotal] = useState(0)

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }

  const getDispatch = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await getRequest(`/dispatches/${id}`, token)
      console.log("response", response)

      if (response.isSuccess && response.data) {
        const data = response.data;

        // Set dispatch data
        setDispatchData([{
          date: formatDate(data.updatedAt),
          billNo: data.invoiceId?.invoiceId || '',
          orderNo: data.orderId?.orderNumber || '',
          margin: `${data.margin}%`,
          grNo: data.grNo,
          transport: data.transport,
          totalWeight: data.orderId?.items?.[0]?.totalWeight || '0 Kgs',
          privateMark: data.privateMark,
        }])

        // Set vehicle details
        setVehicleDetails([{
          vehicleNo: data.vehicleNo,
          eWayBill: data.ewayBillNo,
          dispatchedFrom: data.dispatchedFrom,
          invoiceNo: data.invoiceId?.invoiceId,
          invoiceDate: formatDate(data.invoiceId?.createdAt),
        }])

        // Set product details for all items
        const products = data.orderId?.items.map(item => ({
          productName: item.productId?.productName,
          artNo: item.productId?.ArtNumber,
          price: item.productId?.basicPrice,
          quantity: item.quantity,
          cartons: item.cartons,
          bundles: item.bundles,
          totalWeight: item.totalWeight || '0 Kgs',
          ad: item.productId?.adPercent * 100,
          cd: item.productId?.cdPercent * 100,
          total: item.totalPrice || 0,
          gstAmt: (item.totalPrice * 0.18).toFixed(2),
          subTotal: (item.totalPrice * 1.18).toFixed(2),
        }))
        setProductDetails(products || [])

        // Set charges
        setCharges([
          { label: 'Freight Chr.', amount: data.freightCharge || 0 },
          { label: 'Courier Chr.', amount: data.courierCharge || 0 },
          { label: 'Courier Gst', amount: data.gstOnCourier || 0 },
        ])

        // Set grand total
        setGrandTotal(data.grandTotal || 0)
      }
    } catch (error) {
      console.error('Error fetching dispatch details:', error)
    }
  }

  useEffect(() => {
    getDispatch()
  }, [])

  const handleDownloadPDF = () => {
    const input = document.getElementById('dispatch-content')

    // Get current dimensions to maintain proportions
    const inputWidth = input.offsetWidth
    const inputHeight = input.offsetHeight

    html2canvas(input, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      // A4 dimensions in mm (210 x 297)
      const pageWidth = 210
      const pageHeight = 297

      // Set margins (in mm)
      const margin = 15
      const contentWidth = pageWidth - (margin * 2)

      // Calculate height while maintaining aspect ratio
      const contentHeight = (canvas.height * contentWidth) / canvas.width

      // Add company name at the top
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('TTC Robotronics', pageWidth / 2, margin, { align: 'center' })

      // Add a line under the company name
      pdf.setLineWidth(0.5)
      pdf.line(margin, margin + 5, pageWidth - margin, margin + 5)

      // Add some space after the company name before the content
      const yPosition = margin + 15

      // Add the main content with margins
      pdf.addImage(imgData, 'PNG', margin, yPosition, contentWidth, contentHeight)

      pdf.save('dispatch-details.pdf')
    })
  }

  return (
    <CContainer fluid style={{ minHeight: '100vh', padding: '1rem' }}>
      {/* Breadcrumb Navigation */}

      {/* Header with Download Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Dispatch Details
        </h1>
        <CButton color="primary" onClick={handleDownloadPDF}>
          Download Dispatch
        </CButton>
      </div>

      {/* Main Details Table */}
      <CContainer id="dispatch-content">
        <CCard className="mb-4">
          <CCardBody>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Bill No.</CTableHeaderCell>
                  <CTableHeaderCell>Order No.</CTableHeaderCell>
                  <CTableHeaderCell>Margin</CTableHeaderCell>
                  <CTableHeaderCell>Gr. No.</CTableHeaderCell>
                  <CTableHeaderCell>Transport</CTableHeaderCell>
                  <CTableHeaderCell>Total Weight</CTableHeaderCell>
                  <CTableHeaderCell>Private Mark</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {dispatchData.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{item.date}</CTableDataCell>
                    <CTableDataCell>{item.billNo}</CTableDataCell>
                    <CTableDataCell>{item.orderNo}</CTableDataCell>
                    <CTableDataCell>{item.margin}</CTableDataCell>
                    <CTableDataCell>{item.grNo}</CTableDataCell>
                    <CTableDataCell>{item.transport}</CTableDataCell>
                    <CTableDataCell>{item.totalWeight}</CTableDataCell>
                    <CTableDataCell>{item.privateMark}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        {/* Vehicle and Invoice Information */}
        <CCard className="mb-4">
          <CCardBody>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Vehicle No</CTableHeaderCell>
                  <CTableHeaderCell>E-way Bill</CTableHeaderCell>
                  <CTableHeaderCell>Dispatched From</CTableHeaderCell>
                  <CTableHeaderCell>Invoice No</CTableHeaderCell>
                  <CTableHeaderCell>Invoice Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {vehicleDetails.map((detail, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{detail.vehicleNo}</CTableDataCell>
                    <CTableDataCell>{detail.eWayBill}</CTableDataCell>
                    <CTableDataCell>{detail.dispatchedFrom}</CTableDataCell>
                    <CTableDataCell>{detail.invoiceNo}</CTableDataCell>
                    <CTableDataCell>{detail.invoiceDate}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        {/* Dispatched Products Section */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Dispatched Products
        </h2>

        <CCard className="mb-4">
          <CCardBody>
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>
                    Product Name <br /> Art No | Get
                  </CTableHeaderCell>
                  <CTableHeaderCell>Price</CTableHeaderCell>
                  <CTableHeaderCell>Qty (Pcs.)</CTableHeaderCell>
                  <CTableHeaderCell>No. Of Cartons</CTableHeaderCell>
                  <CTableHeaderCell>No. Of Bundles</CTableHeaderCell>
                  <CTableHeaderCell>Total Wt (Kg)</CTableHeaderCell>
                  <CTableHeaderCell>AD</CTableHeaderCell>
                  <CTableHeaderCell>CD</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>GST Amt</CTableHeaderCell>
                  <CTableHeaderCell>
                    Sub <br /> Total
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {productDetails.map((product, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>
                      {product.productName} <br /> {product.artNo}
                    </CTableDataCell>
                    <CTableDataCell>{Number(product.price || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{product.quantity || 0}</CTableDataCell>
                    <CTableDataCell>{product.cartons || 0}</CTableDataCell>
                    <CTableDataCell>{product.bundles || 0}</CTableDataCell>
                    <CTableDataCell>{product.totalWeight || '0 Kgs'}</CTableDataCell>
                    <CTableDataCell>{Number(product.ad || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{Number(product.cd || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{Number(product.total || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{Number(product.gstAmt || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{Number(product.subTotal || 0).toFixed(2)}</CTableDataCell>
                  </CTableRow>
                ))}

                {/* Total Row */}
                <CTableRow style={{ backgroundColor: '#1e2a38' }}>
                  <CTableDataCell style={{ fontWeight: 'bold' }}>Total</CTableDataCell>
                  <CTableDataCell></CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => sum + (Number(p.cartons) || 0), 0)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => sum + (Number(p.bundles) || 0), 0)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => {
                      const weight = p.totalWeight?.split(' ')[0] || '0';
                      return sum + (Number(weight) || 0);
                    }, 0)} Kgs
                  </CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => sum + (Number(p.ad) || 0), 0).toFixed(2)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => sum + (Number(p.cd) || 0), 0).toFixed(2)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => sum + (Number(p.total) || 0), 0).toFixed(2)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => sum + (Number(p.gstAmt) || 0), 0).toFixed(2)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {productDetails.reduce((sum, p) => sum + (Number(p.subTotal) || 0), 0).toFixed(2)}
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        {/* Final Charges Section */}
        <div className="d-flex justify-content-end mb-4">
          <CCard style={{ width: '300px' }}>
            <CCardBody>
              {charges.map((charge, index) => (
                <div key={index} className="d-flex justify-content-between py-2 border-bottom">
                  <span>{charge.label}</span>
                  <span>{Number(charge.amount || 0).toFixed(2)}</span>
                </div>
              ))}

              <div className="d-flex justify-content-between py-2">
                <span style={{ fontWeight: 'bold' }}>Grand Total</span>
                <span style={{ fontWeight: 'bold' }}>{Number(grandTotal || 0).toFixed(2)}</span>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </CContainer>
    </CContainer>
  )
}

export default ViewDispatch
