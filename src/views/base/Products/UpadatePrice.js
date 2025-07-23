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
import VisibilityIcon from '@mui/icons-material/Visibility'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import image from 'src/assets/images/k-101.png'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Category } from '@mui/icons-material'

const UpadatePrice = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredItems, setFilteredItems] = useState([])
  const [allItems, setAllItems] = useState([])
  const [open, setOpen] = React.useState(false)
  const [visible, setVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentEditItem, setCurrentEditItem] = useState(null)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // New state for edit form
  const [editSubCategory, setEditSubCategory] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [subCategory, setSubCategory] = useState('')
  const [category, setCategory] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [image1, setImage1] = useState(null)

  // Define categoryOptions array
  const categoryOptions = [
    { value: 'Hand Tools', label: 'Hand Tools' },
    { value: 'Power Tools', label: 'Power Tools' },
    { value: 'Cutting Tools', label: 'Cutting Tools' },
    { value: 'Woodworking Tools', label: 'Woodworking Tools' },
  ]

  const navigate = useNavigate()

  // Original items array
  const items = [
    {
      id: 1,
      image: image,
      artNo: 'HA-101',
      toolName: 'Hammer',
      subCategory: 'Striking',
      category: 'Hand Tools',
      categoryName: 'Hand Tools', // Added categoryName field
      mrp: 650,
      basicPrice: 520,
      stock: 50,
      updatedOn: '2025-02-15',
    },
    {
      id: 2,
      image: image,
      artNo: 'DM-201',
      toolName: 'Drill Machine',
      subCategory: 'Drilling',
      category: 'Power Tools',
      categoryName: 'Power Tools', // Added categoryName field
      mrp: 3500,
      basicPrice: 2800,
      stock: 20,
      updatedOn: '2025-02-20',
    },
    {
      id: 3,
      image: image,
      artNo: 'WR-301',
      toolName: 'Wrench',
      subCategory: 'Fastening',
      category: 'Hand Tools',
      categoryName: 'Hand Tools',
      mrp: 450,
      basicPrice: 360,
      stock: 35,
      updatedOn: '2025-02-18',
    },
    {
      id: 4,
      image: image,
      artNo: 'SW-401',
      toolName: 'Saw',
      subCategory: 'Cutting',
      category: 'Cutting Tools',
      categoryName: 'Cutting Tools',
      mrp: 850,
      basicPrice: 680,
      stock: 15,
      updatedOn: '2025-02-22',
    },
    {
      id: 5,
      image: image,
      artNo: 'SD-501',
      toolName: 'Screwdriver Set',
      subCategory: 'Fastening',
      category: 'Hand Tools',
      categoryName: 'Hand Tools',
      mrp: 750,
      basicPrice: 600,
      stock: 40,
      updatedOn: '2025-02-17',
    },
    {
      id: 6,
      image: image,
      artNo: 'AG-601',
      toolName: 'Angle Grinder',
      subCategory: 'Grinding',
      category: 'Power Tools',
      categoryName: 'Power Tools',
      mrp: 2200,
      basicPrice: 1760,
      stock: 12,
      updatedOn: '2025-02-19',
    },
    {
      id: 7,
      image: image,
      artNo: 'PL-701',
      toolName: 'Pliers',
      subCategory: 'Gripping',
      category: 'Hand Tools',
      categoryName: 'Hand Tools',
      mrp: 350,
      basicPrice: 280,
      stock: 25,
      updatedOn: '2025-02-21',
    },
    {
      id: 8,
      image: image,
      artNo: 'CS-801',
      toolName: 'Chisel Set',
      subCategory: 'Carving',
      category: 'Woodworking Tools',
      categoryName: 'Woodworking Tools',
      mrp: 950,
      basicPrice: 760,
      stock: 18,
      updatedOn: '2025-02-16',
    },
    {
      id: 9,
      image: image,
      artNo: 'CD-901',
      toolName: 'Cordless Screwdriver',
      subCategory: 'Fastening',
      category: 'Power Tools',
      categoryName: 'Power Tools',
      mrp: 1800,
      basicPrice: 1440,
      stock: 22,
      updatedOn: '2025-02-23',
    },
    {
      id: 10,
      image: image,
      artNo: 'CS-1001',
      toolName: 'Circular Saw',
      subCategory: 'Cutting',
      category: 'Cutting Tools',
      categoryName: 'Cutting Tools',
      mrp: 3200,
      basicPrice: 2560,
      stock: 17,
      updatedOn: '2025-02-24',
    },
  ]

  // Set up initial data
  useEffect(() => {
    setAllItems(items)
    setFilteredItems(items)
  }, [])

  const handleEditOpen = (row) => {
    // setCurrentEditItem(row.original)
    // setEditSubCategory(row.original.subCategory)
    // setEditCategory(row.original.categoryName)
    // setEditImagePreview(row.original.image)
    setEditModalVisible(true)
  }

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      console.log('Selected file:', file) // Debugging log
      setEditImage(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      console.log('No file selected')
    }
  }

  const handleUpdateSubCategory = () => {
    // Here you would typically make an API call to update the data
    console.log('Updating subcategory:', {
      id: currentEditItem.id,
      subCategory: editSubCategory,
      categoryName: editCategory,
      image: editImage ? editImage : currentEditItem.image,
    })

    // For now, let's update the local state to simulate the update
    const updatedItems = allItems.map((item) => {
      if (item.id === currentEditItem.id) {
        return {
          ...item,
          subCategory: editSubCategory,
          categoryName: editCategory,
          // If a new image is selected, we would typically update this with the URL from the server
          // For this example, we'll just keep the existing image
        }
      }
      return item
    })

    setAllItems(updatedItems)
    setFilteredItems(updatedItems)
    setEditModalVisible(false)
  }

  const columns = [
    { Header: 'S No.', accessor: 'id', width: '5%' },
    { Header: 'Sub Category Name', accessor: 'subCategory', width: '15%' },
    {
      Header: 'Image',
      accessor: 'image',
      width: '10%',
      Cell: ({ value }) => (
        <img
          src={value || '/api/placeholder/80/80'}
          alt="Product"
          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
        />
      ),
    },
    { Header: 'Category Name', accessor: 'categoryName', width: '8%' }, // Fixed accessor key
    { Header: 'Updated On', accessor: 'updatedOn', width: '8%' }, // Fixed accessor key

    {
      Header: 'Action',
      accessor: 'action',
      width: '8%',
      Cell: ({ row }) => (
        <div className="flex justify-center" style={{ display: 'flex', gap: '10px' }}>
          <DriveFileRenameOutlineIcon
            fontSize="small"
            style={{ cursor: 'pointer' }}
            onClick={() => handleEditOpen(row)}
          />
          <DeleteIcon fontSize="small" style={{ cursor: 'pointer' }} onClick={handleOpen} />
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
              <strong> Products Sub Categories List</strong>
              <CButton
                color="primary"
                onClick={() => setVisible(!visible)}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <AddIcon fontSize="small" style={{ marginRight: '5px' }} />
                Add Sub Category
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            <DataTable
              data={filteredItems}
              columns={columns}
              currentPage={currentPage}
              setcurrentPage={setCurrentPage}
              totalItems={filteredItems.length}
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
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Add New Sub Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </CFormSelect>
          <CFormInput
            className="mt-3"
            placeholder="Sub Category Name"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          />

          <div className="mb-3">
            <div className="d-flex align-items-center">
              {editImagePreview && (
                <div className="me-3">
                  <img
                    src={editImagePreview}
                    alt="Category Preview"
                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="my-3">
                <CButton component="label" color="primary">
                  Add Category Image
                  <input
                    type="file"
                    id="editImage"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    hidden
                  />
                </CButton>

                {/* Show preview if an image is selected */}
                {image1 && (
                  <div className="mt-3">
                    <img
                      src={image1}
                      alt="Preview"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
      {/* Edit modal */}
      <CModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        aria-labelledby="EditSubCategoryModalLabel"
        alignment="center"
        className="dark-modal"
      >
        <CModalHeader closeButton>
          <CModalTitle id="EditSubCategoryModalLabel">Edit Sub Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="editSubCategory" className="form-label">
              Sub Category Name
            </label>
            <CFormInput
              id="editSubCategory"
              value={editSubCategory}
              onChange={(e) => setEditSubCategory(e.target.value)}
              placeholder="Enter Sub Category Name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="editCategory" className="form-label">
              Category
            </label>
            <CFormSelect
              id="editCategory"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label htmlFor="editImage" className="form-label">
              Sub Category Image
            </label>
            <div className="d-flex align-items-center">
              {editImagePreview && (
                <div className="me-3">
                  <img
                    src={editImagePreview}
                    alt="Category Preview"
                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div>
                <CButton
                  component="label"
                  color="primary"
                  // style={{ backgroundColor: '#FF6B1F', border: 'none' }}
                >
                  Change Image
                  <input
                    type="file"
                    id="editImage"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    hidden
                  />
                </CButton>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleUpdateSubCategory}
            // style={{ backgroundColor: '#FF6B1F', border: 'none' }}
          >
            Update
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default UpadatePrice
