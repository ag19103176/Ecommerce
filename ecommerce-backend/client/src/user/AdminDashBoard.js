import React from 'react'
import Base from '../core/Base'
import { isAuthenticated } from '../auth/helper'
import { Link } from 'react-router-dom';

const AdminDashBoard = () => {

const {user: {name,email,role}} = isAuthenticated();
 
const adminLeftSide = () => {
  return(
      <div className='card'>
        <h4 className='card-header bg-dark text-white'>
          <ul className='list-group'>
          <li className='list-group-item bg-dark text-white'>
             Admin Navigation
            </li>
            <li className='list-group-item bg-dark'>
              <Link to="/admin/create/category" className='nav-link text-info'>Create Categories</Link>
            </li>
            <li className='list-group-item bg-dark'>
              <Link to="/admin/categories" className='nav-link text-info'>Manage Categories</Link>
            </li>
            <li className='list-group-item bg-dark'>
              <Link to="/admin/create/product" className='nav-link text-info'>Create Product</Link>
            </li>
            <li className='list-group-item bg-dark'>
              <Link to="/admin/orders" className='nav-link text-info'>Manage Order</Link>
            </li>
            <li className='list-group-item bg-dark'>
              <Link to="/admin/products" className='nav-link text-info'>Manage Product</Link>
            </li>
          </ul>
        </h4>
      </div>
  )
}  
const adminRightSide = () => {
return(
<div className='card mb-4'>
  <h4 className='card-header'>Admin Information</h4>
  <ul className='list-group'>
    <li className='list-group-item'>
      <span className='badge bg-dark mr-2 pr-2'>Name:</span>  {name}
    </li>
  </ul>
  <ul className='list-group'>
    <li className='list-group-item'>
      <span className='badge bg-dark mr-2 pr-2'>Email:</span>  {email}
    </li>
    <li className='list-group-item'>
      <span className='badge bg-danger'>Admin Area</span>
    </li>
  </ul>
</div>
)
}  
  return (
    <Base title="Welcome to admin area!" className="container bg-success p-4" description='Manage all your stuff here!'>
      <div className='row'>
        <div className='col-3'>
           {adminLeftSide()}
        </div>
        <div className='col-9'>
           {adminRightSide()}
        </div>
      </div>
    </Base>
  )
}

export default AdminDashBoard