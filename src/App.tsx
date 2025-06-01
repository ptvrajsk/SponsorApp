import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { encrypt, decrypt } from "./crypto";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import ItemForm from "./components/ItemForm";
import SponsorForm from "./components/SponsorForm";
import Dashboard from "./components/Dashboard";
import PasscodeGate from "./components/PasscodeGate";
import ThankYouFlyout from "./components/ThankYouFlyout";
import { Item, Sponsorship, UserRole } from "./types";

interface Admin {
  id: string; // Firestore doc ID
  username: string;
  password: string; // encrypted
  passcode: string; // encrypted
  displayName: string;
}

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [thankName, setThankName] = useState<string | null>(null);

  // Fetch admins on mount
  useEffect(() => {
    getDocs(collection(db, "admins")).then(snapshot => {
      setAdmins(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Admin[]
      );
    });
  }, []);

  // Fetch items and sponsorships for current admin
  useEffect(() => {
    if (!currentAdmin) return;
    const fetchItems = async () => {
      const q = query(collection(db, "items"), where("adminId", "==", currentAdmin.id));
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[]);
    };
    const fetchSponsorships = async () => {
      const q = query(collection(db, "sponsorships"), where("adminId", "==", currentAdmin.id));
      const snapshot = await getDocs(q);
      setSponsorships(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Sponsorship[]);
    };
    fetchItems();
    fetchSponsorships();
  }, [currentAdmin]);

  // Admin login with username/password (encrypted)
  const handleAdminLogin = (username: string, password: string) => {
    const admin = admins.find(a => a.username === username);
    if (admin && decrypt(admin.password) === password) {
      setRole("admin");
      setCurrentAdmin(admin);
      return true;
    }
    return false;
  };

  // User login with passcode (encrypted)
  const handleUserLogin = (passcode: string) => {
    const admin = admins.find(a => decrypt(a.passcode) === passcode);
    if (admin) {
      setRole("user");
      setCurrentAdmin(admin);
      return true;
    }
    return false;
  };

  // Add item (admin only)
  const addItem = async (item: Omit<Item, "id">) => {
    if (!currentAdmin) return;
    const docRef = await addDoc(collection(db, "items"), {
      ...item,
      adminId: currentAdmin.id,
    });
    setItems([...items, { ...item, id: docRef.id }]);
  };

  // Add sponsorship
  const addSponsorship = async (sponsorship: Omit<Sponsorship, "id">) => {
    if (!currentAdmin) return;
    const docRef = await addDoc(collection(db, "sponsorships"), {
      ...sponsorship,
      adminId: currentAdmin.id,
    });
    setSponsorships([...sponsorships, { ...sponsorship, id: docRef.id }]);
  };

  // Edit item
  const editItem = async (edited: Item) => {
    await updateDoc(doc(db, "items", edited.id), edited);
    setItems(items.map(i => (i.id === edited.id ? edited : i)));
  };

  // Edit sponsorship
  const editSponsorship = async (edited: Sponsorship) => {
    await updateDoc(doc(db, "sponsorships", edited.id), edited);
    setSponsorships(sponsorships.map(s => (s.id === edited.id ? edited : s)));
  };

  // You may want to create admins manually in Firestore, but here's how you could add one:
  // (Run this once, then remove or comment out)
  // useEffect(() => {
  //   addDoc(collection(db, "admins"), {
  //     username: "alice",
  //     password: encrypt("alicepass"),
  //     passcode: encrypt("alicecode"),
  //     displayName: "Alice",
  //   });
  // }, []);

  if (!role || !currentAdmin) {
    return (
      <PasscodeGate
        admins={admins}
        onUser={handleUserLogin}
        onAdmin={handleAdminLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-teal-300 p-4 transition-colors duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-teal-700 tracking-tight drop-shadow-lg animate-fade-in">
            {currentAdmin.displayName}'s SponsorApp
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
                items={items}
                sponsorships={sponsorships}
                onSponsor={addSponsorship}
                onThank={setThankName}
              />
            </div>
          </div>
          <div className="animate-slide-in-up delay-300">
            <Dashboard
              items={items}
              sponsorships={sponsorships}
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
