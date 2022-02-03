import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import SideBar from './SideBar/SideBar';

export const Ui = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box sx={{ width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Ui;
