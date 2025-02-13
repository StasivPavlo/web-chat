import React from "react";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string
}

const Modal: React.FC<Props> = ({ children, isOpen, onClose, className }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-lg ${className}`}>
        { onClose && (
          <button className="absolute top-2 right-2 text-white" onClick={onClose}>&times;</button>
        )}
        {children}
      </div>
    </div>
  );
};

export const ModalHeader = ({children}: { children: React.ReactNode }) => {
  return <div className="mb-4 text-lg font-semibold text-white">{children}</div>;
};

export const ModalTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-xl font-bold text-white">{children}</h2>;
};

export const ModalContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default Modal;
