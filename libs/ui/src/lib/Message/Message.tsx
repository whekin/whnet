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
import { useUserNickname } from '@whnet/context';

const MessageSentDate = ({ createdAt }: { createdAt: string }) => {
  const date = DateTime.fromISO(createdAt);

  let dateToShow = date.toLocaleString({
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const now = DateTime.now();

  if (now.hasSame(date, 'minute')) dateToShow = 'just now';
  else if (now.hasSame(date, 'week')) dateToShow = date.toRelative()!;

  return <time dateTime={createdAt}>{dateToShow}</time>;
};

const MessageGroupSentDay = ({ createdAt }: { createdAt: string }) => {
  const day = DateTime.fromISO(createdAt).toLocaleString({
    weekday: 'long',
    month: 'long',
    day: '2-digit',
  });

  return <time dateTime={createdAt}>{day}</time>;
};
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
  message: { userNickname, messages, firstMessageCreatedAt },
}: MessageProps) => {
  const currentUserNickname = useUserNickname();
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
          <span>
            {userNickname} |&nbsp;
            <MessageGroupSentDay createdAt={firstMessageCreatedAt} />
          </span>
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
                <Box component="span" sx={{ float: 'right' }}>
                  <MessageSentDate createdAt={createdAt} />
                </Box>
              }
            />
          </ListItem>
        ))}
      </Box>
    </List>
  );
};

export default Message;
