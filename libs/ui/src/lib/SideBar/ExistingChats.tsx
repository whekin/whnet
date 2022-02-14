import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { DateTime } from 'luxon';
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

import { useChatsQuery } from '@whnet/data-access';
import { useUserNickname } from '@whnet/context';

import ChatPreviewLastMessage from './ChatPreviewLastMessage';
import ChatsSkeleton from './ChatsSkeleton';

export const ExistingChats = () => {
  const userNickname = useUserNickname();
  const navigate = useNavigate();
  const { watch } = useFormContext();

  const userNameStartsWith = watch('search', '');

  const { data, loading } = useChatsQuery({
    variables: {
      nickname: userNickname,
      take: 1,
      skip: 0,
    },
  });

  const chats = data?.chats;
  const filteredChats = useMemo<typeof chats>(() => {
    if (!userNameStartsWith?.length)
      return chats?.slice().sort((chat1, chat2) => {
        const { updatedAt: updatedAt1 } = chat1;
        const { updatedAt: updatedAt2 } = chat2;

        const a = DateTime.fromISO(updatedAt1);
        const b = DateTime.fromISO(updatedAt2);

        return b.valueOf() - a.valueOf();
      });

    return chats?.filter(({ users }) => {
      const openedChatOpponentNickname = users.filter(
        ({ nickname }) => nickname !== userNickname
      )[0].nickname;

      return openedChatOpponentNickname.startsWith(userNameStartsWith);
    });
  }, [userNameStartsWith, userNickname, chats]);

  if (loading) return <ChatsSkeleton amount={5} />;

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {filteredChats?.map((chat) => {
        const { id, users } = chat;

        const [{ nickname: opponent }] = users.filter(
          ({ nickname }) => nickname !== userNickname
        );

        return (
          <div key={id}>
            <ListItemButton
              alignItems="flex-start"
              onClick={() => navigate(`/chats/${id}`)}
            >
              <ListItemAvatar>
                <Avatar>
                  <AccountCircle />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={opponent}
                secondary={<ChatPreviewLastMessage chat={chat} />}
              />
            </ListItemButton>
            <Divider variant="inset" component="li" />
          </div>
        );
      })}
    </List>
  );
};

export default ExistingChats;
