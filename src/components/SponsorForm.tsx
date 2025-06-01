import React, { useState, useEffect } from "react";
import { Item, Sponsorship } from "../types";

interface Props {
  items: Item[];
  sponsorships: Sponsorship[];
  onSponsor: (sponsorship: Omit<Sponsorship, "id">) => void;
  onThank: (name: string) => void;
}

const SponsorForm: React.FC<Props> = ({ items, sponsorships, onSponsor, onThank }) => {
  const [itemId, setItemId] = useState<string>("");
  const [sponsorName, setSponsorName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [full, setFull] = useState<boolean>(false);

  const getRemaining = (id: string) => {
    const item = items.find((i) => i.id === Number(id));
    if (!item) return 0;
    const totalSponsored = sponsorships
      .filter((s) => s.itemId === item.id)
      .reduce((sum, s) => sum + s.amount, 0);
    return Math.max(0, item.price - totalSponsored);
  };

  useEffect(() => {
    if (full && itemId) {
      setAmount(getRemaining(itemId).toFixed(2));
    } else if (!full) {
      setAmount("");
    }
    // eslint-disable-next-line
  }, [full, itemId]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (!itemId || !sponsorName || !amount) return;
        const remaining = getRemaining(itemId);
        const amt = parseFloat(amount);
        if (amt <= 0 || amt > remaining) return;
        onSponsor({
          itemId: Number(itemId),
          sponsorName,
          amount: amt,
        });
        onThank(sponsorName);
        setSponsorName("");
        setAmount("");
        setItemId("");
        setFull(false);
      }}
      className="bg-white p-6 rounded-xl shadow-lg border border-teal-200 animate-fade-in"
    >
      <h2 className="text-xl font-bold mb-3 text-teal-700">Sponsor an Item</h2>
      <div className="relative mb-3">
        <select
          className="appearance-none border border-teal-400 p-3 rounded-lg w-full focus:ring-2 focus:ring-teal-300 transition pr-10"
          value={itemId}
          onChange={e => {
            setItemId(e.target.value);
            setFull(false);
          }}
        >
          <option value="">Select item</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} (Remaining: ${getRemaining(String(item.id)).toFixed(2)})
            </option>
          ))}
        </select>
        {/* Custom arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
      <input
        className="border border-teal-400 p-3 rounded-lg w-full mb-3 focus:ring-2 focus:ring-teal-300 transition"
        placeholder="Your name"
        value={sponsorName}
        onChange={e => setSponsorName(e.target.value)}
      />
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          checked={full}
          disabled={!itemId}
          onChange={() => setFull(v => !v)}
          className="mr-2 accent-teal-600"
          id="full-amount"
        />
        <label htmlFor="full-amount" className="text-teal-700 cursor-pointer">
          Sponsor full remaining amount
        </label>
      </div>
      <input
        className={`border border-teal-400 p-3 rounded-lg w-full mb-3 focus:ring-2 focus:ring-teal-300 transition ${full ? "bg-gray-100 text-gray-400" : ""}`}
        placeholder="Amount to sponsor"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        disabled={full || !itemId}
        max={itemId ? getRemaining(itemId) : undefined}
      />
      <button
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg w-full shadow transition"
        disabled={
          !itemId ||
          !sponsorName ||
          !amount ||
          parseFloat(amount) <= 0 ||
          parseFloat(amount) > getRemaining(itemId)
        }
      >
        Sponsor
      </button>
    </form>
  );
};

export default SponsorForm;
