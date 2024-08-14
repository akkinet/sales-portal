"use client"
import React, { useState, useMemo } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa6"
import Image from "next/image"
import {
  sortByFeatureCount,
  sortByTotalPrice
} from "../../app/utils/helperFunctions"

const PricingChart = ({ packages, suits }) => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [groups, setGroups] = useState(suits.sort(sortByTotalPrice))
  const [products, setProducts] = useState(packages)
  const [showProducts, setShowProducts] = useState(true)
  const [showOptions, setShowOptions] = useState(true)

  const packagesOption = useMemo(() => packages.map(p => p.category), [])

  const groupsOption = useMemo(() => groups.map(p => p.group), [])

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
      setSelectedProducts(cat)
    } else {
      cat = selectedProducts.concat(product)
      setSelectedProducts(cat)
    }
    urlSearchParams.set("category", cat)
    const queryString = urlSearchParams.toString()
    let p_data = await fetch(`/api/packages?${queryString}`)
    p_data = await p_data.json()
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
    urlSearchParams.set("group", grp)
    const queryString = urlSearchParams.toString()
    let p_data = await fetch(`/api/packages?${queryString}`)
    p_data = await p_data.json()
    setProducts(p_data)
    let g_data = await fetch(`/api/suits?${queryString}`)
    g_data = await g_data.json();
    console.log(g_data);
    setGroups(g_data.sort(sortByTotalPrice))
  }

  const toggleProductsVisibility = () => {
    setShowProducts(!showProducts)
  }

  const toggleOptionsVisibility = () => {
    setShowOptions(!showOptions)
  }

  const checkOutHandler = async prices => {
    const res = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify(prices)
    })
    const payLink = await res.json()

    window.location.href = payLink.url
  }

  return (
    <div className="flex flex-col lg:flex-row bg-gray-300">
      <div className="lg:w-[20%] p-4 bg-gray-200">
        <div className="flex flex-row justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-600">Filter</h2>
          </div>
          <div>
            {(selectedProducts.length > 0 || selectedGroups.length > 0) && <h2 className="text-2xl font-semibold mb-4 text-cyan-600 cursor-pointer">Clear Filter</h2>}
          </div>
        </div>
        <div className="mb-8">
          <div
            className="bg-cyan-600 text-white p-2 flex items-center justify-between mb-2 cursor-pointer"
            onClick={toggleProductsVisibility}
          >
            <h3 className="text-md font-medium">Select Product</h3>
            {showProducts ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          {showProducts && (
            <div className="space-y-2">
              {packagesOption.map(product => (
                <label
                  key={product}
                  className="flex items-center justify-between space-x-2 bg-pink-600 p-1 text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product)}
                    onChange={() => toggleProduct(product)}
                    className="form-checkbox text-pink-500 h-6 w-6"
                  />
                  <span>{product}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div>
          <div
            className="bg-cyan-600 text-white p-2 flex items-center justify-between mb-2 cursor-pointer"
            onClick={toggleOptionsVisibility}
          >
            <h3 className="text-md font-medium">Select Options</h3>
            {showOptions ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          {showOptions && (
            <div className="space-y-2">
              {groupsOption.map(option => (
                <label
                  key={option}
                  className="flex items-center justify-between space-x-2 bg-pink-600 p-2 text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="form-checkbox text-pink-500 h-6 w-6"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="right-container lg:w-[80%] w-full p-4">
        {/* Shared container for aligning upper and lower sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          <div className="text-center text-2xl text-white p-3"></div>
          {groups?.map((g, i) => (
            <div
              key={i}
              className="text-center text-2xl bg-cyan-600 text-white p-3"
            >
              {g.group}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 pb-4">
          <div className="text-center text-2xl text-white p-3"></div>
          {groups?.map((g, i) => (
            <div key={i} className="relative text-center">
              <Image
                src="https://res.cloudinary.com/dduiqwdtr/image/upload/v1723184590/Hexerve%20website%20assets/trianglePink.png"
                alt="Triangle Pink"
                width={350}
                height={100}
                priority
                className="w-full"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white lg:text-md">
                <span>$ {g.totalPrice} Per Month </span>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto">
          {products?.map(p => (
            <React.Fragment key={JSON.stringify(p)}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-4 pb-4">
                <div className="col-span-1 text-center text-2xl bg-cyan-600 text-white p-3">
                  {p.category}
                </div>
                {sortByFeatureCount(p.products).map(pro => (
                  <div
                    key={JSON.stringify(pro.name)}
                    className="text-center text-2xl bg-cyan-600 text-white p-3"
                  >
                    {pro.name}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1 border-t">
                {Array.from(new Set(p.products.map(p => p.features).flat())).map(i => (
                  <React.Fragment key={i}>
                    <div className="col-span-1 text-center font-semibold p-3 bg-gray-100 mb-1">
                      {i}
                    </div>
                    {sortByFeatureCount(p.products).map(pro => (
                      <div
                        key={JSON.stringify(pro)}
                        className="col-span-1 border flex justify-center items-center mb-1 bg-gray-100"
                      >
                        {pro.features.includes(i) ? (
                          <span className="text-green-500 text-2xl">✔️</span>
                        ) : (
                          <span className="text-red-500 text-2xl">❌</span>
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-4">
          <div className="text-center text-4xl bg-cyan-600 text-white p-3 h-[25vh] font-bold leading-snug">
            <p>Expected</p>
            <p>Results</p>
          </div>
          {groups?.map(g => (
            <div
              key={g.group}
              className="text-center text-lg bg-cyan-600 text-white p-3"
            >
              <p className="mb-4">{g.expectedOutput}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-1">
          <div className="col-span-1 flex justify-center bg-cyan-600 p-7"></div>
          {groups?.map(g => (
            <div
              key={g.group}
              className="col-span-1 flex justify-center bg-cyan-600 p-2"
            >
              <button
                onClick={() => checkOutHandler(g.prices)}
                className="bg-pink-600 text-white px-8 py-2 rounded focus:bg-pink-700"
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
