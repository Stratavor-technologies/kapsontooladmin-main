import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CContainer,
  CButtonGroup,
} from '@coreui/react'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

const DataTable = ({
  columns,
  data,
  currentPage,
  setcurrentPage,
  totalItems,
  itemsPerPage = 20,
}) => {
  const [totalPages, setTotalPages] = useState(1)
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([])

  // Calculate total pages
  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage))
  }, [totalItems, itemsPerPage])

  // Calculate visible page numbers according to the simplified requirements
  useEffect(() => {
    const getVisiblePages = () => {
      let pages = []

      // Always show page 1
      pages.push(1)

      // Show ellipsis if we're not near the beginning
      if (currentPage > 2) {
        pages.push('ellipsis-start')
      }

      // Show the previous page if not at beginning
      if (currentPage > 1 && currentPage !== 2) {
        pages.push(currentPage - 1)
      }

      // Current page (if not 1)
      if (currentPage !== 1) {
        pages.push(currentPage)
      }

      // Next page if not at end
      if (currentPage < totalPages) {
        pages.push(currentPage + 1)
      }

      // Show ellipsis if we're not near the end
      if (currentPage < totalPages - 1) {
        pages.push('ellipsis-end')
      }

      // Always show last page if not already included
      if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages)
      }

      // Remove duplicates
      return [...new Set(pages)]
    }

    setVisiblePageNumbers(getVisiblePages())
  }, [totalPages, currentPage])

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setcurrentPage(page)
    }
  }

  // Get cell value using accessor or render using Cell function
  const getCellValue = (row, column) => {
    if (!column.accessor || typeof column.accessor !== 'string') return ''

    // Handle nested accessors (e.g., "user.name")
    const value = column.accessor.split('.').reduce((acc, part) => acc?.[part] || '', row)

    return column.Cell ? column.Cell({ value, row }) : value
  }

  return (
    <CContainer>
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            {columns.map((column) => (
              <CTableHeaderCell key={column.Header} style={{ width: column.width || 'auto' }}>
                {column.Header}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
            <CTableRow key={rowIndex}>
              {columns.map((column) => (
                <CTableDataCell key={`${rowIndex}-${column.Header}`}>
                  {getCellValue(row, column)}
                </CTableDataCell>
              ))}
            </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={columns.length} className="text-center">
                No data available
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Pagination section */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <span className="me-2">
            Showing {totalItems === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </span>
        </div>

        <div className="d-flex align-items-center">
          <CButtonGroup>
            {/* First page button */}
            <CButton color="light" disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
              <FirstPageIcon fontSize="small" />
            </CButton>

            {/* Previous page button */}
            <CButton
              color="light"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <KeyboardArrowLeftIcon fontSize="small" />
            </CButton>

            {/* Page numbers */}
            {visiblePageNumbers.map((page, index) =>
              page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                <CButton key={`ellipsis-${index}`} color="light" disabled>
                  ...
                </CButton>
              ) : (
                <CButton
                  key={page}
                  color={currentPage === page ? 'primary' : 'light'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </CButton>
              ),
            )}

            {/* Next page button */}
            <CButton
              color="light"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <KeyboardArrowRightIcon fontSize="small" />
            </CButton>

            {/* Last page button */}
            <CButton
              color="light"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              <LastPageIcon fontSize="small" />
            </CButton>
          </CButtonGroup>
        </div>
      </div>
    </CContainer>
  )
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      Cell: PropTypes.func,
      width: PropTypes.string,
    }),
  ).isRequired,
  data: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  setcurrentPage: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
}

DataTable.defaultProps = {
  itemsPerPage: 10,
}

export default DataTable
