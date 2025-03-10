import React from 'react';

interface Props {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const InputWrapper: React.FC<Props> = ({ label, error, children }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-300 font-medium">{label}</label>
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputWrapper;
