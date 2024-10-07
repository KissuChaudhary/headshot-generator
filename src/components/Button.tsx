import React from 'react';

const Button: React.FC<{ label: string }> = ({ label }) => {
  return (
    <button className="bg-blue-500 text-white py-2 px-4 rounded">
      {label}
    </button>
  );
};

export default Button;
