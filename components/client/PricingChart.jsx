"use client"
import React, { useState } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa6"
import Image from "next/image"
import { sortByFeatureCount, sortByTotalPrice } from "@/app/utils/helperFunctions"

const PricingChart = ({ packages, suits }) => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [group, setGroup] = useState(suits.sort(sortByTotalPrice))
  const [products, setProducts] = useState(packages)
  const [options, setOptions] = useState(Object.fromEntries(suits.map(s => [s.group, false])))
  const [showProducts, setShowProducts] = useState(true)
  const [showOptions, setShowOptions] = useState(true)
  const packagesOption = packages.map(p => p.category);

  const toggleProduct = product => {
    setSelectedProducts(prev =>
      prev.includes(product)
        ? prev.filter(p => p !== product)
        : [...prev, product]
    )
  }

  const toggleOption = option => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }))
  }

  const toggleProductsVisibility = () => {
    setShowProducts(!showProducts)
  }

  const toggleOptionsVisibility = () => {
    setShowOptions(!showOptions)
  }

  const checkOutHandler = async (payLink) => {

  }

  return (
    <div className="flex flex-col lg:flex-row bg-gray-300">
      <div className="lg:w-[20%] p-4 bg-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-600">Filter</h2>
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
              {Object.keys(options).map(option => (
                <label
                  key={option}
                  className="flex items-center justify-between space-x-2 bg-pink-600 p-2 text-white"
                >
                  <input
                    type="checkbox"
                    checked={options[option]}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-4">
          <div className="text-center text-2xl text-white p-3"></div>
          {group?.map((g, i) => <div key={i} className="text-center text-2xl bg-cyan-600 text-white p-3">
            {g.group}
          </div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 pb-4 ">
          <div className="text-center text-2xl text-white p-3"></div>
          {group?.map((g, i) => <div key={i} className="relative text-center ">
            <Image
              src="https://res.cloudinary.com/dduiqwdtr/image/upload/v1723184590/Hexerve%20website%20assets/trianglePink.png"
              alt="Triangle Pink"
              width={350}
              height={100}
              className="w-full"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white lg: text-md ">
              <span>$ {g.totalPrice} Per Month{" "}</span>
            </div>
          </div>)}
        </div>
        <table>
          {products?.map(p =>
            <>
              <tr key={JSON.stringify(p)}>
                <th>{p.category}</th>
                {(sortByFeatureCount(p.products)).map(pro => <th key={JSON.stringify(pro.name)}>
                  {pro.name}
                </th>)}
              </tr>
              {Array.from(new Set(p.products.map(p => p.features).flat())).map(i => <tr key={i}>
                <td>{i}</td>
                {(sortByFeatureCount(p.products)).map(pro => <td key={JSON.stringify(pro)}>
                  <div
                    className="col-span-1 border flex justify-center items-center mb-1 bg-gray-100"
                  >
                    {pro.features.includes(i) ? <span className="text-green-500 text-2xl">✔️</span>
                      : <span className="text-red-500 text-2xl">❌</span>
                    }
                  </div>
                </td>)}
              </tr>)}
            </>
          )}

        </table>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-4">
          <div className="text-center text-4xl bg-cyan-600 text-white p-3 h-[25vh] font-bold leading-snug">
            <p>Expected </p>
            <p>Results</p>
          </div>
          {
            group?.map(g => <div key={g.group} className="text-center text-lg bg-cyan-600 text-white p-3">
              <p>{g.expectedOutput}</p>
            </div>)
          }
        </div>
        {group.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-1">
            <div className="col-span-1 flex justify-center bg-cyan-600 p-7"></div>
            {group?.map(g => <div key={g.group} className="col-span-1 flex justify-center bg-cyan-600 p-2">
              <button onClick={() => checkOutHandler(g.paymentLink)} className="bg-pink-600 text-white px-8 py-2 rounded focus:bg-pink-700">
                Buy Now
              </button>
            </div>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default PricingChart