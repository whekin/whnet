import React from 'react';
import { useFormContext } from 'react-hook-form';
import { InputBase, Paper } from '@mui/material';

export const SearchPanel = () => {
  const { register } = useFormContext();

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        margin: '10px auto',
        width: '90%',
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search users"
        inputProps={{ 'aria-label': 'search users' }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('search')}
      />
    </Paper>
  );
};

export default SearchPanel;
