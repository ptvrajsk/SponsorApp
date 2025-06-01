import React, { useState } from "react";
import { Item, Sponsorship } from "../types";
import ProgressBar from "./ProgressBar";

interface Props {
  items: Item[];
  sponsorships: Sponsorship[];
  isAdmin: boolean;
  onEditItem?: (item: Item) => void;
  onEditSponsorship?: (sponsorship: Sponsorship) => void;
}

const Dashboard: React.FC<Props> = ({
  items,
  sponsorships,
  isAdmin,
  onEditItem,
  onEditSponsorship,
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingSponsorshipId, setEditingSponsorshipId] = useState<number | null>(null);

  // Edit form state as strings for controlled inputs
  const [editItemForm, setEditItemForm] = useState<{
    name: string;
    price: string;
    imageUrl: string;
  }>({ name: "", price: "", imageUrl: "" });

  const [editSponsorshipForm, setEditSponsorshipForm] = useState<{
    sponsorName: string;
    amount: string;
  }>({ sponsorName: "", amount: "" });

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
        <h2 className="text-2xl font-bold mb-4 text-teal-700">Dashboard</h2>
        {items.length === 0 ? (
          <div className="text-gray-500">No items added yet.</div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => {
              const itemSponsorships = sponsorships.filter(
                (s) => s.itemId === item.id
              );
              const totalSponsored = itemSponsorships.reduce(
                (sum, s) => sum + s.amount,
                0
              );
              const percent = (totalSponsored / item.price) * 100;
              const fullySponsored = percent >= 100;
              const isEditing = editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border-2 shadow transition-all duration-500 bg-white overflow-hidden ${
                    fullySponsored ? "border-teal-600 bg-teal-50" : "border-gray-200"
                  }`}
                  style={{ minWidth: 0 }}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 w-full min-w-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-teal-100 cursor-pointer hover:scale-105 hover:shadow-lg transition"
                        onClick={() => setModalImage(item.imageUrl!)}
                      />
                    )}
                    <div className="flex-1 w-full min-w-0">
                      {/* Edit Form or Display */}
                      {isAdmin && isEditing ? (
                        <form
                          className="mb-2 p-3 bg-teal-50 rounded-lg shadow-inner animate-fade-in flex flex-col gap-2 w-full min-w-0"
                          onSubmit={e => {
                            e.preventDefault();
                            if (
                              editItemForm.name &&
                              editItemForm.price &&
                              onEditItem
                            ) {
                              onEditItem({
                                ...item,
                                name: editItemForm.name,
                                price: Number(editItemForm.price),
                                imageUrl: editItemForm.imageUrl,
                              });
                              setEditingItemId(null);
                            }
                          }}
                        >
                          <input
                            className="border border-teal-400 p-1 rounded w-full"
                            value={editItemForm.name}
                            onChange={e =>
                              setEditItemForm({
                                ...editItemForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="Item name"
                          />
                          <input
                            type="number"
                            className="border border-teal-400 p-1 rounded w-full"
                            value={editItemForm.price}
                            onChange={e =>
                              setEditItemForm({
                                ...editItemForm,
                                price: e.target.value,
                              })
                            }
                            placeholder="Price"
                          />
                          <input
                            type="url"
                            className="border border-teal-400 p-1 rounded w-full"
                            value={editItemForm.imageUrl}
                            onChange={e =>
                              setEditItemForm({
                                ...editItemForm,
                                imageUrl: e.target.value,
                              })
                            }
                            placeholder="Image URL"
                          />
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <button
                              type="submit"
                              className="bg-teal-600 text-white rounded px-2 py-1"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="bg-gray-200 rounded px-2 py-1"
                              onClick={() => setEditingItemId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <span className="font-semibold text-lg text-teal-800 block truncate">
                            {item.name}
                          </span>
                          <span className="font-mono text-teal-700 block mb-1 whitespace-nowrap">
                            ${totalSponsored.toFixed(2)} / ${item.price.toFixed(2)}
                          </span>
                          {isAdmin && (
                            <button
                              className="text-xs text-teal-700 underline mb-2"
                              onClick={() => {
                                setEditingItemId(item.id);
                                setEditItemForm({
                                  name: item.name,
                                  price: String(item.price),
                                  imageUrl: item.imageUrl ?? "",
                                });
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                      <div className="w-full min-w-0">
                        <ProgressBar percent={percent} />
                      </div>
                      {isAdmin && itemSponsorships.length > 0 && (
                        <ul className="ml-4 mt-2 list-disc text-teal-700 animate-fade-in w-full min-w-0">
                          {itemSponsorships.map((s) => {
                            const isEditingS = editingSponsorshipId === s.id;
                            return (
                              <li key={s.id} className="mb-1 w-full min-w-0">
                                {isEditingS ? (
                                  <form
                                    className="inline-flex gap-2 items-center bg-teal-50 p-2 rounded shadow-inner animate-fade-in flex-wrap w-full min-w-0"
                                    onSubmit={e => {
                                      e.preventDefault();
                                      if (
                                        editSponsorshipForm.sponsorName &&
                                        editSponsorshipForm.amount &&
                                        onEditSponsorship
                                      ) {
                                        onEditSponsorship({
                                          ...s,
                                          sponsorName: editSponsorshipForm.sponsorName,
                                          amount: Number(editSponsorshipForm.amount),
                                        });
                                        setEditingSponsorshipId(null);
                                      }
                                    }}
                                  >
                                    <input
                                      className="border border-teal-400 p-1 rounded w-24"
                                      value={editSponsorshipForm.sponsorName}
                                      onChange={e =>
                                        setEditSponsorshipForm({
                                          ...editSponsorshipForm,
                                          sponsorName: e.target.value,
                                        })
                                      }
                                      placeholder="Sponsor name"
                                    />
                                    <input
                                      type="number"
                                      className="border border-teal-400 p-1 rounded w-16"
                                      value={editSponsorshipForm.amount}
                                      onChange={e =>
                                        setEditSponsorshipForm({
                                          ...editSponsorshipForm,
                                          amount: e.target.value,
                                        })
                                      }
                                      placeholder="Amount"
                                    />
                                    <button
                                      type="submit"
                                      className="bg-teal-600 text-white rounded px-2 py-1"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      className="bg-gray-200 rounded px-2 py-1"
                                      onClick={() => setEditingSponsorshipId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </form>
                                ) : (
                                  <>
                                    <span className="font-medium">{s.sponsorName}</span>: $
                                    {s.amount.toFixed(2)}
                                    <button
                                      className="text-xs text-teal-700 underline ml-2"
                                      onClick={() => {
                                        setEditingSponsorshipId(s.id);
                                        setEditSponsorshipForm({
                                          sponsorName: s.sponsorName,
                                          amount: String(s.amount),
                                        });
                                      }}
                                    >
                                      Edit
                                    </button>
                                  </>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      {fullySponsored && (
                        <div className="text-teal-700 font-bold mt-2 animate-bounce">
                          Fully Sponsored!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md animate-fade-in">
          <div className="relative bg-white rounded-xl shadow-xl p-4 animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-teal-500 text-2xl font-bold"
              onClick={() => setModalImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={modalImage}
              alt="Enlarged item"
              className="max-w-[80vw] max-h-[70vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
