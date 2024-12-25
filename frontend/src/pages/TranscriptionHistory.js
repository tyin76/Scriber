import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, Stack, Typography, Paper, Container, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

function TranscriptionHistory() {
  const location = useLocation();
  const [history, setHistory] = useState(location.state?.history || []);

  if (!history || history.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
              }}
            >
              Go Home
            </Button>
          </Link>
          <Typography variant="h5" color="textSecondary">
            No History Found
          </Typography>
        </Box>
      </Container>
    );
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:5001/DeleteTranscriptionHistory/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.statusText}`);
      }
      if (response.ok) {
        setHistory((prevHistory) => prevHistory.filter((entry) => entry._id !== id))
        console.log("DELETION SUCCESSFUL")
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 3,
              textTransform: 'none',
            }}
          >
            Go Home
          </Button>
        </Link>
      </Box>

      <Stack spacing={3}>
        {history.map((item, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#f9f9f9',
              position: 'relative', 
            }}
          >
            <IconButton
              onClick={() => handleDelete(item._id)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: '#d32f2f', 
              }}
              aria-label="delete transcription"
            >
              <DeleteIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {index + 1}. <br />
              Video URL:
            </Typography>
            <Typography
              variant="body1"
              sx={{ wordBreak: 'break-word', color: '#1976d2' }}
            >
              {JSON.stringify(item.videoURL)}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', mt: 2 }}
            >
              Transcript:
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                <Typography component="span">Click to See Full Transcript</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: 'break-word',
                    color: '#424242',
                  }}
                >
                  {JSON.stringify(item.transcript)}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}

export default TranscriptionHistory;
