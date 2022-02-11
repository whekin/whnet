import React from 'react';
import { DateTime } from 'luxon';
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Box,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { ChatQuery } from '@whnet/data-access';
import { useUserAuthNickname } from '@whnet/helpers';

const MessageSentDate = (createdAt: string) => (
  <time dateTime={createdAt}>{DateTime.fromISO(createdAt).toRelative()}</time>
);
export interface UnitedMessages {
  userNickname: string;
  messages: ChatQuery['chats'][0]['messages'];
  firstMessageCreatedAt: string;
}

export interface MessageProps {
  message: UnitedMessages;
}

const myMessageStyles = {
  borderRadius: '20px 0 0 20px',
} as const;

const opponentMessageStyles = {
  borderRadius: '0 20px 20px 0',
};

export const Message = ({
  message: { firstMessageCreatedAt, userNickname, messages },
}: MessageProps) => {
  const currentUserNickname = useUserAuthNickname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isAttachedRight = isMobile && userNickname === currentUserNickname;

  return (
    <List
      subheader={
        <ListSubheader
          disableSticky={isMobile}
          sx={{
            display: 'flex',
            justifyContent: isAttachedRight ? 'end' : 'start',
          }}
        >
          {userNickname}
        </ListSubheader>
      }
      sx={{
        width: 'fit-content',
        maxWidth: '80%',
        alignSelf: isAttachedRight ? 'end' : 'start',
      }}
    >
      <Box
        sx={{
          p: 1,
          bgcolor: '#f0f0f0',
          ...(isAttachedRight ? myMessageStyles : opponentMessageStyles),
        }}
      >
        {messages.map(({ content, createdAt }) => (
          <ListItem key={createdAt} sx={{ pb: 0 }}>
            <ListItemText
              primary={content}
              secondary={
                <Box sx={{ float: 'right' }}>{MessageSentDate(createdAt)}</Box>
              }
            />
          </ListItem>
        ))}
      </Box>
    </List>
  );
};

export default Message;
