import React from 'react';
import { auth, signOut } from '../auth/firebaseConfig';
import { Button } from '@mui/material';

const LogoutButton = ({ setUser }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <Button variant="outlined" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
