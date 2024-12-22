
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import LoginButton from '../auth/LoginButton';
import LogoutButton from '../auth/LogoutButton';

function HomePage() {
    const [input, setInput] = useState('');
    const [displayedTranscript, setDisplayedTranscript] = useState('');
    const [user, setUser] = useState(null);
    let userEmail="";

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


</>
    
  )
}

export default HomePage

