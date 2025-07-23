import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CFormSelect,
  CButton,
  CAlert,
} from '@coreui/react'
import { getRequest, postRequest } from '../../Services/apiMethods'

const OrderDispatch = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  // console.log("Order ID:", id)
  
  // Initialize state
  const [formData, setFormData] = useState({
    shipperName: '',
    customerName: '',
    ticketNumber: '',
    margin: '',
    grNo: '',
    transporter: '',
    vehicleNo: '',
    ewayBillNo: '',
    freight: '',
    counter: '',
    gstOnCounter: '',
    invoiceNo: '',
    invoiceDate: '',
    remarks: '',
    orderTotal: '',
    dueDate: '',
    dueDays: '',
  })

  const [products, setProducts] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)

  // Fetch order details
  const getOrderDetails = async () => {
    if (!id) {
      setError('No order ID provided')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const response = await getRequest(`orders/${id}`, token)
      // console.log("Order Details Response:", response)
      
      if (response.isSuccess && response.data) {
        const orderData = response.data;
        setOrderDetails(orderData)
        // console.log("Order Data:", orderData)
        
        // Update form data with order details
        setFormData(prev => ({
          ...prev,
          customerName: orderData.addressId?.partyDetails?.partyName || orderData.userId?.fullName ||'',
          ticketNumber: orderData.orderNumber || '',
          margin: orderData.userId.marginPercent || '',
        }))

        // Transform order items into products format
        const transformedProducts = orderData.items.map((item, index) => {
          const packagingDetails = item.productId?.packagingDetails || {}
          const piecesInPack = Number(packagingDetails.piecesInPack) || 1
          const piecesInBox = Number(packagingDetails.piecesInBox) || 1
          
          // Calculate initial cartons and bundles based on quantity
          const quantity = Number(item.quantity) || 0
          const bundles = Math.floor(quantity / piecesInPack)
          const remainingPieces = quantity % piecesInPack
          const cartons = Math.floor(remainingPieces / piecesInBox)
          
          return {
            id: item.productId._id ||'',
            artNo: item.productId?.ArtNumber || '',
            artNoDetails: item.productId?.productName || '',
            pendingQuantity: quantity,
            cartons: cartons.toString(),
            bundles: bundles.toString(),
            totalWt: item.totalWeight || '0',
            price: item.productId?.basicPrice || '0',
            total: item.totalPrice || '0',
            gstAmt: (Number(item.totalPrice) * 0.18).toFixed(2),
            subTotal: (Number(item.totalPrice) * 1.18).toFixed(2)
          }
        })

        setProducts(transformedProducts)
      } else {
        setError('Invalid order response')
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError('Failed to fetch order details')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getOrderDetails()
    } else {
      setError('No order ID provided')
      setLoading(false)
    }
  }, [id])

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle product input changes
  const handleProductChange = (id, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          // Only update the specific field (cartons, bundles, or totalWt)
          return { ...product, [field]: value }
        }
        return product
      }),
    )
  }

  // Calculate order total whenever products change
  useEffect(() => {
    const total = products.reduce((sum, p) => sum + (Number(p.total) || 0), 0)
    setFormData(prev => ({
      ...prev,
      orderTotal: total.toFixed(2)
    }))
  }, [products])

  // Calculate grand total whenever products or related form fields change
  useEffect(() => {
    calculateGrandTotal()
  }, [products, formData.freight, formData.counter, formData.gstOnCounter])

  // Calculate grand total
  const calculateGrandTotal = () => {
    const orderTotal = Number(formData.orderTotal) || 0
    const freight = Number(formData.freight) || 0
    const counter = Number(formData.counter) || 0
    const gstOnCounter = Number(formData.gstOnCounter) || 0

    const grandTotal = (orderTotal + freight + counter + gstOnCounter).toFixed(2)

    setFormData((prev) => ({
      ...prev,
      grandTotal,
    }))
  }

  // Calculate totals for the table footer
  const calculateTotals = () => {
    return {
      pcs: products.reduce((sum, p) => sum + (Number(p.pcs) || 0), 0),
      cartons: products.reduce((sum, p) => sum + (Number(p.cartons) || 0), 0),
      bundles: products.reduce((sum, p) => sum + (Number(p.bundles) || 0), 0),
      totalWt: products.reduce((sum, p) => sum + (Number(p.totalWt) || 0), 0).toFixed(2),
      total: products.reduce((sum, p) => sum + (Number(p.total) || 0), 0).toFixed(2),
      gstAmt: products.reduce((sum, p) => sum + (Number(p.gstAmt) || 0), 0).toFixed(2),
      subTotal: products.reduce((sum, p) => sum + (Number(p.subTotal) || 0), 0).toFixed(2),
    }
  }

  // Handle form submission
  const handleDispatch = async () => {
    // Validate form
    if (!formData.customerName || !formData.dueDate || !formData.dueDays) {
      alert('Please fill all required fields')
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      // Prepare dispatch data
      const dispatchData = {
        orderId: id,
        dispatchedFrom: formData.shipperName,
        customerName: formData.customerName,
        grNo: formData.grNo,
        transport: formData.transporter,
        vehicleNo: formData.vehicleNo,
        ewayBillNo: formData.ewayBillNo,
        freightCharge: formData.freight,
        courierCharge: formData.counter,
        gstOnCourier: formData.gstOnCounter,
        privateMark: formData.remarks,
        dueDate: formData.dueDate,
        dueDays: formData.dueDays,
        items: products.map(product => {
          const item = orderDetails?.items[product.id - 1]
          const packagingDetails = item?.productId?.packagingDetails || {}
          const piecesInPack = Number(packagingDetails.piecesInPack) || 1
          const piecesInBox = Number(packagingDetails.piecesInBox) || 1
          
          return {
            productId: product.id,
            cartons: Number(product.cartons),
            bundles: Number(product.bundles),
            totalWeight: product.totalWt.toString()
          }
        })
      }
      // console.log("Dispatch Data:", dispatchData)

      // Make API call to create dispatch
      const response = await postRequest('/dispatches/create', dispatchData, token)
      
      if (response.isSuccess) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          navigate('/Dispatch')
        }, 3000)
      } else {
        alert('Failed to create dispatch. Please try again.')
      }
    } catch (error) {
      console.error('Error creating dispatch:', error)
      alert('An error occurred while creating dispatch. Please try again.')
    }
  }

  const totals = calculateTotals()

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      {showSuccess && (
        <CAlert color="success" dismissible onClose={() => setShowSuccess(false)}>
          Dispatch created successfully!
        </CAlert>
      )}

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Add Dispatch</h3>
      </div>

      <div style={{ display: 'flex', marginBottom: '10px', fontSize: '12px' }}>
        <span style={{ color: '#ccc', marginRight: '10px' }}>
          {'('} Please fill required fields {')'}
        </span>
        <span style={{ color: '#ff6b35' }}>
          {'('} are mandatory {')'}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ width: '50%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Dispatched From
          </label>
          <div style={{ position: 'relative' }}>
            {/* <CFormSelect
              name="shipperName"
              value={formData.shipperName}
              onChange={handleInputChange}
              style={{
                borderRadius: '0',
                padding: '8px',
                width: '100%',
              }}
            >
              <option value="Kapsoon">Kapsoon tools</option>
              <option value="tools">Kapsoon Build</option>
            </CFormSelect> */}
            <CFormInput
              type="text"
              name="shipperName"
              value={formData.shipperName}
              onChange={handleInputChange}
              
            />
          </div>
        </div>

        <div style={{ width: '50%', padding: '0 0 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Customer Name
          </label>
          <CFormInput
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
            disabled
          />
        </div>

        <div style={{ width: '50%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Order Number
          </label>
          <CFormInput
            type="text"
            name="ticketNumber"
            value={formData.ticketNumber}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
            disabled
          />
        </div>

        <div style={{ width: '50%', padding: '0 0 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Margin%</label>
          <CFormInput
            type="text"
            name="margin"
            value={formData.margin}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ width: '50%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Gr. No.</label>
          <CFormInput
            type="text"
            name="grNo"
            value={formData.grNo}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ width: '50%', padding: '0 0 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Transporter
          </label>
          <CFormInput
            type="text"
            name="transporter"
            value={formData.transporter}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>
        <div style={{ width: '50%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Vehicle No
          </label>
          <CFormInput
            type="text"
            name="vehicleNo"
            value={formData.vehicleNo}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ width: '50%', padding: '0 0 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Eway Bill No.
          </label>
          <CFormInput
            type="text"
            name="ewayBillNo"
            value={formData.ewayBillNo}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ width: '50%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Order Total
          </label>
          <CFormInput
            type="text"
            name="orderTotal"
            value={formData.orderTotal}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
              fontWeight: 'bold',
            }}
            readOnly
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'normal' }}>
          Dispatched Products
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: 'primary',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  Art No | Art No Details
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  Piece (Pcs.)
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  Cartons
                </th>

                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  Bundles
                </th>

                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  Total Wt (Kg)
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  Total
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  GST Amt
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '12px',
                    borderBottom: '1px solid #253341',
                  }}
                >
                  Sub Total
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td
                    style={{ padding: '10px', borderBottom: '1px solid #253341', fontSize: '14px' }}
                  >
                    <div>{product.artNo}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{product.artNoDetails}</div>
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      textAlign: 'center',
                      borderBottom: '1px solid #253341',
                      fontSize: '14px',
                    }}
                  >
                    {product.pendingQuantity}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #253341' }}>
                    <CFormInput
                      type="text"
                      value={product.cartons}
                      onChange={(e) => handleProductChange(product.id, 'cartons', e.target.value)}
                      style={{
                        borderRadius: '0',
                        padding: '6px',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    />
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #253341' }}>
                    <CFormInput
                      type="text"
                      value={product.bundles}
                      onChange={(e) => handleProductChange(product.id, 'bundles', e.target.value)}
                      style={{
                        borderRadius: '0',
                        padding: '6px',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    />
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #253341' }}>
                    <CFormInput
                      type="text"
                      value={product.totalWt}
                      onChange={(e) => handleProductChange(product.id, 'totalWt', e.target.value)}
                      style={{
                        borderRadius: '0',
                        padding: '6px',
                        width: '100%',
                        textAlign: 'center',
                      }}
                    />
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      textAlign: 'center',
                      borderBottom: '1px solid #253341',
                      fontSize: '14px',
                    }}
                  >
                    {product.price}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #253341', fontSize: '14px' }}>
                    {product.total}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #253341', fontSize: '14px' }}>
                    {product.gstAmt}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #253341', fontSize: '14px' }}>
                    {product.subTotal}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  style={{
                    padding: '10px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  Total:
                </td>
              
                <td style={{ padding: '10px', textAlign: 'center' }}>{totals.pcs}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{totals.cartons}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{totals.bundles}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{totals.totalWt}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}></td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{totals.total}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{totals.gstAmt}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{totals.subTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ width: '33.33%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Freight Charge
          </label>
          <CFormInput
            type="text"
            name="freight"
            value={formData.freight}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ width: '33.33%', padding: '0 10px 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Counter Charge
          </label>
          <CFormInput
            type="text"
            name="counter"
            value={formData.counter}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ width: '33.33%', padding: '0 0 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            GST On Counter @18%
          </label>
          <CFormInput
            type="text"
            name="gstOnCounter"
            value={formData.gstOnCounter}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>

        {/* <div style={{ width: '33.33%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Invoice No
          </label>
          <CFormInput
            type="text"
            name="invoiceNo"
            value={formData.invoiceNo}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div> */}

        {/* <div style={{ width: '33.33%', padding: '0 10px 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Invoice Date
          </label>
          <CFormInput
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div> */}

        <div style={{ width: '33.33%', padding: '0 0 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Private Note
          </label>
          <CFormInput
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
          />
        </div>

        <div style={{ width: '33.33%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Grand Total
          </label>
          <CFormInput
            type="text"
            name="grandTotal"
            value={formData.grandTotal}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
              fontWeight: 'bold',
            }}
            readOnly
          />
        </div>

        <div style={{ width: '50%', padding: '0 10px 10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Due Date
          </label>
          <CFormInput
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
            required
          />
        </div>

        <div style={{ width: '50%', padding: '0 0 10px 10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
            Due Days
          </label>
          <CFormInput
            type="number"
            name="dueDays"
            value={formData.dueDays}
            onChange={handleInputChange}
            style={{
              borderRadius: '0',
              padding: '8px',
              width: '100%',
            }}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CButton
          color="primary"
          onClick={handleDispatch}
          style={{
            border: 'none',
            padding: '8px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Dispatch
        </CButton>
      </div>
    </div>
  )
}

export default OrderDispatch
