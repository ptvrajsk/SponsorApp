import React, { useRef, useEffect, useState } from "react";
import { decrypt } from "../crypto"; // Adjust path as needed

interface Admin {
  id: string;
  username: string;
  password: string; // encrypted
  passcode: string; // encrypted
  displayName: string;
}

interface Props {
  admins: Admin[];
  onUser: (code: string) => boolean;
  onAdmin: (username: string, password: string) => boolean;
}

const PasscodeGate: React.FC<Props> = ({ admins, onUser, onAdmin }) => {
  const [tab, setTab] = useState<"user" | "admin">("user");
  const [passcode, setPasscode] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [tab]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-teal-100 via-white to-teal-200 transition-colors duration-700">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xs animate-fade-in">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-l-xl font-bold transition-colors ${
              tab === "user"
                ? "bg-teal-600 text-white"
                : "bg-teal-100 text-teal-700 hover:bg-teal-200"
            }`}
            onClick={() => {
              setTab("user");
              setError("");
            }}
            type="button"
          >
            User
          </button>
          <button
            className={`flex-1 py-2 rounded-r-xl font-bold transition-colors ${
              tab === "admin"
                ? "bg-teal-600 text-white"
                : "bg-teal-100 text-teal-700 hover:bg-teal-200"
            }`}
            onClick={() => {
              setTab("admin");
              setError("");
            }}
            type="button"
          >
            Admin
          </button>
        </div>
        <div
          className={`transition-all duration-500 ${
            tab === "admin" ? "animate-slide-in-up" : "animate-slide-in-down"
          }`}
        >
          {tab === "user" ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (onUser(passcode)) {
                  setError("");
                } else {
                  setError("Incorrect passcode.");
                }
              }}
              className="space-y-4"
            >
              <input
                ref={inputRef}
                type="password"
                className="border border-teal-400 p-3 w-full rounded-lg focus:ring-2 focus:ring-teal-300 transition"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Passcode"
                autoFocus
              />
              {error && <div className="text-red-500">{error}</div>}
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg w-full shadow transition"
                type="submit"
              >
                Enter
              </button>
            </form>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (onAdmin(adminUser, adminPass)) {
                  setError("");
                } else {
                  setError("Invalid admin credentials.");
                }
              }}
              className="space-y-4"
            >
              <input
                ref={inputRef}
                type="text"
                className="border border-teal-400 p-3 w-full rounded-lg focus:ring-2 focus:ring-teal-300 transition"
                value={adminUser}
                onChange={e => setAdminUser(e.target.value)}
                placeholder="Admin Username"
                autoFocus
              />
              <input
                type="password"
                className="border border-teal-400 p-3 w-full rounded-lg focus:ring-2 focus:ring-teal-300 transition"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                placeholder="Admin Password"
              />
              {error && <div className="text-red-500">{error}</div>}
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg w-full shadow transition"
                type="submit"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasscodeGate;
