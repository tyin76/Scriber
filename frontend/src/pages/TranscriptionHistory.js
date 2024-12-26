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
import { jsPDF } from 'jspdf';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';

function TranscriptionHistory() {
  const location = useLocation();
  const [history, setHistory] = useState(location.state?.history || []);

  if (!history || history.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
      <Tooltip title="Go to Home Page" arrow>
      <IconButton
        color="primary"
        sx={{
          borderRadius: '50%', 
          backgroundColor: '#f7f9fc',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
        }}
      >
        <HomeIcon sx={{ fontSize: 30 }}>Go to Home Page</HomeIcon>
      </IconButton>
      </Tooltip>
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

  function handleDownloadPDF(transcript, videoURL) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const lineHeight = 10;
    let y = margin;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);

    
    const videoURLText = `Video URL: ${videoURL}`;
    const videoURLLines = doc.splitTextToSize(videoURLText, pageWidth - 2 * margin);
    doc.text(videoURLLines, margin, y);
    y += lineHeight * videoURLLines.length + 10;

    
    doc.text("Transcript:", margin, y);
    y += lineHeight + 5;

    const transcriptLines = doc.splitTextToSize(transcript, pageWidth - 2 * margin);
    transcriptLines.forEach((line) => {
        if (y + lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
    });

    doc.save('transcription.pdf');
};


  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
  <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
      <Tooltip title="Go to Home Page" arrow>
      <IconButton
        color="primary"
        sx={{
          borderRadius: '50%', 
          backgroundColor: '#f7f9fc',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
        }}
      >
        <HomeIcon sx={{ fontSize: 30 }}>Go to Home Page</HomeIcon>
      </IconButton>
      </Tooltip>
    </Link>
  </Box>

  <Stack spacing={3}>
    {history.map((item, index) => (
      <Paper
        key={index}
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 5,
          backgroundColor: '#f7f9fc',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            {index + 1}.
          </Typography>
          <Box>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => handleDownloadPDF(item.transcript, item.videoURL)}
              sx={{
                textTransform: 'none',
                borderRadius: 3,
                fontWeight: 'bold',
                mr: 2,
              }}
            >
              Download PDF
            </Button>
            <IconButton
              onClick={() => handleDelete(item._id)}
              sx={{
                color: '#d32f2f',
                padding: '8px',
              }}
              aria-label="delete transcription"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Video URL Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', mb: 1, color: '#0d47a1' }}
          >
            Video URL:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              wordBreak: 'break-word',
              backgroundColor: '#ffffff',
              p: 2,
              borderRadius: 3,
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
              color: '#424242',
            }}
          >
            {item.videoURL}
          </Typography>
        </Box>

        {/* Transcript Section */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', mb: 1, color: '#0d47a1' }}
        >
          Transcript:
        </Typography>
        <Accordion
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Typography component="span">Click to See Full Transcript</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              sx={{
                wordBreak: 'break-word',
                lineHeight: 1.6,
                color: '#424242',
              }}
            >
              {item.transcript}
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
