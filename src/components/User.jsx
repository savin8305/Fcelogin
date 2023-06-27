import { RadioGroup } from "@headlessui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function User({ user, type }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setTimeout(() => setChecked(false), 1000);
    }
  }, [checked]);

  return (
    <RadioGroup.Option
      key={user.id}
      value={user}
      className={`${
        checked
          ? "bg-gradient-to-r from-purple-500 to-indigo-700 text-white"
          : "bg-white"
      } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none hover:bg-gray-100 transition-all duration-300`}
      onChange={() => setChecked(!checked)}
    >
      <motion.div
        className="flex w-full items-center justify-between"
        whileHover={{ scale: 1.05 }}
      >
        <motion.div className="flex items-center">
          <motion.img
            className="object-cover h-10 w-10 rounded-full"
            src={
              type === "CUSTOM"
                ? user.picture
                : import.meta.env.DEV
                ? `/temp-accounts/${user.picture}`
                : `/react-face-auth/temp-accounts/${user.picture}`
            }
            alt={user.fullName}
            whileHover={{ rotate: 360 }}
          />
          <motion.div
            className={`text-sm flex items-center gap-x-6 font-medium ${
              checked ? "text-white" : "text-gray-900"
            }`}
          >
            {user.fullName}
          </motion.div>
        </motion.div>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <CheckIcon />
          </motion.div>
        )}
      </motion.div>
    </RadioGroup.Option>
  );
}

function CheckIcon() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      whileHover={{ rotate: -360 }}
    >
      <motion.circle cx={12} cy={12} r={12} opacity="0.2" />
      <motion.path d="M7 13l3 3 7-7" />
    </motion.svg>
  );
}

export default User;
