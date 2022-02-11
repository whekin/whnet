import React from 'react';
import { Box, Typography } from '@mui/material';

export const EmptyChat = () => (
  <Box
    sx={{
      pt: 3,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Typography variant="h4" component="h2">
      Send first message!
    </Typography>
  </Box>
);

export default EmptyChat;
