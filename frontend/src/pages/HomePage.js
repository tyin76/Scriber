import { Button, Typography, Box, TextField, Container, Paper, Stack, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import LoginButton from '../auth/LoginButton';
import LogoutButton from '../auth/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { auth } from '../auth/firebaseConfig';
import BluePen from '../images/BluePen.svg'
import BlackPen from '../images/BlackPen.svg'
import WhitePen from '../images/WhitePen.svg'

function HomePage() {
    const [input, setInput] = useState('');
    const [displayedTranscript, setDisplayedTranscript] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
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

    useEffect(() => {
        document.body.style.backgroundColor = '#141414';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        if (user) {
            userEmail = user.email;
        }

        try {
            //'http://localhost:5001/api/submit-link'
            const response = await fetch('https://scriber-production.up.railway.app/api/submit-link', {
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
            if (!response.ok) {
                setErrorMsg(true);
            }
            if (response.ok) {
                setErrorMsg(false);
            }
            setDisplayedTranscript(data.transcript);
            setInput('');
        } catch (error) {
            console.log(error);
            setErrorMsg(true);
        } finally {
            setLoading(false); 
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    async function handleTranscriptionHistory(e) {
        try {
            //`http://localhost:5001/api/getTranscriptionHistory/${encodeURIComponent(user.email)}`
            const response = await fetch(`https://scriber-production.up.railway.app/api/getTranscriptionHistory/${encodeURIComponent(user.email)}`, {
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
        <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, backgroundColor: '#333333', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <img src={WhitePen} alt="Blue Pen" style={{ maxHeight: '40px', marginRight: '10px' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Scriber
                </Typography>
            </Box>

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
                    label="Paste Youtube Video URL"
                    variant="outlined"
                    fullWidth
                    value={input}
                    onChange={handleInputChange}
                    sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: 2,
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{
                        width: '100%',
                        borderRadius: 3,
                        textTransform: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'black'
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Transcribe Video'}
                </Button>
            </Box>

            <Box>
                {errorMsg && <Typography variant="body1" align="center" color="error" sx={{ mt: 2 }}> Invalid Youtube Link, please submit a valid Youtube Link </Typography>}
            </Box>

            <Box sx={{ mt: 4 }}>
                {!user ? (
                    <Stack spacing={2} alignItems="center">
                        <LoginButton setUser={setUser} />
                        <Typography variant="body1" align="center" color="white">
                            Log in for features like transcription history, quiz generation, and pdf downloads!
                        </Typography>
                    </Stack>
                ) : (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', fontFamily: 'Marker' }}>
                            Welcome, {user.name}!
                        </Typography>
                        <br />
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
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        color: 'black',
                        borderColor: 'black'
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
                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#424242' }}>
                        Transcript:
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.6 }}>
                        {displayedTranscript}
                    </Typography>
                </Box>
            )}
        </Paper>
    </Container>
    );
}

export default HomePage;
