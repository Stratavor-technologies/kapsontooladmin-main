import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <div target="_blank">
          ©2021-22 TTC Robotronics Pvt. Ltd.
        </div>
      </div>
      <div className="ms-auto d-flex align-items-center">
        <span className="me-1">D & D by:</span>
        <div target="_blank" rel="noopener noreferrer">
          TTCR Pvt. Ltd. 
        </div>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
