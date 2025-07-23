import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CContainer,
  CImage,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import image from 'src/assets/images/k-101.png'
import openBox from 'src/assets/images/open-box.svg'
import Box from 'src/assets/images/package.svg'
import CloseIcon from '@mui/icons-material/Close'
import { color } from 'chart.js/helpers'
import { getRequest } from '../Services/apiMethods'

const ViewProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await getRequest(`/products/${id}`, token)
        if (response.isSuccess) {
          setProduct(response.data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }
    fetchProduct()
  }, [id])

  const handleEditProduct = () => {
    navigate(`/Products/AllProducts/EditProduct/${id}`)
  }

  const handleDeleteProduct = () => {
    console.log('Delete product clicked')
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <CContainer fluid className="p-0">
      <CCardHeader className="px-4">
        <div
          style={{
            fontSize: '24px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <strong>Product</strong>
          <CloseIcon style={{ cursor: 'pointer', fontSize: '35px' }} onClick={() => navigate(-1)} />
        </div>
      </CCardHeader>
      <CRow className="m-0">
        <CCol xs={12} className="p-0">
          <div
            style={{
              // backgroundColor: '#0c1424',
              // color: 'white',
              minHeight: '100vh',
              padding: '20px',
            }}
          >
            {/* Header with buttons */}

            <CRow>
              <CCol lg={6}>
                {/* Product Title */}
                <h1 style={{ marginBottom: '5px' }}>{product.productName}</h1>

                {/* Category & Sub-Category */}
                <div style={{ marginBottom: '30px' }}>
                  <p style={{ color: '#ff5722', margin: '0' }}>
                    Category: {product?.category?.name || 'N/A'}
                  </p>
                  <p style={{ color: '#ff5722', margin: '0' }}>
                    Sub Category: {product?.subCategory?.name || 'N/A'}
                  </p>
                </div>

                {/* Features Section */}
                <div style={{ marginBottom: '30px' }}>
                  <h3
                    style={{
                      color: '#ff5722',
                      borderLeft: '4px solid #ff5722',
                      paddingLeft: '10px',
                      marginBottom: '15px',
                    }}
                  >
                    Features
                  </h3>
                  <div style={{ marginLeft: '20px' }}>
                    {product.productFeature.map((feature, index) => (
                      <div
                        key={index}
                        style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#ff5722',
                            marginRight: '10px',
                          }}
                        ></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Section */}
                <div style={{ marginBottom: '30px' }}>
                  <h3
                    style={{
                      color: '#ff5722',
                      borderLeft: '4px solid #ff5722',
                      paddingLeft: '10px',
                      marginBottom: '15px',
                    }}
                  >
                    Application
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      marginTop: '15px',
                      width: '100%',
                      maxWidth: '400px',
                    }}
                  >
                    {product.applicationDetails.map((app, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: '#ff5722',
                          padding: '10px',
                          // width: '100%',
                          // height: '80px',
                          // fontSize: '20px',
                          color: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '20px',
                        }}
                      >
                        {/* <div style={{ marginBottom: '5px', fontSize: '24px' }}>⚙️</div> */}
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CCol>

              <CCol lg={6}>
                {/* Product Image */}
                <div
                  style={{
                    backgroundColor: '#1b2838',
                    padding: '20px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '20px' }}
                  />

                  {/* Thumbnail navigation */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {product.productImage.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          border: '2px solid #3a7ca5',
                          padding: '2px',
                          width: '70px',
                          height: '70px',
                        }}
                      >
                        <img
                          src={image}
                          alt={`${product.productName} Thumbnail ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CCol>
            </CRow>
            <CRow>
              <div style={{ marginBottom: '30px' }}>
                <h3
                  style={{
                    color: '#ff5722',
                    borderLeft: '4px solid #ff5722',
                    paddingLeft: '10px',
                    marginBottom: '15px',
                  }}
                >
                  Specification
                </h3>
                <div className="table-responsive">
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      // color: 'white',
                      border: '1px solid #1e2a3a',
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1e2a3a' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#ff5722' }}>
                          Art No.
                        </th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#ff5722' }}>
                          Description
                        </th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#ff5722' }}>
                          Hsn No.
                        </th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#ff5722' }}>
                          M.R.P ₹
                        </th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#ff5722' }}>
                          Price ₹
                        </th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#ff5722' }}>
                          <span role="img" aria-label="Package">
                            <img
                              src={Box}
                              alt="Package"
                              style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            />
                          </span>
                        </th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#ff5722' }}>
                          <span role="img" aria-label="Carton">
                            <img
                              src={openBox}
                              alt="Carton"
                              style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                            />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #1e2a3a' }}>
                        <td style={{ padding: '10px' }}>{product.ArtNumber}</td>
                        <td style={{ padding: '10px' }}>{product.productDescription}</td>
                        <td style={{ padding: '10px' }}>{product.hsnNumber.hsnNumber}</td>
                        <td style={{ padding: '10px' }}>{product.mrp}</td>
                        <td style={{ padding: '10px' }}>{product.basicPrice}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          {product.packagingDetails.piecesInPack}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          {product.packagingDetails.piecesInBox}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CRow>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ViewProduct
