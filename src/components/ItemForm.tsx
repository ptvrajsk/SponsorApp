import React, { useRef, useState } from "react";
import { Item } from "../types";

interface Props {
  onAdd: (item: Omit<Item, "id">) => Promise<void>;
}

const ItemForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageFileName, setImageFileName] = useState<string>("");
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageUrl(undefined);
      setImageFileName("");
      return;
    }
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setLoading(true);
    const finalImage = imageUrl || (imageUrlInput.trim() ? imageUrlInput.trim() : undefined);
    await onAdd({ name, price: parseFloat(price), imageUrl: finalImage });
    setName("");
    setPrice("");
    setImageUrl(undefined);
    setImageFileName("");
    setImageUrlInput("");
    setLoading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-teal-200 animate-fade-in"
    >
      <h2 className="text-xl font-bold mb-3 text-teal-700">Add Purchased Item</h2>
      <input
        className="border border-teal-400 p-3 rounded-lg w-full mb-3 focus:ring-2 focus:ring-teal-300 transition"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="border border-teal-400 p-3 rounded-lg w-full mb-3 focus:ring-2 focus:ring-teal-300 transition"
        placeholder="Price"
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <div className="mb-3">
        <label className="block text-teal-700 font-medium mb-1">
          Upload Image
        </label>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            onChange={handleImage}
          />
          {imageFileName && (
            <span className="text-xs text-gray-500">{imageFileName}</span>
          )}
        </div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            className="w-20 h-20 object-cover rounded-lg border border-teal-200 mt-2"
          />
        )}
      </div>

      <div className="mb-3">
        <label className="block text-teal-700 font-medium mb-1">
          Or Image URL
        </label>
        <input
          type="url"
          className="border border-teal-400 p-3 rounded-lg w-full focus:ring-2 focus:ring-teal-300 transition"
          placeholder="https://example.com/image.jpg"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
        />
        {imageUrlInput && !imageUrl && (
          <img
            src={imageUrlInput}
            alt="preview"
            className="w-20 h-20 object-cover rounded-lg border border-teal-200 mt-2"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg w-full shadow transition"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
    </form>
  );
};

export default ItemForm;
