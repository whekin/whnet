import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListSubheader,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

import {
  useSearchUsersLazyQuery,
  useCreateChatMutation,
  SearchUsersQuery,
} from '@whnet/data-access';
import { useUserNickname } from '@whnet/context';

const GlobalSearchFoundUsers = () => {
  const userNickname = useUserNickname();
  const navigate = useNavigate();
  const [users, setUsers] = useState<SearchUsersQuery['users']>();
  const { watch, reset } = useFormContext();

  const userNameStartsWith = watch('search');

  const [searchUsers, { data }] = useSearchUsersLazyQuery();

  const [createChat] = useCreateChatMutation({
    onCompleted({ createChat: { id } }) {
      navigate(`/chats/${id}`);
      reset();
    },
    refetchQueries: ['Chats'],
  });

  useEffect(() => {
    if (data) {
      setUsers(data.users);
    }
  }, [data, userNameStartsWith]);

  useEffect(() => {
    if (userNameStartsWith?.length) {
      searchUsers({
        variables: {
          startsWith: userNameStartsWith,
          myNickname: userNickname,
        },
      });
    } else {
      setUsers([]);
    }
  }, [userNickname, userNameStartsWith, searchUsers]);

  const handleClickOnFoundUser = (nickname: string) => {
    createChat({
      variables: {
        participant1: userNickname,
        participant2: nickname,
      },
    });
  };

  return (
    <Box>
      {!!users?.length && (
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Global search results
            </ListSubheader>
          }
          sx={{ width: '100%', bgcolor: 'background.paper' }}
        >
          {users?.map(({ nickname }) => (
            <div key={nickname}>
              <ListItemButton onClick={() => handleClickOnFoundUser(nickname)}>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircle />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={nickname} />
              </ListItemButton>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      )}
    </Box>
  );
};

export default GlobalSearchFoundUsers;
