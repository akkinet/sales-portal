'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Header } from './Header'
import toast, { Toaster } from 'react-hot-toast'
import { RiDeleteBin6Line } from 'react-icons/ri'

const Invoice = ({ packages }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [customers, setCustomers] = useState([])
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [selectedCoupon, setSelectedCoupon] = useState('')

  // Fetch coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/coupon')
        const data = await response.json()
        setCoupons(data)
      } catch (error) {
        toast.error('Failed to load coupons.', { position: 'top center' })
      }
    }

    fetchCoupons()
  }, [])

  const products = useMemo(
    () =>
      packages
        .map(p => p.products)
        .flat()
        .map(p => ({
          id: p.id,
          name: p.name,
          features: p.features,
          metadata: p.metadata,
          price: p.price,
          quantity: 1
        })),
    [packages]
  )

  const [rows, setRows] = useState([products[0]])

  const quantityOptions = [1, 2, 3, 4, 5]

  const handleAddRow = () => {
    const availableProduct = products.find(
      product => !rows.some(row => row.id === product.id)
    )
    if (availableProduct) {
      setRows([...rows, availableProduct])
      toast.success('Package added successfully!', {
        position: 'top center'
      })
    } else {
      toast.error('No more products available to add.', {
        position: 'top center'
      })
    }
  }

  const handleProductChange = (index, newProductId) => {
    const updatedRows = [...rows]
    updatedRows[index] = products.find(p => p.id === newProductId)
    setRows(updatedRows)
  }

  const handleQtyChange = (index, newQty) => {
    const updatedRows = [...rows]
    updatedRows[index].quantity = parseInt(newQty)
    setRows(updatedRows)
  }

  const handleRemove = index => {
    const updatedRows = rows.filter((_, i) => i !== index)
    setRows(updatedRows)
    toast.success('Package deleted successfully!', {
      position: 'top center'
    })
  }

  const generateInvoice = async event => {
    event.preventDefault()
    if (!name || !email) {
      toast.error('Please fill in both name and email', {
        position: 'top center'
      })
      return
    }

    let res = await fetch('/api/invoice', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        products: rows
      })
    })
    res = await res.json()
    if (!res.error) {
      toast.success('Invoice sent successfully!', {
        position: 'top center'
      })
      setRows([])
      setName('')
      setEmail('')
    } else {
      toast.error('Failed to send invoice. Please try again.', {
        position: 'top center'
      })
    }
  }

  const clientInfoHandler = async e => {
    const val = e.target.value.trim()
    setEmail(val)
    let data
    if (val.length > 0) {
      const response = await fetch(`/api/customer/${val}`)
      data = await response.json()
      setCustomers(data.data)
    } else setCustomers([])

    const client = data?.data.find(c => c.email.startsWith(val)) || null
    if (client) setName(client.name)
    else setName('')
  }

  const totalAmount = useMemo(() => {
    const amount = rows.reduce(
      (total, row) => total + row.price * row.quantity,
      0
    )
    return appliedCoupon
      ? amount * (1 - appliedCoupon.percent_off / 100)
      : amount
  }, [rows, appliedCoupon])

  const applyCoupon = () => {
    const coupon = coupons.find(c => c.id === selectedCoupon)
    if (coupon) {
      setAppliedCoupon(coupon)
      toast.success(`Coupon applied: ${coupon.percent_off}% off`, {
        position: 'top center'
      })
    } else {
      toast.error('Invalid coupon selected', {
        position: 'top center'
      })
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setSelectedCoupon('')
    toast.success('Coupon removed successfully!', { position: 'top center' })
  }

  const discountedAmount = useMemo(() => {
    if (appliedCoupon) {
      const amount = rows.reduce(
        (total, row) => total + row.price * row.quantity,
        0
      )
      return amount * (appliedCoupon.percent_off / 100)
    }
    return 0
  }, [rows, appliedCoupon])

  return (
    <>
      <Toaster />
      <style jsx>{`
        @media (max-width: 640px) {
          .hide-arrow {
            appearance: none;
            background: transparent;
            border: none;
            padding: 0;
          }
        }
      `}</style>
      <div className='absolute w-full'>
        <Header />
      </div>
      <div className="invoice-container flex items-center justify-center min-h-screen bg-cover bg-[url('https://res.cloudinary.com/dduiqwdtr/image/upload/v1723017827/Hexerve%20website%20assets/w2wumqgvwfuc3evxzefw.jpg')]">
        <div
          className='create-invoice w-full max-w-6xl p-4 lg:p-6 rounded-lg shadow-lg lg:mt-16 z-150 sm: m-4'
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className='bg-white rounded-lg'>
            <div className='text-center bg-cyan-600 text-white py-4 rounded-t-lg'>
              <h1 className='text-2xl sm:text-3xl lg:text-5xl font-mono font-bold'>
                Create Invoice
              </h1>
            </div>
            <div className='flex flex-col lg:flex-row items-center justify-between p-4 lg:p-6'>
              <div className='w-full mb-4 lg:mb-0 lg:mr-4'>
                <label
                  className='block text-lg sm:text-xl lg:text-2xl mb-2 font-bold'
                  htmlFor='name'
                >
                  Client's Name:
                </label>
                <input
                  className='w-full border-2 border-cyan-600 text-lg sm:text-xl lg:text-2xl px-2 py-1 rounded-md'
                  id='name'
                  value={name}
                  list='customer-names'
                  onChange={e => setName(e.target.value)}
                />
                <datalist id='customer-names'>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.name} />
                  ))}
                </datalist>
              </div>
              <div className='w-full'>
                <label
                  className='block text-lg sm:text-xl lg:text-2xl mb-2 font-bold'
                  htmlFor='email'
                >
                  Client's Email:
                </label>
                <input
                  className='w-full border-2 border-cyan-600 text-lg sm:text-xl lg:text-2xl px-2 py-1 rounded-md'
                  id='email'
                  value={email}
                  list='customer-emails'
                  onChange={clientInfoHandler}
                />
                <datalist id='customer-emails'>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.email} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className='text-center bg-cyan-600 text-white py-4'>
              <h1 className='text-xl sm:text-2xl lg:text-4xl font-mono'>
                Product List
              </h1>
            </div>
            <div className='p-4 lg:p-6 lg:pt-1 overflow-auto max-h-[225px]'>
              <table className='w-full text-left border-separate border-spacing-2'>
                <thead>
                  <tr>
                    <th className='border-b-2 border-pink-600 text-sm sm:text-lg lg:text-2xl py-2'>
                      Sno.
                    </th>
                    <th className='border-b-2 border-pink-600 text-sm sm:text-lg lg:text-2xl py-2'>
                      Product Name
                    </th>
                    <th className='border-b-2 border-pink-600 text-sm sm:text-lg lg:text-2xl py-2'>
                      Price
                    </th>
                    <th className='border-b-2 border-pink-600 text-sm sm:text-lg lg:text-2xl py-2'>
                      Qty
                    </th>
                    <th className='border-b-2 border-pink-600 text-sm sm:text-lg lg:text-2xl py-2'>
                      Remove item
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td className='border-b-2 border-pink-600 text-center py-2 pt-0 text-xl'>
                        {index + 1}.
                      </td>
                      <td className='border-b-2 border-pink-600 text-center py-2 pt-0'>
                        <select
                          className='w-full text-sm md:text-xl lg:text-xl p-1 rounded-md hide-arrow'
                          value={row.id}
                          onChange={e =>
                            handleProductChange(index, e.target.value)
                          }
                          title={`Features:\n${row.features}${
                            row?.metadata
                              ? '\n\nMetadata:\n' +
                                Object.entries(row.metadata || {})
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join('\n')
                              : ''
                          }`}
                        >
                          {products.map(product => (
                            <option
                              key={product.id}
                              value={product.id}
                              disabled={rows.some(r => r.id === product.id)}
                            >
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className='border-b-2 border-pink-600 text-center py-2 pt-0 text-xl'>
                        ${row.price.toFixed(2)}
                      </td>
                      <td className='border-b-2 border-pink-600 text-center py-2 pt-0'>
                        <select
                          className='w-full text-sm md:text-xl lg:text-xl p-1 rounded-md hide-arrow'
                          value={row.quantity}
                          onChange={e => handleQtyChange(index, e.target.value)}
                        >
                          {quantityOptions.map(qty => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className='border-b-2 border-pink-600 text-center py-2 pt-0'>
                        <button
                          className='text-red-600 text-xl md:text-2xl lg:text-3xl'
                          onClick={() => handleRemove(index)}
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='lg:py-4'>
              <div className='flex flex-col lg:flex-col items-start lg:items-center justify-between'>
                {/* Button Row */}
                <div className='flex flex-wrap mb-4 lg:mb-0 w-[97%]'>
                  <button
                    className='text-lg sm:text-xl lg:text-2xl py-2 px-4 bg-cyan-600 text-white rounded-md shadow-md hover:bg-cyan-700 lg:mr-4 mb-2 lg:mb-0'
                    onClick={handleAddRow}
                  >
                    Add Package
                  </button>
                  <div className='flex flex-wrap mt-4 lg:mt-0 lg:ml-auto'>
                    <select
                      className='text-lg sm:text-xl lg:text-2xl p-2 rounded-md border-2 border-cyan-600 mb-2 lg:mb-0'
                      value={selectedCoupon}
                      onChange={e => setSelectedCoupon(e.target.value)}
                    >
                      <option value=''>Select Coupon</option>
                      {coupons.map(coupon => (
                        <option key={coupon.id} value={coupon.id}>
                          {coupon.code} - {coupon.percent_off}% off
                        </option>
                      ))}
                    </select>
                    <button
                      className='ml-2 text-lg sm:text-xl lg:text-2xl py-2 px-4 bg-cyan-600 text-white rounded-md shadow-md hover:bg-green-700 mb-2 lg:mb-0'
                      onClick={applyCoupon}
                    >
                      Apply Coupon
                    </button>
                    {appliedCoupon && (
                      <button
                        className='ml-2 text-lg sm:text-xl lg:text-2xl py-2 px-4 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700'
                        onClick={removeCoupon}
                      >
                        Remove Coupon
                      </button>
                    )}
                  </div>
                </div>
                {/* Total Amount and Discount Row */}
                <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between w-full lg:w-[97%] mt-2'>
                <div className='w-full lg:w-auto'>
                    <button
                      className='text-lg sm:text-xl lg:text-2xl py-2 px-4 bg-cyan-600 text-white rounded-md shadow-md hover:bg-green-700'
                      onClick={generateInvoice}
                    >
                      Generate Invoice
                    </button>
                  </div>
                  <div className='text-lg sm:text-xl lg:text-2xl font-medium mb-4 lg:mb-0'>
                   
                    {appliedCoupon && (
                      <div className='text-sm lg:text-lg mt-1'>
                        Discounted Amount: ${discountedAmount.toFixed(2)}
                      </div>
                    )}
                     Total Amount: ${totalAmount.toFixed(2)}
                    {appliedCoupon && (
                      <span className='text-red-600 text-sm lg:text-lg ml-2'>
                        ({appliedCoupon.percent_off}% off)
                      </span>
                    )}
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Invoice
