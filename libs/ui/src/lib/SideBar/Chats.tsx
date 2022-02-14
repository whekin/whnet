import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box } from '@mui/material';

import SearchPanel from './SearchPanel';
import ExistingChats from './ExistingChats';
import GlobalSearchFoundUsers from './GlobalSearchFoundUsers';

export interface FormValues {
  search: string;
}

export const Chats = () => {
  const methods = useForm<FormValues>();
  return (
    <Box>
      <FormProvider {...methods}>
        <SearchPanel />
        <ExistingChats />
        <GlobalSearchFoundUsers />
      </FormProvider>
    </Box>
  );
};

export default Chats;
