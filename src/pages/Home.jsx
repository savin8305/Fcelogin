import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <div className="bg-white py-24 md:pt-60 md:pb-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-gray-900">
            Welcome To
          </h1>
          <h1 className="block font-extrabold text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-500 to-indigo-900 text-transparent bg-clip-text">
            React Face Auth
          </h1>
          <p className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            The Facial Recognition-Based Authentication Application is a
            cutting-edge web application developed using React and face-api.js.
            It offers a reliable and efficient authentication system by
            analyzing and verifying the user's facial features.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: '20px' }}
          animate={{ opacity: 1, y: '0' }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <Link
            to={"/user-select"}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-indigo-300 to-indigo-500 text-white font-semibold tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                isHovering ? 'scale-125' : ''
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
            <span className={`${isHovering ? 'opacity-0' : 'opacity-100'} transition-all duration-300`}>Get Started</span>
            <span className={`${isHovering ? 'opacity-100' : 'opacity-0'} transition-all duration-300 absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white text   -indigo-500`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-semibold">Select User</span>
        </span>
      </Link>
    </motion.div>
  </div>
</div>
);
}

export default Home;