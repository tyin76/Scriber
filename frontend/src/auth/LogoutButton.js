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
    <Button
        variant="outlined"
        onClick={handleLogout}
        sx={{
          color: '#F88379', 
          backgroundColor: 'white', 
          border: '2px solid #F88379', 
          fontWeight: 'bold', 
          textTransform: 'none',
          borderRadius: 3, 
          px: 3, 
          py: 1, 
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
          '&:hover': {
            backgroundColor: '#36454F', 
            color: 'white', 
            border: '2px solid #F88379',
          },
        }}
      >
        Logout
  </Button>
  );
};

export default LogoutButton;
