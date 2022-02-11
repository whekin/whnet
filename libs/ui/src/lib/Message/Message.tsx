import React from 'react';
import { List, ListItem, ListItemText, ListSubheader } from '@mui/material';

import { ChatQuery } from '@whnet/data-access';

export interface UnitedMessages {
  userNickname: string;
  messages: ChatQuery['chats'][0]['messages'];
  firstMessageCreatedAt: string;
}

export interface MessageProps {
  message: UnitedMessages;
}

export const Message = ({
  message: { firstMessageCreatedAt, userNickname, messages },
}: MessageProps) => {
  return (
    <List subheader={<ListSubheader>{userNickname}</ListSubheader>}>
      {messages.map(({ content, createdAt }) => (
        <ListItem key={createdAt} sx={{ bgcolor: 'background.paper' }}>
          <ListItemText primary={content} />
        </ListItem>
      ))}
    </List>
  );
};

export default Message;
