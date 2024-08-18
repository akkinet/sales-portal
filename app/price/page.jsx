'use client'
import React, { useEffect, useState } from 'react'
import { sortByFeatureCount } from '../utils/helperFunctions'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

const Price = () => {
  const [groups, setGroups] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const searchParams = useSearchParams();
  const category = searchParams.get("category")
  const group = searchParams.get("group")

  const fetchApi = async (groups, products) => {
    const urlSearchParams = new URLSearchParams({
      category: products?.split(',') || '',
      group: groups?.split(',') || ''
    })
    const queryString = urlSearchParams.toString()

    let p_data = await fetch(`/api/packages?${queryString}`)
    p_data = await p_data.json()
    let g_data = await fetch(`/api/suits?${queryString}`)
    g_data = await g_data.json()
    let pack = await fetch(`/api/packages`)
    pack = await pack.json()
    let features = pack
    .map(p => ({ packages: p.products, category: p.category }))
    .map(p => ({
      features: Array.from(
        new Set(p.packages.map(pp => pp.features).flat())
      ),
      category: p.category
    }))
    const packOrder = p_data.map(p => p.category)
    features = features.filter(f => packOrder.includes(f.category))
    const reorderedData = features.sort((a, b) => {
      const indexA = packOrder.indexOf(a.category)
      const indexB = packOrder.indexOf(b.category)
      return indexA - indexB
    })
    setSelectedFeatures(reorderedData)
    setProducts(p_data)
    setGroups(g_data)
  }

  useEffect(() => {
    setIsLoading(true)
    // console.log('params', category, typeof (category), group)
    fetchApi(group, category)
    setIsLoading(false)
  }, [])

const checkOutHandler = async prices => {
  const res = await fetch('/api/payment', {
    method: 'POST',
    body: JSON.stringify(prices)
  })
  const payLink = await res.json()

  window.location.href = payLink.url
}

if (isLoading)
  return <div>Loading...</div>

return (
  <div className='flex justify-center items-center w-full h-full p-4'>
  <div className='right-container lg:w-[80%] w-full p-4 border-2 border-cyan-600 rounded-2xl bg-gray-200'>
    {/* Shared container for aligning upper and lower sections */}
    <div className='grid grid-cols-1 md:grid-cols-4 gap-1'>
      <div className='text-center text-2xl text-white p-3 '></div>
      {groups?.map((g, i) => (
        <div
          key={i}
          className='text-center text-2xl bg-cyan-600 text-white p-3 '
        >
          {g.group}
        </div>
      ))}
    </div>
    <div className='grid grid-cols-1 md:grid-cols-4 gap-1 pb-4'>
      <div className='text-center text-2xl text-white p-3'></div>
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
            <div className='col-span-1 text-center text-2xl bg-cyan-600 text-white p-3'>
              {p.category}
            </div>
            {sortByFeatureCount(p.products).map(pro => (
              <div
                key={JSON.stringify(pro.name)}
                className='text-center text-2xl bg-cyan-600 text-white p-3'
              >
                {pro.name}
              </div>
            ))}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-1 border-t'>
            <div className='col-span-1 bg-gray-100 h-[97%]'>
              {selectedFeatures[inx]?.features.map(i => (
                <div
                  key={i}
                  className='text-center font-semibold p-3 py-4 mb-1 border-b-2 capitalize'
                >
                  {i}
                </div>
              ))}
            </div>
            {sortByFeatureCount(p.products).map(pro => (
              <div
                key={JSON.stringify(pro)}
                className='col-span-1 bg-gray-100 h-[97%]'
              >
                {selectedFeatures[inx]?.features.map(i => (
                  <div
                    key={i}
                    className='flex justify-center items-center p-3 mb-1 border-b-2'
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
      <div className='text-center text-4xl bg-cyan-600 text-white p-3 h-[25vh] font-bold leading-snug'>
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

export default Price