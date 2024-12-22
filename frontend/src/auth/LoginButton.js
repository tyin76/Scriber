import React from 'react';
import { auth, provider, signInWithPopup } from '../auth/firebaseConfig';
import { Button } from '@mui/material';

const LoginButton = ({ setUser }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({
        name: user.displayName,
        email: user.email
      });
      console.log(typeof user.name);
      console.log(typeof user.email);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div>
      <Button variant='outlined' onClick={handleLogin}>Login with Google</Button>
    </div>
  );
};

export default LoginButton;
