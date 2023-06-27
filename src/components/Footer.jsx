import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const containerVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-4  text-black"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <p className="text-sm mb-2">
        Created with ❤️ by{" "}
        <a
          href="https://github.com/savin8305"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
        >
          Akash Vishwakarma
        </a>
      </p>
      <div className="flex items-center justify-center">
        <motion.a
          whileHover={{ scale: 1.1 }}
          className="text-3xl mx-2"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-facebook" />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.1 }}
          className="text-3xl mx-2"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-twitter" />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.1 }}
          className="text-3xl mx-2"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-instagram" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default Footer;
