"use client"
import React, { useState } from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa6"
import Image from "next/image"

const dummyProducts = [
  "SEO",
  "Landing Page",
  "Social Media",
  "SEO Advance",
  "SEO Boost"
]

const dummyOptions = {
  Kickstarter: false,
  Recommended: false,
  Superfast: false
}

const productDetails = {
  SEO: {
    plans: ["Basic", "Boost", "Blast"],
    features: {
      "On Page Activities": [true, true, true],
      "Off Page Activities": [false, true, true],
      "Feature 3-Backlinks": [false, false, true]
    }
  },
  "Landing Page": {
    plans: ["Basic", "Standard", "Premium"],
    features: {
      "Feature 1": [true, true, true],
      "Feature 2": [false, true, true],
      "Feature 3": [false, false, true]
    }
  },
  "SEO Advance": {
    plans: ["Basic", "Standard", "Premium"],
    features: {
      "Feature 1": [true, true, true],
      "Feature 2": [false, true, true],
      "Feature 3": [false, false, true]
    }
  },
  "Social Media": {
    plans: ["Basic", "Standard", "Premium"],
    features: {
      "Feature 1": [true, true, true],
      "Feature 2": [false, true, true],
      "Feature 3": [false, false, true]
    }
  },
  "SEO Boost": {
    plans: ["Basic", "Standard", "Premium"],
    features: {
      "Feature 1": [true, true, true],
      "Feature 2": [false, true, true],
      "Feature 3": [false, false, true]
    }
  }
}

const Catalogue = () => {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [options, setOptions] = useState(dummyOptions)
  const [showProducts, setShowProducts] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

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
              {dummyProducts.map(product => (
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
          <div className="text-center text-2xl bg-cyan-600 text-white p-3">
            KICKSTARTER
          </div>
          <div className="text-center text-2xl bg-cyan-600 text-white p-3">
            RECOMMENDED
          </div>
          <div className="text-center text-2xl bg-cyan-600 text-white p-3">
            SUPERFAST
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 pb-4 ">
          <div className="text-center text-2xl text-white p-3"></div>
          <div className="relative text-center ">
            <Image
              src="https://res.cloudinary.com/dduiqwdtr/image/upload/v1723184590/Hexerve%20website%20assets/trianglePink.png"
              alt="Triangle Pink"
              width={350}
              height={100}
              className="w-full"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white lg: text-md ">
              <span>
                <s>$595</s> $ 495 Per Month +{" "}
              </span>
              <span>One time $ 1,195</span>
            </div>
          </div>
          <div className="relative text-center ">
            <Image
              src="https://res.cloudinary.com/dduiqwdtr/image/upload/v1723184590/Hexerve%20website%20assets/trianglePink.png"
              alt="Triangle Pink"
              width={300}
              height={100}
              className="w-full"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-md">
              <span>
                <s>$595</s> $ 495 Per Month +{" "}
              </span>
              <span>One time $ 1,195</span>
            </div>
          </div>
          <div className="relative text-center ">
            <Image
              src="https://res.cloudinary.com/dduiqwdtr/image/upload/v1723184590/Hexerve%20website%20assets/trianglePink.png"
              alt="Triangle Pink"
              width={300}
              height={100}
              className="w-full"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-md">
              <span>
                <s>$595</s> $ 495 Per Month +{" "}
              </span>
              <span>One time $ 1,195</span>
            </div>
          </div>
        </div>

        {selectedProducts.map(product => (
          <React.Fragment key={product}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-4 pb-4">
              <div className="col-span-1 text-center text-2xl bg-cyan-600 text-white p-3">
                {product}
              </div>

              {productDetails[product].plans.map((plan, index) => (
                <div key={plan} className="col-span-1">
                  <div className="text-center text-2xl bg-cyan-600 text-white p-3">
                    {plan}
                  </div>
                </div>
              ))}
            </div>
            {Object.keys(productDetails[product].features).map(feature => (
              <div
                className="grid grid-cols-1 md:grid-cols-4 gap-1 border-t"
                key={feature}
              >
                <div className="col-span-1 text-center font-semibold p-3 bg-gray-100 mb-1">
                  {feature}
                </div>
                {productDetails[product].features[feature].map(
                  (item, index) => (
                    <div
                      key={index}
                      className="col-span-1 border flex justify-center items-center mb-1 bg-gray-100"
                    >
                      {item ? (
                        <span className="text-green-500 text-2xl">✔️</span>
                      ) : (
                        <span className="text-red-500 text-2xl">❌</span>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-4">
          <div className="text-center text-4xl bg-cyan-600 text-white p-3 h-[25vh] font-bold leading-snug">
            <p>Expected </p>
            <p>Results</p>
          </div>
          <div className="text-center text-lg bg-cyan-600 text-white p-3">
            <p className="mb-4">On 1st page of Google in 4-6 months</p>
            <p className="mb-4">Free leads after 3 months</p>
            <p>Brand recognition and building</p>
          </div>
          <div className="text-center text-lg bg-cyan-600 text-white p-3">
            {" "}
            <p className="mb-4">On 1st page of Google in 2-3 months</p>
            <p className="mb-4">Free leads after 2 months</p>
            <p>Brand recognition and building</p>
          </div>
          <div className="text-center text-lg bg-cyan-600 text-white p-3">
            {" "}
            <p className="mb-4">On 1st page of Google in 2-3 months</p>
            <p className="mb-4">Paid Leads after 1 Week</p>
            <p>Brand Boost and Viral</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-1">
          <div className="col-span-1 flex justify-center bg-cyan-600 p-7"></div>
          <div className="col-span-1 flex justify-center bg-cyan-600 p-7"></div>
          <div className="col-span-1 flex justify-center bg-cyan-600 p-7"></div>
          <div className="col-span-1 flex justify-center bg-cyan-600 p-7"></div>
        </div>
        {selectedProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mt-1">
            <div className="col-span-1 flex justify-center bg-cyan-600 p-7"></div>
            <div className="col-span-1 flex justify-center bg-cyan-600 p-2">
              <button className="bg-pink-600 text-white px-8 py-2 rounded focus:bg-pink-700">
                Buy Now
              </button>
            </div>
            <div className="col-span-1 flex justify-center bg-cyan-600 p-2">
              <button className="bg-pink-600 text-white px-8 py-2 rounded focus:bg-pink-700">
                Buy Now
              </button>
            </div>
            <div className="col-span-1 flex justify-center bg-cyan-600 p-2">
              <button className="bg-pink-600 text-white px-8 py-2 rounded focus:bg-pink-700">
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalogue