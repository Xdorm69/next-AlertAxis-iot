"use client";
import React from "react";
import { motion } from "framer-motion";

const RotatingStar = () => {
  return (
    <motion.span
    className=""
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      ⭐
    </motion.span>
  );
};

export default RotatingStar;
