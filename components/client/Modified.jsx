"use client";
import React, { useState, useMemo, useEffect } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
  sortByTotalPrice,
  sortByFeatureCount,
} from "../../app/utils/helperFunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Modified = ({ packages, suits }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [groups, setGroups] = useState(suits.sort(sortByTotalPrice));
  const [products, setProducts] = useState(packages);
  const [showProducts, setShowProducts] = useState(true);
  const [showOptions, setShowOptions] = useState(true);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession()
  const router = useRouter()

  const packagesOption = useMemo(() => packages.map((p) => p.category), []);

  const groupsOption = useMemo(() => groups.map((p) => p.group), []);

  const featuresOption = useMemo(
    () =>
      packages
        .map((p) => ({ packages: p.products, category: p.category }))
        .map((p) => ({
          features: Array.from(
            new Set(p.packages.map((pp) => pp.features).flat())
          ),
          category: p.category,
        })),
    [packages]
  );

  const [selectedFeatures, setSelectedFeatures] = useState(featuresOption);

  useEffect(() => {
    setLoading(true)
    if (!session) {
      router.push("/login")
      return;
    }
    setLoading(false)
    // setTimeout(() => setLoading(false), 2000); 
  }, []);

  const toggleProduct = async (product) => {
    // setLoading(true);
    const urlSearchParams = new URLSearchParams();
    if (selectedGroups.length > 0) urlSearchParams.set("group", selectedGroups);
    let cat;
    if (selectedProducts.includes(product)) {
      const inx = selectedProducts.indexOf(product);
      cat = [
        ...selectedProducts.slice(0, inx),
        ...selectedProducts.slice(inx + 1),
      ];
    } else {
      cat = selectedProducts.concat(product);
    }
    if (cat.length > 0) urlSearchParams.set("category", cat);
    setSelectedProducts(cat);
    const queryString = urlSearchParams.toString();
    let data = await fetch(`/api/stripe?${queryString}`);
    data = await data.json();
    const p_data = data.packages;
    const g_data = data.suits;
    setGroups(g_data.sort(sortByTotalPrice));
    let features = [];
    if (cat.length > 0) {
      features = featuresOption.filter((f) => cat.includes(f.category));
    } else {
      features = [...featuresOption];
    }
    const packOrder = p_data.map((p) => p.category);
    const reorderedData = features.sort((a, b) => {
      const indexA = packOrder.indexOf(a.category);
      const indexB = packOrder.indexOf(b.category);
      return indexA - indexB;
    });
    setSelectedFeatures(reorderedData);
    setProducts(p_data);
    // setLoading(false);
  };

  const toggleOption = async (group) => {
    // setLoading(true);
    const urlSearchParams = new URLSearchParams();
    if (selectedProducts.length > 0)
      urlSearchParams.set("category", selectedProducts);
    let grp;
    if (selectedGroups.includes(group)) {
      const inx = selectedGroups.indexOf(group);
      grp = [...selectedGroups.slice(0, inx), ...selectedGroups.slice(inx + 1)];
    } else {
      grp = selectedGroups.concat(group);
    }
    setSelectedGroups(grp);
    if (grp.length > 0) urlSearchParams.set("group", grp);
    const queryString = urlSearchParams.toString();
    let data = await fetch(`/api/stripe?${queryString}`);
    data = await data.json();
    const p_data = data.packages;
    const g_data = data.suits;
    const packOrder = p_data.map((p) => p.category);
    const features = featuresOption.filter((f) =>
      packOrder.includes(f.category)
    );
    const reorderedData = features.sort((a, b) => {
      const indexA = packOrder.indexOf(a.category);
      const indexB = packOrder.indexOf(b.category);
      return indexA - indexB;
    });
    setSelectedFeatures(reorderedData);
    setProducts(p_data);
    setGroups(g_data.sort(sortByTotalPrice));
    // setLoading(false);
  };

  const toggleProductsVisibility = () => {
    setShowProducts(!showProducts);
  };

  const toggleOptionsVisibility = () => {
    setShowOptions(!showOptions);
  };

  const copyUrlHandler = () => {
    const urlSearchParams = new URLSearchParams();
    if (selectedProducts.length > 0)
      urlSearchParams.set("category", selectedProducts);
    if (selectedGroups.length > 0) urlSearchParams.set("group", selectedGroups);
    const queryString = urlSearchParams.toString();

    navigator.clipboard.writeText(`${window.location.origin}/price?${queryString}`)
      .then(() => {
        toast.success('URL copied Successfully');
      })
      .catch(() => {
        toast.error('Failed to copy URL.');
      });
  }

  const clearFilter = async () => {
    setSelectedFeatures(featuresOption);
    setSelectedProducts([]);
    setSelectedGroups([]);
    setProducts(packages);
    setGroups(suits.sort(sortByTotalPrice));
  };

  const checkOutHandler = async (prices) => {
    const res = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify(prices),
    });
    const payLink = await res.json();

    window.location.href = payLink.url;
  };

  if (loading)
    return null

  return (
    <div className='flex flex-col lg:flex-row bg-gray-300 min-h-screen'>
      <Toaster position="top-center" reverseOrder={false} />
      {/* left container component */}
      <div className="lg:w-[20%] p-4 bg-gray-200 flex flex-col ">
        <div className="flex flex-row justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-cyan-600">
              Filter
            </h2>
          </div>
          <div>
            {(selectedProducts.length > 0 || selectedGroups.length > 0) && (
              <h2
                onClick={clearFilter}
                className="text-xl lg:text-2xl font-semibold mb-4 text-cyan-600 cursor-pointer"
              >
                Clear Filter
              </h2>
            )}
          </div>
        </div>
        <div className="mb-8">
          <div
            className="bg-cyan-600 text-white p-2 flex items-center justify-between mb-2 cursor-pointer capitalize"
            onClick={toggleProductsVisibility}
          >
            <h3 className="text-md lg:text-lg font-medium">Select Product</h3>
            {showProducts ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          {showProducts && (
            <div className="space-y-2">
              {packagesOption.map((product) => (
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
                  <span className="text-sm lg:text-base">{product}</span>
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
            <h3 className="text-md lg:text-lg font-medium">Select Options</h3>
            {showOptions ? <FaArrowUp /> : <FaArrowDown />}
          </div>
          {showOptions && (
            <div className="space-y-2">
              {groupsOption.map((option) => (
                <label
                  key={option}
                  className="flex items-center justify-between space-x-2 bg-pink-600 p-2 text-white capitalize"
                >
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="form-checkbox text-pink-500 h-6 w-6"
                  />
                  <span className="text-sm lg:text-base">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={copyUrlHandler}
          className="ml-[15%] w-[70%] p-2 mt-4 text-lg lg:text-2xl font-bold bg-cyan-600 text-white hover:text-white hover:bg-black rounded-md"
        >
          Copy URL
        </button>
      </div>
      {/* right container component */}
      <div className='right-container lg:w-[80%] w-full p-4 flex flex-col items-center justify-center'>
        <div className='inner-right w-full max-w-8xl flex flex-col items-center'>
          <div className='w-full flex justify-center'>
            <div className="text-center text-xl lg:text-2xl bg-cyan-600 text-white p-3 capitalize flex-1 ml-1"></div>
            {groups?.map((g, i) => (
              <div
                key={i}
                className="text-center text-xl lg:text-2xl bg-cyan-600 text-white p-3 py-5 capitalize flex-1 ml-1"
              >
                {g.group}
              </div>
            ))}
          </div>
          <div className='w-full flex justify-center pb-4'>
            <div className='text-center text-3xl lg:text-5xl text-white bg-cyan-600 flex-1 ml-1'>
              Sales <br /> Portal
            </div>
            {groups?.map((g, i) => (
              <div key={i} className="relative text-center flex-1 ml-1">
                <Image
                  src="https://res.cloudinary.com/dduiqwdtr/image/upload/v1723184590/Hexerve%20website%20assets/trianglePink.png"
                  alt="Triangle Pink"
                  width={350}
                  height={100}
                  priority
                  className="w-full"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-md lg:text-lg">
                  <span className="relative">$ {g.totalPrice} Per Month </span>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto w-full flex flex-col items-center">
            {products?.map((p, inx) => (
              <React.Fragment key={JSON.stringify(p)}>
                <div className="w-full flex justify-center mt-4 pb-4">
                  <div className="text-center text-xl lg:text-2xl bg-cyan-600 text-white p-3 flex items-center justify-center flex-1 ml-1">
                    {p.category}
                  </div>
                  {sortByFeatureCount(p.products).map((pro) => (
                    <div
                      key={JSON.stringify(pro.name)}
                      className="text-center text-xl lg:text-2xl bg-cyan-600 text-white p-3 flex items-center justify-center flex-1 ml-1"
                    >
                      {pro.name}
                    </div>
                  ))}
                </div>
                {"metadata" in p.products[0] && (
                  <div className="w-full flex">
                    <div className="bg-gray-100 h-full flex-1 ml-1">
                      {Object.keys(p.products[0]?.metadata).map((i) => (
                        <div
                          key={i}
                          className="text-center text-sm lg:text-lg font-semibold px-3 py-3 mb-1 border-b-2 border-gray-300 capitalize"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                    {sortByFeatureCount(p.products).map((pro) => (
                      <div
                        key={JSON.stringify(pro)}
                        className="text-xs lg:text-sm bg-gray-100 h-full flex-1 ml-1"
                      >
                        {Object.values(pro.metadata).map((i) => (
                          <div
                            key={i}
                            className="flex justify-center items-center p-3 py-4 mb-1 border-b-2 border-gray-300"
                          >
                            {i}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                <div className="w-full flex justify-center">
                  <div className="bg-gray-100 h-[98%] flex-1 ml-1">
                    {selectedFeatures[inx]?.features.map((i) => (
                      <div
                        key={i}
                        className="text-center text-sm lg:text-lg font-semibold px-3 py-4  border-b-2 border-gray-300 capitalize"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  {sortByFeatureCount(p.products).map((pro) => (
                    <div
                      key={JSON.stringify(pro)}
                      className="text-xs lg:text-sm bg-gray-100 h-[98%] flex-1 ml-1"
                    >
                      {selectedFeatures[inx]?.features.map((i) => (
                        <div
                          key={i}
                          className="flex justify-center items-center p-3  border-b-2 border-gray-300"
                        >
                          {pro.features.includes(i) ? (
                            <div className="text-green-500 text-xl lg:text-2xl">
                              ✔️
                            </div>
                          ) : (
                            <div className="text-red-500 text-xl lg:text-2xl">
                              ❌
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="w-full flex justify-center mt-4">
            <div className="text-center text-2xl lg:text-4xl bg-cyan-600 text-white p-3 font-bold leading-snug flex-1">
              <p>Expected</p>
              <p>Results</p>
            </div>
            {groups?.map((g) => (
              <div
                key={g.group}
                className="text-center text-sm lg:text-lg bg-cyan-600 text-white p-3 flex-1"
              >
                <p className="mb-4">{g.expectedOutput}</p>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center mt-1">
            <div className="flex justify-center bg-cyan-600 p-7 flex-1"></div>
            {groups?.map((g) => (
              <div
                key={g.group}
                className="flex justify-center bg-cyan-600 p-2 flex-1"
              >
                <button
                  onClick={() => checkOutHandler(g.prices)}
                  className="bg-pink-600 text-white text-sm lg:text-lg px-8 py-2 rounded focus:bg-pink-700"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modified;
