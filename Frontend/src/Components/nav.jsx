import React, { useState } from 'react';
import ProfileInfo from './Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './searchBar/SearchBar';

const Navbar = ({ UserInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Call useNavigate as a function

  const onLogout = () => {
    console.log("Logout function triggered");
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    onSearchNote(searchQuery.trim() || "");
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="relative w-full bg-zinc-800 drop-shadow-md py-2 px-3 flex justify-between items-center z-[5]">
      <h2 className="text-3xl font-semibold text-white py-2">Docs</h2>
       
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => { // Corrected target
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo UserInfo={UserInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
