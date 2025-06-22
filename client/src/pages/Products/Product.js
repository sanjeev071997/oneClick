import React from 'react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'

const Product = () => {
  return (
    <>
    <Navbar />
    <div className="product-page">
      <h1>Product Page</h1>
      <p>This is the product page content.</p>
      {/* Add more product details here */}
    </div>
    <Footer />
    </>
  )
}

export default Product