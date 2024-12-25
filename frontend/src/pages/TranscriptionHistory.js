import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, Stack, Typography, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function TranscriptionHistory() {
  const location = useLocation();
  const history = location.state?.history;

  console.log(history);
  console.log(typeof history);

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
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {index + 1}. <br></br>
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
            <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}>
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
