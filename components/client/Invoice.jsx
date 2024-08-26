"use client";
import React, { useMemo, useState } from "react";

const Invoice = ({ packages }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const products = useMemo(
    () =>
      packages
        .map((p) => p.products)
        .flat()
        .map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          quantity: 1
        })),
    [packages]
  );
  const [rows, setRows] = useState([products[0]]);

  const quantityOptions = [1, 2, 3, 4, 5];

  const handleAddRow = () => {
    setRows([...rows, products[0]]);
  };

  const handleProductChange = (index, newProductName) => {
    const updatedRows = [...rows];
    updatedRows[index] = products.find(p => p.id == newProductName)
    setRows(updatedRows);
  };

  const priceChange = (id, value) => {
    setRows(rows.map(p => p.id == id ? {...p, price: parseInt(value)} : p));
  }

  const handleQtyChange = (index, newQty) => {
    const updatedRows = [...rows];
    updatedRows[index].quantity = parseInt(newQty);
    setRows(updatedRows);
  };

  const handleRemove = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const generateInvoice = async () => {
    let res = await fetch("/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        name, email, products: rows
      })
    })
    res = await res.json()
    if(res){
      console.log("res", res)
      alert("invoice sent");
      setRows([]);
      setName('');
      setEmail('')
    }
  }

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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="text-2xl px-3" htmlFor="email">
            Client's Email:
          </label>
          <input
            className="border-2 border-cyan-500 text-2xl px-2 w-[40%]"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                <tr key={row.id}>
                  <td className="border-2 border-red-500 text-center p-2 text-xl">
                    {index + 1}.
                  </td>
                  <td className="border-2 border-red-500 text-center p-2 text-xl">
                    <select
                      className=" text-xl p-1"
                      value={row.id}
                      onChange={(e) =>
                        handleProductChange(index, e.target.value)
                      }
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border-2 border-red-500 text-center p-2 text-xl">
                    <input onChange={(e) => priceChange(row.id, e.target.value)} value={row.price} />
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
          <button onClick={generateInvoice} className="border-2 px-5 rounded-lg bg-green-500 text-white mr-2 text-center text-2xl">
            Send Payment Link
          </button>
        </div>
       </div>
      </div>
    </div>
  );
};

export default Invoice;
