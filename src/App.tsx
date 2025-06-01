import React, { useState } from "react";
import ItemForm from "./components/ItemForm";
import SponsorForm from "./components/SponsorForm";
import Dashboard from "./components/Dashboard";
import PasscodeGate from "./components/PasscodeGate";
import ThankYouFlyout from "./components/ThankYouFlyout";
import { Item, Sponsorship, UserRole } from "./types";

// Dummy admin data
const ADMINS = [
  {
    username: "alice",
    password: "alicepass",
    passcode: "alicecode",
    displayName: "Alice",
  },
  {
    username: "bob",
    password: "bobpass",
    passcode: "bobcode",
    displayName: "Bob",
  }
];

interface AdminData {
  items: Item[];
  sponsorships: Sponsorship[];
}

const initialAdminData: Record<string, AdminData> = {
  alice: { items: [], sponsorships: [] },
  bob: { items: [], sponsorships: [] },
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [currentAdmin, setCurrentAdmin] = useState<string | null>(null); // username
  const [adminData, setAdminData] = useState<Record<string, AdminData>>(initialAdminData);
  const [thankName, setThankName] = useState<string | null>(null);

  // Add item for current admin
  const addItem = (item: Omit<Item, "id">) => {
    if (!currentAdmin) return;
    setAdminData(prev => ({
      ...prev,
      [currentAdmin]: {
        ...prev[currentAdmin],
        items: [...prev[currentAdmin].items, { ...item, id: Date.now() }]
      }
    }));
  };

  // Add sponsorship for current admin
  const addSponsorship = (sponsorship: Omit<Sponsorship, "id">) => {
    if (!currentAdmin) return;
    setAdminData(prev => ({
      ...prev,
      [currentAdmin]: {
        ...prev[currentAdmin],
        sponsorships: [
          ...prev[currentAdmin].sponsorships,
          { ...sponsorship, id: Date.now() }
        ]
      }
    }));
  };

  // Edit item for current admin
  const editItem = (edited: Item) => {
    if (!currentAdmin) return;
    setAdminData(prev => ({
      ...prev,
      [currentAdmin]: {
        ...prev[currentAdmin],
        items: prev[currentAdmin].items.map(i =>
          i.id === edited.id ? edited : i
        ),
      },
    }));
  };

  // Edit sponsorship for current admin
  const editSponsorship = (edited: Sponsorship) => {
    if (!currentAdmin) return;
    setAdminData(prev => ({
      ...prev,
      [currentAdmin]: {
        ...prev[currentAdmin],
        sponsorships: prev[currentAdmin].sponsorships.map(s =>
          s.id === edited.id ? edited : s
        ),
      },
    }));
  };

  // Handle login
  if (!role || !currentAdmin) {
    return (
      <PasscodeGate
        admins={ADMINS}
        onUser={passcode => {
          const admin = ADMINS.find(a => a.passcode === passcode);
          if (admin) {
            setRole("user");
            setCurrentAdmin(admin.username);
            return true;
          }
          return false;
        }}
        onAdmin={(username, password) => {
          const admin = ADMINS.find(a => a.username === username && a.password === password);
          if (admin) {
            setRole("admin");
            setCurrentAdmin(admin.username);
            return true;
          }
          return false;
        }}
      />
    );
  }

  // Get current admin's display name
  const adminDisplayName =
    ADMINS.find(a => a.username === currentAdmin)?.displayName || currentAdmin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-300 p-4 transition-colors duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-teal-700 tracking-tight drop-shadow-lg animate-fade-in">
            {adminDisplayName}'s SponsorApp
          </h1>
          <button
            className="text-teal-700 bg-white border border-teal-400 px-3 py-1 rounded-lg shadow hover:bg-teal-100 transition"
            onClick={() => {
              setRole(null);
              setCurrentAdmin(null);
            }}
          >
            Logout
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {role === "admin" && (
              <div className="animate-slide-in-up">
                <ItemForm onAdd={addItem} />
              </div>
            )}
            <div className="animate-slide-in-up delay-150">
              <SponsorForm
                items={adminData[currentAdmin].items}
                sponsorships={adminData[currentAdmin].sponsorships}
                onSponsor={addSponsorship}
                onThank={setThankName}
              />
            </div>
          </div>
          <div className="animate-slide-in-up delay-300">
            <Dashboard
              items={adminData[currentAdmin].items}
              sponsorships={adminData[currentAdmin].sponsorships}
              isAdmin={role === "admin"}
              onEditItem={editItem}
              onEditSponsorship={editSponsorship}
            />
          </div>
        </div>
      </div>
      {thankName && (
        <ThankYouFlyout name={thankName} onClose={() => setThankName(null)} />
      )}
    </div>
  );
};

export default App;
