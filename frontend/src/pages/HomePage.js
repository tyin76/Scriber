import { Button, Typography, Box, TextField, Container, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import LoginButton from '../auth/LoginButton';
import LogoutButton from '../auth/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { auth } from '../auth/firebaseConfig';

function HomePage() {
    const [input, setInput] = useState('');
    const [displayedTranscript, setDisplayedTranscript] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    let userEmail = '';

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
      });
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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  input,
                  ...(user ? { userEmail } : {})
                })
            });
            const data = await response.json();
            console.log('from frontend', data.message);
            setDisplayedTranscript(data.transcript);
            setInput('');
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    async function handleTranscriptionHistory(e) {
      try {
        const response = await fetch(`http://localhost:5001/getTranscriptionHistory/${encodeURIComponent(user.email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
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
        <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3, backgroundColor: '#f7f9fc' }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Scriber
                </Typography>

                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        mt: 3,
                    }}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        id="video-url"
                        label="Paste Video URL"
                        variant="outlined"
                        fullWidth
                        value={input}
                        onChange={handleInputChange}
                        sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        sx={{
                            width: '100%',
                            borderRadius: 3,
                            textTransform: 'none',
                        }}
                    >
                        Transcribe Video
                    </Button>
                </Box>

                <Box sx={{ mt: 4 }}>
                    {!user ? (
                        <Stack spacing={2} alignItems="center">
                            <LoginButton setUser={setUser} />
                            <Typography variant="body1" align="center" color="textSecondary">
                                Log in for features like transcription history!
                            </Typography>
                        </Stack>
                    ) : (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Welcome, {user.name}!
                            </Typography>
                            <br></br>
                            <LogoutButton setUser={setUser} />
                        </Box>
                    )}
                </Box>

                {user && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        sx={{
                            mt: 4,
                            width: '100%',
                            borderRadius: 3,
                            textTransform: 'none',
                        }}
                        onClick={handleTranscriptionHistory}
                    >
                        See Transcription History
                    </Button>
                )}

                {displayedTranscript && (
                    <Box
                        sx={{
                            mt: 4,
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            backgroundColor: '#ffffff',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Transcript:
                        </Typography>
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {displayedTranscript}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}

export default HomePage;
