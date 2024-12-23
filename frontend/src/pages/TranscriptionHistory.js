import React from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';


function TranscriptionHistory() {
    
    const location = useLocation();
    const history = location.state?.history;

    if (!history) {
        return <div>NO HISTORY</div>
    }
  return (
    <>

    <Link to='/'><Button variant='contained'>GO HOME</Button></Link>

    <Box>
        <Stack>
        {history.map((item, index) => (
        <div key={index}>
          {JSON.stringify(item.videoURL)}
          <br></br>
          <br></br>
          {JSON.stringify(item.transcript)}
        </div>
      ))}
        </Stack>
    </Box>


    </>
  )
}

export default TranscriptionHistory
