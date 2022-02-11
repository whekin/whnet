import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';

import { ArrowBack } from '@mui/icons-material';

export interface AppBarProps {
  nickname: string;
}

export const AppBar = ({ nickname }: AppBarProps) => {
  const navigate = useNavigate();

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <IconButton
          size="medium"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={() => navigate('/chats')}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {nickname}
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
