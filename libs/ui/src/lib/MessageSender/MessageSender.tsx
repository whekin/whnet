import React, { useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { DateTime } from 'luxon';
import { IconButton, InputBase, Paper, Divider } from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';

import { useSendMessageMutation } from '@whnet/data-access';

interface FormValues {
  message: string;
}
export interface MessageSenderProps {
  chatId: string;
}

export const MessageSender = ({ chatId }: MessageSenderProps) => {
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();
  const [sendMessage, { error, client }] = useSendMessageMutation();

  const messageValue = watch('message', '');

  const formatMessage = (message: string): string => {
    return message.trim();
  };

  const isSendable = useMemo(() => {
    return !!formatMessage(messageValue).length;
  }, [messageValue]);

  const onSubmit: SubmitHandler<FormValues> = ({ message: rawMessage }) => {
    const message = formatMessage(rawMessage);

    if (!message.length) return;

    reset({ message: '' });

    client.cache.modify({
      id: `Chat:${chatId}`,
      fields: {
        updatedAt: () => DateTime.now().toUTC().toISO(),
      },
    });

    sendMessage({
      variables: {
        chatId,
        content: message,
      },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Paper
      component="form"
      elevation={12}
      sx={{
        width: { md: '500px', xs: '100%' },
        bottom: 0,
        p: '2px 4px',
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <InsertEmoticonIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Input message here"
        inputProps={{ 'aria-label': 'send message' }}
        onKeyDown={handleKeyDown}
        multiline
        {...register('message')}
      />
      <IconButton
        disabled={!isSendable}
        type="submit"
        sx={{ p: '10px' }}
        aria-label="send"
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default MessageSender;
