"use client"
import React, { useState, useEffect } from "react"

const useResponsiveBackground = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)") // Tailwind's sm breakpoint

    const handleMediaQueryChange = event => {
      setIsSmallScreen(event.matches)
    }

    // Set initial value
    setIsSmallScreen(mediaQuery.matches)

    // Listen for changes
    mediaQuery.addEventListener("change", handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
    }
  }, [])

  return isSmallScreen
}

const LoginComponent = () => {
  const isSmallScreen = useResponsiveBackground()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = event => {
    event.preventDefault()
    // Add login logic here
    console.log("Email:", email)
    console.log("Password:", password)
  }

  return (
    <div
      className="flex h-screen justify-center items-center"
      style={{
        backgroundImage: isSmallScreen
          ? "url(https://res.cloudinary.com/dduiqwdtr/image/upload/v1723017958/Hexerve%20website%20assets/zgrhyym7m4lzazgpq0wk.jpg)"
          : "url(https://res.cloudinary.com/dduiqwdtr/image/upload/v1723017827/Hexerve%20website%20assets/w2wumqgvwfuc3evxzefw.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="flex flex-col md:flex-row h-full w-full md:h-3/4 md:w-3/4 shadow-lg bg-white rounded-lg overflow-hidden">
        <div
          className={`flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative ${
            isSmallScreen ? "bg-cover bg-center text-white" : ""
          }`}
          style={{
            backgroundImage: isSmallScreen
              ? "url(https://res.cloudinary.com/dduiqwdtr/image/upload/v1723017958/Hexerve%20website%20assets/zgrhyym7m4lzazgpq0wk.jpg)"
              : "none"
          }}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 md:mb-6 ${
              isSmallScreen ? "text-white" : "text-cyan-600"
            }`}
          >
            Log in
          </h2>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xs md:max-w-md relative"
          >
            <label
              htmlFor="email"
              className={`block mb-2 font-bold ${
                isSmallScreen ? "text-white" : "text-cyan-600"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className="w-full p-2 md:p-3 mb-4 md:mb-6 border border-cyan-600 rounded text-black"
            />
            <label
              htmlFor="password"
              className={`block mb-2 font-bold ${
                isSmallScreen ? "text-white" : "text-cyan-600"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your Password"
              className="w-full p-2 md:p-3 mb-4 md:mb-6 border border-cyan-600 rounded text-black"
            />
            <div
              className={`flex items-center mb-4 md:mb-6 font-bold ${
                isSmallScreen ? "text-white" : "text-cyan-600"
              }`}
            >
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember">Remember me?</label>
            </div>
            <button
              type="submit"
              className={`w-full p-2 md:p-3 mb-4 md:mb-6 border border-cyan-600 bg-white rounded font-bold ${
                isSmallScreen ? "text-black" : "text-cyan-600"
              }`}
            >
              Log in
            </button>
            <a
              href="#"
              className={`block mt-2 md:mt-4 text-center ${
                isSmallScreen ? "text-white" : "text-pink-500"
              }`}
            >
              Forgot Password?
            </a>
          </form>
          {isSmallScreen && (
            <div className="absolute top-0 left-0 m-4">
              <img
                src="https://res.cloudinary.com/dduiqwdtr/image/upload/f_auto,q_auto/v1/Hexerve%20website%20assets/iqopb1mzpupllfhijzvq"
                alt="Logo"
                className="h-12"
              />
            </div>
          )}
        </div>
        <div
          className="flex-1 lg:flex justify-center items-center relative hidden md:flex"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dduiqwdtr/image/upload/v1723017958/Hexerve%20website%20assets/zgrhyym7m4lzazgpq0wk.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black opacity-0"></div>
          <div className="absolute top-0 left-0 m-4">
            <img
              src="https://res.cloudinary.com/dduiqwdtr/image/upload/f_auto,q_auto/v1/Hexerve%20website%20assets/iqopb1mzpupllfhijzvq"
              alt="Logo"
              className="h-12 md:h-16"
            />
          </div>
          <div className="relative z-10">
            <h1 className="text-white text-5xl md:text-7xl font-bold text-center">
              AI-Driven IT Solutions
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginComponent