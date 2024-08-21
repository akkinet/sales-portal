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
  const searchParams = useSearchParams()
  const category = searchParams.get('category')?.split(',')
  const group = searchParams.get('group')?.split(',')
  const fetchApi = async () => {
    const urlSearchParams = new URLSearchParams()
    if (category && category.length > 0)
      urlSearchParams.set('category', category)
    if (group && group.length > 0)
      urlSearchParams.set('group', group)
    const queryString = urlSearchParams.toString();
    let data = await fetch(`/api/stripe?${queryString}`)
    data = await data.json();
    const p_data = data.packages;
    const g_data = data.suits;
    let forPack = await fetch(`/api/stripe`)
    forPack = await forPack.json();
    const pack = forPack.packages;
    let features = pack
      .map(p => ({ packages: p.products, category: p.category }))
      .map(p => ({
        features: Array.from(new Set(p.packages.map(pp => pp.features).flat())),
        category: p.category,
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
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    fetchApi()
  }, [])

  const checkOutHandler = async prices => {
    const res = await fetch('/api/payment', {
      method: 'POST',
      body: JSON.stringify(prices),
    })
    const payLink = await res.json()

    window.location.href = payLink.url
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-full h-full p-4'>
        <div className='right-container lg:w-[80%] w-full p-4 border-2 border-cyan-600 rounded-2xl bg-gray-200'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-1'>
            <div className='text-center text-2xl text-white p-3 bg-gray-300 animate-pulse'></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='text-center text-2xl bg-gray-300 animate-pulse p-3'
              ></div>
            ))}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-1 pb-4'>
            <div className='text-center text-2xl text-white p-3 bg-gray-300 animate-pulse'></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='relative text-center'>
                <div className='w-full h-24 bg-gray-300 animate-pulse'></div>
                <div className='absolute inset-0 flex flex-col justify-center items-center text-white lg:text-md text-xl bg-gray-400 animate-pulse'></div>
              </div>
            ))}
          </div>
          <div className='overflow-x-auto'>
            {[...Array(2)].map((_, inx) => (
              <React.Fragment key={inx}>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-1 mt-4 pb-4'>
                  <div className='col-span-1 text-center text-2xl bg-gray-300 animate-pulse p-3'></div>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='text-center text-2xl bg-gray-300 animate-pulse p-3'
                    ></div>
                  ))}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-1 border-t'>
                  <div className='col-span-1 bg-gray-200 h-[97%] animate-pulse'>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className='text-center font-semibold p-3 py-4 mb-1 bg-gray-300 animate-pulse'
                      ></div>
                    ))}
                  </div>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className='col-span-1 bg-gray-200 h-[97%] animate-pulse'
                    >
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className='flex justify-center items-center p-3 py-4 mb-1 bg-gray-300 animate-pulse'
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-1 mt-4'>
            <div className='text-center text-4xl bg-gray-300 animate-pulse p-3 h-[25vh] font-bold leading-snug'></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='text-center text-lg bg-gray-300 animate-pulse p-3'
              ></div>
            ))}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-1 mt-1'>
            <div className='col-span-1 flex justify-center bg-gray-300 p-7 animate-pulse'></div>
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className='col-span-1 flex justify-center bg-gray-300 p-2 animate-pulse'
              >
                <div className='bg-pink-600 text-white px-8 py-2 rounded focus:bg-pink-700 animate-pulse'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex justify-center items-center w-full h-full p-4'>
      <div className='right-container lg:w-[80%] w-full p-4 border-2 border-cyan-600 rounded-2xl bg-gray-200'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-1'>
          <div className=' text-2xl text-white p-3 capitalize bg-cyan-600'></div>
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
          <div className='text-center text-5xl text-white p-3 bg-cyan-600 pt-4 '>Client's <br />Page</div>

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
              <div className='absolute inset-0 flex flex-col justify-center items-center text-white lg:text-md text-xl'>
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
                    className='flex items-center justify-center text-center text-2xl bg-cyan-600 text-white p-3'
                  >
                    {pro.name}
                  </div>
                ))}
              </div>
              {'metadata' in p.products[0] &&
                <div className='grid grid-cols-1 md:grid-cols-4 gap-1'>
                  <div className='col-span-1 bg-gray-100 h-[97%]'>
                    {Object.keys(p.products[0]?.metadata).map(i => (
                      <div
                        key={i}
                        className='text-center font-semibold px-3 py-4 mb-1 border-b-2 capitalize'
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
                      {Object.values(pro.metadata).map(i => (
                        <div
                          key={i}
                          className='flex justify-center items-center p-3 mb-1 border-b-2 '
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              }
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
          <div className='text-center text-4xl bg-cyan-600 text-white p-3 font-bold leading-snug'>
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
