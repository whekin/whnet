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

import { useUserQuery } from '@whnet/data-access';
import { useUserNickname } from '@whnet/context';

import ChatPreviewLastMessage from './ChatPreviewLastMessage';
import ChatsSkeleton from './ChatsSkeleton';

export const ExistingChats = () => {
  const userNickname = useUserNickname();
  const navigate = useNavigate();
  const { watch } = useFormContext();

  const userNameStartsWith = watch('search');

  const { data, loading } = useUserQuery({
    variables: {
      nickname: userNickname,
    },
  });

  const chats = data?.user?.chats;
  const filteredChats = useMemo(() => {
    return chats?.filter(({ users: [{ nickname }] }) =>
      nickname.startsWith(userNameStartsWith)
    );
  }, [userNameStartsWith, chats]);

  if (loading) return <ChatsSkeleton amount={5} />;

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {filteredChats?.map((chat) => (
        <div key={chat.id}>
          <ListItemButton
            alignItems="flex-start"
            onClick={() => navigate(`/chats/${chat.id}`)}
          >
            <ListItemAvatar>
              <Avatar>
                <AccountCircle />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chat.users[0].nickname}
              secondary={<ChatPreviewLastMessage chat={chat} />}
            />
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  );
};

export default ExistingChats;
