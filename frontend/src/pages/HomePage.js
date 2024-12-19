import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';


function HomePage() {
    const [input, setInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Pressed");

        try {
            const response = await fetch('http://localhost:5001/submit-link', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input }),

            })
            const data = await response.json();
            console.log('from frontend', data.message)
        setInput('');
        } catch (error) {
            console.log(error);
        }

    }

    const handleInputChange = (e) => {
        setInput(e.target.value);

    }


  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField id="outlined-basic" label="Outlined" variant="outlined" 
                value = {input}
                onChange={handleInputChange}/>

    <Button variant='contained' onClick={handleSubmit}>Submit</Button>
    </Box>
    
  )
}

export default HomePage

