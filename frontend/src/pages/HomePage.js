
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import LoginButton from '../auth/LoginButton';
import LogoutButton from '../auth/LogoutButton';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { auth } from '../auth/firebaseConfig';

function HomePage() {
    const [input, setInput] = useState('');
    const [displayedTranscript, setDisplayedTranscript] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    let userEmail="";

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          const token = await currentUser.getIdToken();
          localStorage.setItem('firebaseToken', token);
          setUser({
            name: currentUser.displayName,
            email: currentUser.email,
          });
        } else {
          localStorage.removeItem('firebaseToken');
          setUser(null);
        }
      }
    )
    return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Pressed");

        if (user) {
           userEmail = user.email;
        }

        try {
            const response = await fetch('http://localhost:5001/submit-link', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  input,
                  ...(user ? { userEmail } : {})
                })

            })
            const data = await response.json();
            console.log('from frontend', data.message)
            setDisplayedTranscript(data.transcript);
        setInput('');
        } catch (error) {
            console.log(error);
        }

    }

    const handleInputChange = (e) => {
        setInput(e.target.value);

    }


    async function handleTranscriptionHistory(e) {
      try {
        const response = await fetch (`http://localhost:5001/getTranscriptionHistory/${encodeURIComponent(user.email)}`, {
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        if (!response.ok) {
          throw new Error(`Error ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.history);

        navigate('/transcriptionHistory', { state: { history: data.history } });
      } catch (error) {
        console.log(error);
      }
      
    }


  return (
    <>
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField id="outlined-basic" label="Video URL" variant="outlined" 
                value = {input}
                onChange={handleInputChange}/>

    <Button variant='contained' onClick={handleSubmit}>Transcribe</Button>
    
    </Box>


    <Box>{!user ? (<>
    <LoginButton setUser={setUser}></LoginButton>
    <Typography>Log in for more features like transcription history!</Typography>
    </>): (
    <Box>
    <h1>Welcome {user.name}</h1>
    <p>{user.email}</p>
    <LogoutButton setUser={setUser}></LogoutButton>
    </Box>
  )}
  </Box>

  <Box>{displayedTranscript}</Box>

  
  {user && <Button
        variant="contained"
        onClick={handleTranscriptionHistory}
      >
        See Transcription History
      </Button>
      }

</>
    
  )
}

export default HomePage

