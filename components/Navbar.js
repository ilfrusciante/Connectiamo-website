import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      setUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("nickname, role")
          .eq("id", user.id)
          .single();
        if (profileData) setProfile(profileData);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-[#0A1128] text-white px-4 py-3 flex items-center justify-between shadow-md">
      <Link href="/" className="text-xl font-bold text-white">
        Connectiamo
      </Link>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/" className="hover:text-yellow-400 transition">
          Home
        </Link>
        {user && (
          <Link href="/messages" className="hover:text-yellow-400 transition">
            Messaggi
          </Link>
        )}
        {!user && (
          <>
            <Link href="/login" className="hover:text-yellow-400 transition">
              Login
            </Link>
            <Link href="/signup" className="hover:text-yellow-400 transition">
              Registrati
            </Link>
          </>
        )}
        {user && profile && (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 hover:text-yellow-400"
            >
              <UserCircleIcon className="h-7 w-7 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">
                Ciao, {profile.nickname}!
              </span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                {profile.role === "Admin" ? (
                  <Link
                    href="/admin-dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Gestione sito
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Area personale
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden flex items-center space-x-3">
        {user && profile && (
          <div className="relative">
            <button onClick={toggleDropdown} className="flex flex-col items-center">
              <UserCircleIcon className="h-7 w-7 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">
                Ciao, {profile.nickname}!
              </span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                {profile.role === "Admin" ? (
                  <Link
                    href="/admin-dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Gestione sito
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Area personale
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        <button
          onClick={toggleMenu}
          className="focus:outline-none text-white"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0A1128] text-white z-40 shadow-md py-4">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            {user && (
              <Link href="/messages" onClick={() => setMenuOpen(false)}>
                Messaggi
              </Link>
            )}
            {!user && (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  Registrati
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
