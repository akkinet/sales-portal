'use client'
import React, { useState, useMemo } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6'
import Image from 'next/image'
import {
  sortByTotalPrice,
  sortByFeatureCount
} from '../../app/utils/helperFunctions'

const PricingChart = ({ packages, suits }) => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [groups, setGroups] = useState(suits.sort(sortByTotalPrice))
  const [products, setProducts] = useState(packages)
  const [showProducts, setShowProducts] = useState(true)
  const [showOptions, setShowOptions] = useState(true)

  const packagesOption = useMemo(() => packages.map(p => p.category), [])

  const groupsOption = useMemo(() => groups.map(p => p.group), [])
  const featuresOption = useMemo(
    () =>
      packages
        .map(p => ({ packages: p.products, category: p.category }))
        .map(p => ({
          features: Array.from(
            new Set(p.packages.map(pp => pp.features).flat())
          ),
          category: p.category
        })),
    []
  )
  const [selectedFeatures, setSelectedFeatures] = useState(featuresOption)

  const toggleProduct = async product => {
    const urlSearchParams = new URLSearchParams({
      category: selectedProducts,
      group: selectedGroups
    })
    let cat
    if (selectedProducts.includes(product)) {
      const inx = selectedProducts.indexOf(product)
      cat = [
        ...selectedProducts.slice(0, inx),
        ...selectedProducts.slice(inx + 1)
      ]
    } else {
      cat = selectedProducts.concat(product)
    }
    setSelectedProducts(cat)
    urlSearchParams.set('category', cat)
    const queryString = urlSearchParams.toString()
    let p_data = await fetch(`/api/packages?${queryString}`)
    p_data = await p_data.json()
    let features = []
    if (cat.length > 0) {
      features = featuresOption.filter(f => cat.includes(f.category))
    } else {
      features = [...featuresOption]
    }
    const packOrder = p_data.map(p => p.category)
    const reorderedData = features.sort((a, b) => {
      const indexA = packOrder.indexOf(a.category)
      const indexB = packOrder.indexOf(b.category)
      return indexA - indexB
    })
    setSelectedFeatures(reorderedData)
    setProducts(p_data)
    let g_data = await fetch(`/api/suits?${queryString}`)
    g_data = await g_data.json()
    setGroups(g_data.sort(sortByTotalPrice))
  }

  const toggleOption = async group => {
    const urlSearchParams = new URLSearchParams({
      category: selectedProducts,
      group: selectedGroups
    })
    let grp
    if (selectedGroups.includes(group)) {
      const inx = selectedGroups.indexOf(group)
      grp = [...selectedGroups.slice(0, inx), ...selectedGroups.slice(inx + 1)]
      setSelectedGroups(grp)
    } else {
      grp = selectedGroups.concat(group)
      setSelectedGroups(grp)
    }
    urlSearchParams.set('group', grp)
    const queryString = urlSearchParams.toString()
    let p_data = await fetch(`/api/packages?${queryString}`)
    p_data = await p_data.json()
    const packOrder = p_data.map(p => p.category)
    const features = featuresOption.filter(f => packOrder.includes(f.category))
    const reorderedData = features.sort((a, b) => {
      const indexA = packOrder.indexOf(a.category)
      const indexB = packOrder.indexOf(b.category)
      return indexA - indexB
    })
    setSelectedFeatures(reorderedData)
    setProducts(p_data)
    let g_data = await fetch(`/api/suits?${queryString}`)
    g_data = await g_data.json()
    setGroups(g_data.sort(sortByTotalPrice))
  }

  const toggleProductsVisibility = () => {
    setShowProducts(!showProducts)
  }

  const toggleOptionsVisibility = () => {
    setShowOptions(!showOptions)
  }

  const copyUrlHandler = () => {
    const urlSearchParams = new URLSearchParams({
      category: selectedProducts,
      group: selectedGroups
    })
    const queryString = urlSearchParams.toString()
    navigator.clipboard.writeText(`${window.location.origin}/price?${queryString}`)
  }

  const clearFilter = async () => {
    setSelectedFeatures(featuresOption)
    setSelectedProducts([])
    setSelectedGroups([])
    setProducts(packages)
    setGroups(suits.sort(sortByTotalPrice))
  }

  const checkOutHandler = async prices => {
    const res = await fetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify(prices)
    })
    const payLink = await res.json()

    window.location.href = payLink.url
  }

  return (
    <div className='flex flex-col lg:flex-row bg-gray-300'>
      {/* left container component */}
      <div className='lg:w-[20%] p-4 bg-gray-200'>
        <div className='flex flex-row justify-between'>
          <div>
            <h2 className='text-2xl font-semibold mb-4 text-cyan-600'>
              Filter
            </h2>
          </div>
          <div>
            {(selectedProducts.length > 0 || selectedGroups.length > 0) && (
              <h2
                onClick={clearFilter}
                className='text-2xl font-semibold mb-4 text-cyan-600 cursor-pointer'
              >
                Clear Filter
              </h2>
            )}
          </div>
        </div>
        <div className='mb-8'>
          <div
            className='bg-cyan-600 text-white p-2 flex items-center justify-between mb-2 cursor-pointer capitalize'
            onClick={toggleProductsVisibility}
          >
            <h3 className='text-md font-medium'>Select Product</h3>
            {showProducts ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          {showProducts && (
            <div className='space-y-2'>
              {packagesOption.map(product => (
                <label
                  key={product}
                  className='flex items-center justify-between space-x-2 bg-pink-600 p-1 text-white'
                >
                  <input
                    type='checkbox'
                    checked={selectedProducts.includes(product)}
                    onChange={() => toggleProduct(product)}
                    className='form-checkbox text-pink-500 h-6 w-6'
                  />
                  <span>{product}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div>
          <div
            className='bg-cyan-600 text-white p-2 flex items-center justify-between mb-2 cursor-pointer'
            onClick={toggleOptionsVisibility}
          >
            <h3 className='text-md font-medium'>Select Options</h3>
            {showOptions ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          {showOptions && (
            <div className='space-y-2'>
              {groupsOption.map(option => (
                <label
                  key={option}
                  className='flex items-center justify-between space-x-2 bg-pink-600 p-2 text-white capitalize'
                >
                  <input
                    type='checkbox'
                    checked={selectedGroups.includes(option)}
                    onChange={() => toggleOption(option)}
                    className='form-checkbox text-pink-500 h-6 w-6'
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button onClick={copyUrlHandler} className='ml-[15%] w-[70%] p-2 mt-4 text-2xl font-bold bg-cyan-600 text-white hover:text-white hover:bg-black rounded-md'>Copy URL</button>

      </div>
      {/* right container component  */}
      <div className='right-container lg:w-[80%] w-full p-4'>
        {/* Shared container for aligning upper and lower sections */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-1'>
          <div className='text-center text-2xl text-white p-3 bg-cyan-600 '></div>
          {groups?.map((g, i) => (
            <div
              key={i}
              className='text-center text-2xl bg-cyan-600 text-white p-3 capitalize'
            >
              {g.group}
            </div>
          ))}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-1 pb-4'>
          <div className='text-center text-5xl text-white p-3 bg-cyan-600 pt-4'>Sales <br /> Portal</div>
          {groups?.map((g, i) => (
            <div key={i} className='relative text-center'>
              <Image
                src='https://res.cloudinary.com/dduiqwdtr/image/upload/v1723184590/Hexerve%20website%20assets/trianglePink.png'
                alt='Triangle Pink'
                width={350}
                height={100}
                priority
                className='w-full'
              />
              <div className='absolute  inset-0 flex flex-col justify-center items-center text-white lg:text-md text-xl'>
                <span>$ {g.totalPrice} Per Month </span>
              </div>
            </div>
          ))}
        </div>

        <div className='overflow-x-auto'>
          {products?.map((p, inx) => (
            <React.Fragment key={JSON.stringify(p)}>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-1 mt-4 pb-4'>
                <div className='col-span-1 text-center text-2xl bg-cyan-600 text-white p-3 flex items-center justify-center'>
                  {p.category}
                </div>
                {sortByFeatureCount(p.products).map(pro => (
                  <div
                    key={JSON.stringify(pro.name)}
                    className='flex items-center justify-center text-2xl bg-cyan-600 text-white p-3 text-center'
                  >
                    {pro.name}
                  </div>
                ))}
              </div>
              {'metadata' in p.products[0] &&
                <div className='grid grid-cols-1 md:grid-cols-4 gap-1'>
                  <div className=' col-span-1 bg-gray-100 h-full'>
                    {Object.keys(p.products[0]?.metadata).map(i => (
                      <div
                        key={i}
                        className='text-center text-lg font-semibold px-3 py-3 mb-1  border-b-2 border-gray-300  capitalize'
                      >
                        {i}
                      </div>
                      
                    ))}
                  </div>
                  {sortByFeatureCount(p.products).map(pro => (
                    <div
                      key={JSON.stringify(pro)}
                      className='text-sm  col-span-1 bg-gray-100 h-full'
                    >
                      {Object.values(pro.metadata).map(i => (
                        <div
                          key={i}
                          className='flex justify-center items-center p-3 py-4 mb-1 border-b-2 border-gray-300 '
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              }
              <div className='grid grid-cols-1 md:grid-cols-4 gap-1'>
                <div className='col-span-1 bg-gray-100 h-[98%]'>
                  {selectedFeatures[inx]?.features.map(i => (
                    <div
                      key={i}
                      className='text-center font-semibold px-3 py-4 mb-1 border-b-2 border-gray-300 capitalize'
                    >
                      {i}
                    </div>
                  ))}
                </div>
                {sortByFeatureCount(p.products).map(pro => (
                  <div
                    key={JSON.stringify(pro)}
                    className='text-sm col-span-1 bg-gray-100 h-[98%]'
                  >
                    {selectedFeatures[inx]?.features.map(i => (
                      <div
                        key={i}
                        className='flex justify-center items-center p-3 mb-1 border-b-2 border-gray-300'
                      >
                        {pro.features.includes(i) ? (
                          <div className='text-green-500 text-2xl'>✔️</div>
                        ) : (
                          <div className='text-red-500 text-2xl'>❌</div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-1 mt-4'>
          <div className='text-center text-4xl bg-cyan-600 text-white p-3  font-bold leading-snug'>
            <p>Expected</p>
            <p>Results</p>
          </div>
          {groups?.map(g => (
            <div
              key={g.group}
              className='text-center text-lg bg-cyan-600 text-white p-3'
            >
              <p className='mb-4'>{g.expectedOutput}</p>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-1 mt-1'>
          <div className='col-span-1 flex justify-center bg-cyan-600 p-7'></div>
          {groups?.map(g => (
            <div
              key={g.group}
              className='col-span-1 flex justify-center bg-cyan-600 p-2'
            >
              <button
                onClick={() => checkOutHandler(g.prices)}
                className='bg-pink-600 text-white px-8 py-2 rounded focus:bg-pink-700'
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PricingChart
