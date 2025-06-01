import React from "react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

// ImageModal.tsx
const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center
    bg-black/30
    backdrop-blur-md
    animate-fade-in"
  >
    <div className="relative bg-white rounded-xl shadow-xl p-4 animate-fade-in">
      <button
        className="absolute top-2 right-2 text-gray-700 hover:text-teal-500 text-2xl font-bold"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <img
        src={imageUrl}
        alt="Enlarged item"
        className="max-w-[80vw] max-h-[70vh] rounded-lg shadow-lg"
      />
    </div>
  </div>
);


export default ImageModal;
