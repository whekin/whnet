import React from 'react';
import { Box, Typography } from '@mui/material';

export const ChatIntroduction = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <Typography gutterBottom variant="h4" component="h2">
      Welcome to Whnet!
    </Typography>
    <Typography variant="h6" component="h3">
      Start messaging by selecting a chat! Or find a user to create a new chat!
    </Typography>
  </Box>
);

export default ChatIntroduction;
