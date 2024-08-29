"use client";
import React, { useMemo, useState } from "react";
import { Header } from "./Header";
import toast, { Toaster } from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";

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
          quantity: 1,
        })),
    [packages]
  );
  const [rows, setRows] = useState([products[0]]);

  const quantityOptions = [1, 2, 3, 4, 5];

  const handleAddRow = () => {
    setRows([...rows, products[0]]);
    toast.success("Package added successfully!", {
      position: "top center",
    });
  };

  const handleProductChange = (index, newProductName) => {
    const updatedRows = [...rows];
    updatedRows[index] = products.find((p) => p.id == newProductName);
    setRows(updatedRows);
  };

  const priceChange = (id, value) => {
    setRows(
      rows.map((p) =>
        p.id == id ? { ...p, price: value == "" ? 0 : parseInt(value) } : p
      )
    );
  };

  const handleQtyChange = (index, newQty) => {
    const updatedRows = [...rows];
    updatedRows[index].quantity = parseInt(newQty);
    setRows(updatedRows);
  };

  const handleRemove = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    toast.success("package deleted successfully!", {
      position: "top center",
    });
  };

  const generateInvoice = async () => {
    if (!name || !email) {
      toast.error("Please fill in both name and email", {
        position: "top center",
      });
      return;
    }

    let res = await fetch("/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        products: rows,
      }),
    });
    res = await res.json();
    if (!res.error) {
      toast.success("Invoice sent successfully!", {
        position: "top center",
      });
      setRows([]);
      setName("");
      setEmail("");
    } else {
      toast.error("Failed to send invoice. Please try again.", {
        position: "top center",
      });
    }
  };

  return (
    <>
      <Toaster />
      <div className="absolute w-full">
        <Header />
      </div>
      <div className="invoice-container w-full h-[100vh] flex items-center justify-center bg-[url('https://res.cloudinary.com/dduiqwdtr/image/upload/v1723017827/Hexerve%20website%20assets/w2wumqgvwfuc3evxzefw.jpg')] bg-cover">
        <div className=" lg:w-[80%] h-[80%] bg-gradient-to-r from-pink-600  to-cyan-600 p-1">
          <div className=" bg-white h-full">
            <div className="flex items-center justify-center w-full lg:text-4xl bg-cyan-600 text-white py-2 ">
              <h1>Invoice</h1>
            </div>
            <div className="flex items-center justify-start p-2 py-6">
              <label className="text-2xl px-3" htmlFor="name">
                Client's Name:
              </label>
              <input
                className="border-2 border-cyan-600 text-2xl px-2"
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
            <div className="flex items-start justify-center w-full lg:text-4xl py-2 bg-cyan-600 text-white">
              <h1>Product List</h1>
            </div>
            <div className="">
              <div className="flex justify-between flex-col h-[36vh] overflow-y-scroll">
                <table className="w-full mt-2 border-separate border-spacing-2">
                  <thead>
                    <tr className="">
                      <th className="border-2 border-pink-600 text-2xl py-2">
                        Sno.
                      </th>
                      <th className="border-2 border-pink-600 text-2xl py-2">
                        Product Name
                      </th>
                      <th className="border-2 border-pink-600 text-2xl py-2">
                        Price
                      </th>
                      <th className="border-2 border-pink-600 text-2xl py-2">
                        Qty
                      </th>
                      <th className="border-2 border-pink-600 text-2xl py-2">
                        Remove item
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={row.id}>
                        <td className="border-2 border-pink-600 text-center p-2 text-2xl">
                          {index + 1}.
                        </td>
                        <td className="border-2 border-pink-600 text-center p-2 text-2xl">
                          <select
                            className="text-xl p-1"
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
                        <td className="border-2 border-pink-600 text-center p-2 text-2xl w-[15%]">
                          <div className="flex items-center">
                            <span className="">$</span>
                            <input
                              onChange={(e) =>
                                priceChange(row.id, e.target.value)
                              }
                              value={row.price}
                              className="w-[50%]"
                            />
                          </div>
                        </td>
                        <td className="border-2 border-pink-600 text-center p-2 text-2xl">
                          <select
                            className="text-xl p-1"
                            value={row.qty}
                            onChange={(e) =>
                              handleQtyChange(index, e.target.value)
                            }
                          >
                            {quantityOptions.map((qty, idx) => (
                              <option key={idx} value={qty}>
                                {qty}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border-2 border-pink-600 text-center p-2 text-2xl">
                          <button
                            className="px-5"
                            onClick={() => handleRemove(index)}
                          >
                            <RiDeleteBin6Line className="text-cyan-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full flex justify-center mt-3">
                <button
                  className=" border-none px-5 rounded-lg bg-cyan-600 py-1 text-white mr-2 text-center text-2xl"
                  onClick={handleAddRow}
                >
                  Add Package
                </button>
              </div>
              <div className="w-full flex justify-center mt-3">
                <button
                  onClick={generateInvoice}
                  className=" border-none px-5 rounded-lg bg-cyan-600 py-1 text-white mr-2 text-center text-2xl"
                >
                  Send Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
