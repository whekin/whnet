import React, { useState } from 'react';
import {
  IconButton,
  InputBase,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';

import { useSendMessageMutation } from '@whnet/data-access';

export interface MessageSenderProps {
  chatId: string;
}

export const MessageSender = ({ chatId }: MessageSenderProps) => {
  const [message, setMessage] = useState('');
  const [sendMessage, { loading, data, error }] = useSendMessageMutation({
    refetchQueries: ['Chat'],
    onCompleted() {
      setMessage('');
    },
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    sendMessage({
      variables: {
        chatId,
        content: message,
      },
    });
  };

  return (
    <Paper
      component="form"
      elevation={12}
      sx={{
        position: 'fixed',
        width: { sm: 'calc(100% - 350px)', xs: '100%' },
        bottom: 0,
        top: 'auto',
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
      }}
      onSubmit={handleSubmit}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <InsertEmoticonIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        value={message}
        placeholder="Input message here"
        inputProps={{ 'aria-label': 'send message' }}
        onChange={({ target: { value } }) => setMessage(value)}
        multiline
      />
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton
          disabled={message.length === 0}
          type="submit"
          sx={{ p: '10px' }}
          aria-label="send"
        >
          <SendIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default MessageSender;
