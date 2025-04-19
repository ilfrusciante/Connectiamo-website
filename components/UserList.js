
// components/UserList.js
import React from "react";
import ProfileCard from "./ProfileCard";

const UserList = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300 mt-10">
        Nessun profilo trovato.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
      {users.map((user) => (
        <ProfileCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
