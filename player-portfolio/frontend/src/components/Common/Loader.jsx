// frontend/src/components/Common/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-8 h-8 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
