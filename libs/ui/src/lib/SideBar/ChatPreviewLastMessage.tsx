import React from 'react';
import { Typography } from '@mui/material';

import { UserQuery } from '@whnet/data-access';

export interface ChatPreviewLastMessageProps {
  chat: NonNullable<UserQuery['user']>['chats'][0];
}

export const ChatPreviewLastMessage = ({
  chat,
}: ChatPreviewLastMessageProps) => {
  const { messages } = chat;

  if (!messages?.length) {
    return <>No messages</>;
  }

  return (
    <span
      style={{
        display: 'block',
        overflowX: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <Typography
        sx={{ display: 'inline' }}
        component="span"
        variant="body2"
        color="text.primary"
        noWrap
      >
        {messages[0].userNickname}
      </Typography>
      <Typography component="span" variant="body2" noWrap>
        {` — ${messages[0].content}`}
      </Typography>
    </span>
  );
};

export default ChatPreviewLastMessage;
