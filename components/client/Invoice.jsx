"use client";
import React, { useState } from "react";

const Invoice = () => {
  const [rows, setRows] = useState([
    { id: 1, name: "Seo Advanced", price: '1225', qty: 1, added: false },
  ]);

  const productOptions = ["Seo Advanced", "Seo Basic", "Seo Pro", "Seo Ultra"];
  const quantityOptions = [1, 2, 3, 4, 5];

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      name: "Seo Advanced",
      price: 1200,
      qty: 1,
      added: false,
    };
    setRows([...rows, newRow]);
  };

  const handleProductChange = (index, newProductName) => {
    const updatedRows = [...rows];
    updatedRows[index].name = newProductName;
    setRows(updatedRows);
  };

  const handleQtyChange = (index, newQty) => {
    const updatedRows = [...rows];
    updatedRows[index].qty = newQty;
    setRows(updatedRows);
  };

  const handleAdd = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].added = true;
    setRows(updatedRows);
  };

  const handleRemove = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <div className="invoice-containe w-full h-full p-12 flex items-center justify-center">
      <div className="border-2 border-red-500 w-[80%] h-full p-1">
        <div className="flex items-center justify-center w-full lg:text-4xl bg-cyan-600 text-white py-1">
          <h1>Invoice</h1>
        </div>
        <div className="flex items-center justify-start p-2 py-6">
          <label className="text-2xl px-3" htmlFor="name">
            Client's Name:
          </label>
          <input
            className="border-2 border-cyan-500 text-2xl px-2"
            type="text"
            id="name"
            name="name"
          />
          <label className="text-2xl px-3" htmlFor="email">
            Client's Email:
          </label>
          <input
            className="border-2 border-cyan-500 text-2xl px-2 w-[40%]"
            type="email"
            id="email"
            name="email"
          />
        </div>
        <div className="flex items-start justify-center w-full lg:text-4xl py-1 bg-cyan-600 text-white">
          <h1>Product List</h1>
        </div>
       <div className="">
       <div className="flex justify-between flex-col">
          <table className=" w-full mt-2 border-separate">
            <thead>
              <tr>
                <th className="border-2 border-red-500 text-2xl">Sno.</th>
                <th className="border-2 border-red-500 text-2xl">Product Name</th>
                <th className="border-2 border-red-500 text-2xl">Price</th>
                <th className="border-2 border-red-500 text-2xl">Qty</th>
                <th className="border-2 border-red-500 text-2xl">Add / Remove</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="border-2 border-red-500 text-center p-2 text-xl">
                    {index + 1}.
                  </td>
                  <td className="border-2 border-red-500 text-center p-2 text-xl">
                    <select
                      className=" text-xl p-1"
                      value={row.name}
                      onChange={(e) =>
                        handleProductChange(index, e.target.value)
                      }
                    >
                      {productOptions.map((product, idx) => (
                        <option key={idx} value={product}>
                          {product}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border-2 border-red-500 text-center p-2 text-xl">
                    ${row.price}
                  </td>
                  <td className="border-2 border-red-500 text-center p-2 text-xl">
                    <select
                      className=" text-xl p-1"
                      value={row.qty}
                      onChange={(e) => handleQtyChange(index, e.target.value)}
                    >
                      {quantityOptions.map((qty, idx) => (
                        <option key={idx} value={qty}>
                          {qty}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border-2 border-red-500 text-center p-2 text-xl">
                    <button
                      className={`border-2 px-5 rounded-lg ${
                        row.added ? "bg-gray-400" : "bg-green-500"
                      } text-white mr-2`}
                      onClick={() => handleAdd(index)}
                      disabled={row.added}
                    >
                      {row.added ? "Added" : "Add"}
                    </button>
                    <button
                      className="border-2 px-5 rounded-lg bg-red-500 text-white"
                      onClick={() => handleRemove(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-center mt-3">
          <button
            className="border-2 px-5 rounded-lg bg-green-500 text-white mr-2 text-center text-2xl"
            onClick={handleAddRow}
          >
            Add Row
          </button>
        </div>
        <div className="w-full flex justify-center mt-3">
          <button className="border-2 px-5 rounded-lg bg-green-500 text-white mr-2 text-center text-2xl">
            Send Payment Link
          </button>
        </div>
       </div>
      </div>
    </div>
  );
};

export default Invoice;
