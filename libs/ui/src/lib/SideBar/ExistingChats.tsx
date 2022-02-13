import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
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
      take: 20,
      skip: 0,
    },
  });

  const chats = data?.chats;
  const filteredChats = useMemo(() => {
    if (!userNameStartsWith?.length) return chats;
    return chats?.filter(({ users: [{ nickname }] }) =>
      nickname.startsWith(userNameStartsWith)
    );
  }, [userNameStartsWith, chats]);

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
