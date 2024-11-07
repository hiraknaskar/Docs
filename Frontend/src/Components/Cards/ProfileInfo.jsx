import React, { useState } from 'react';
import { getInitials } from '../../utils/helper';
import { MdClose } from 'react-icons/md';

const ProfileInfo = ({ UserInfo, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 cursor-pointer" onClick={toggleMenu}>
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {getInitials(UserInfo ? UserInfo.fullName : '')}
        </div>
      </div>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-700 text-white rounded-lg shadow-lg p-4">
          <div className="flex justify-end mb-2">
            <button
              className="p-1 rounded-full bg-slate-600 text-white hover:bg-green-600"
              onClick={() => setShowMenu(false)}
            >
              <MdClose size={16} />
            </button>
          </div>
          <div className="mb-2 p-2 bg-zinc-600 rounded text-center font-medium">
            {UserInfo ? UserInfo.fullName : 'Guest'}
          </div>
          <button
            className="w-full flex justify-between items-center text-left text-sm font-medium p-2 rounded bg-zinc-600 hover:bg-red-600"
            onClick={onLogout}
          >
            <span>Logout</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
