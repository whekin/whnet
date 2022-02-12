import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputBase,
  Paper,
  Divider,
  List,
  ListItemButton,
  ListSubheader,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

import {
  useUserQuery,
  useSearchUsersLazyQuery,
  useCreateChatMutation,
} from '@whnet/data-access';
import { useUserNickname } from '@whnet/context';
import { useLogout } from '@whnet/helpers';

const ChatPreviewLastMessage = ({ chat }: any) => {
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

export const Chats = () => {
  const navigate = useNavigate();
  const userNickname = useUserNickname()!;
  const [searchUsers, { data: searchData, loading: searchLoading }] =
    useSearchUsersLazyQuery();
  const { loading, data, error } = useUserQuery({
    variables: {
      nickname: userNickname,
    },
  });
  const [searchValue, setSearchValue] = useState('');
  const [foundUsers, setFoundUsers] = useState<any[]>([]);
  const [filteredChats, setFilteredChats] = useState(data?.user?.chats);
  const [createChat, { data: createdChat, loading: creatingChat }] =
    useCreateChatMutation({
      onCompleted({ createChat: { id } }) {
        navigate(`/chats/${id}`);
        setSearchValue('');
      },
      refetchQueries: ['User'],
    });

  useEffect(() => {
    const chats = data?.user?.chats;

    if (chats) {
      setFilteredChats(chats);
    }
  }, [data]);

  useEffect(() => {
    if (!searchData || !filteredChats || !searchValue) return;

    const { users } = searchData;

    const usersHaveChat = filteredChats.map(
      ({ users: [{ nickname }] }) => nickname
    );
    const filteredFoundUsers = users.filter(
      ({ nickname }) =>
        !usersHaveChat.includes(nickname) && nickname !== userNickname
    );

    if (filteredFoundUsers.length) {
      setFoundUsers(filteredFoundUsers);
    }
  }, [searchData, searchValue, filteredChats, userNickname]);

  useEffect(() => {
    const chats = data?.user?.chats;

    if (!chats) return;

    let updatedChats;

    if (!searchValue.length) {
      setFoundUsers([]);
      updatedChats = chats;
    } else {
      searchUsers({ variables: { startsWith: searchValue } });

      updatedChats = chats.filter(({ users: [{ nickname }] }) =>
        nickname.startsWith(searchValue)
      );
    }

    setFilteredChats(updatedChats);
  }, [searchValue, data, searchUsers, userNickname]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleClickOnFoundUser = (nickname: string) => {
    createChat({
      variables: {
        participant1: userNickname,
        participant2: nickname,
      },
    });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          margin: '10px auto',
          width: '90%',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          value={searchValue}
          onChange={handleOnChange}
          placeholder="Search users"
          inputProps={{ 'aria-label': 'search users' }}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
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
      {foundUsers.length ? (
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Global search results
            </ListSubheader>
          }
          sx={{ width: '100%', bgcolor: 'background.paper' }}
        >
          {foundUsers?.map(({ nickname }: any) => (
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
      ) : null}
    </Box>
  );
};

export const SideBar = () => {
  const logout = useLogout();

  return (
    <Box
      sx={{ width: '100%', flexShrink: 0, height: '100vh', overflowY: 'auto' }}
    >
      <Chats />
      <Button onClick={logout}>Logout</Button>
    </Box>
  );
};

export default SideBar;
