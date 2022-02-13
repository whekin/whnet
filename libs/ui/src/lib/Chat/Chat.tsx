import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  List,
  CircularProgress,
} from '@mui/material';
import { useUserNickname } from '@whnet/context';

import { useChatQuery } from '@whnet/data-access';

import AppBar from '../AppBar/AppBar';
import Message, { UnitedMessages } from '../Message/Message';
import MessageSender from '../MessageSender/MessageSender';
import EmptyChat from './EmptyChat';

const INITIAL_LOAD_MESSAGES_AMOUNT = 20;
const LOAD_MORE_MESSAGES_AMOUNT = 10;

export const Chat = () => {
  const { chatId: id } = useParams() as { chatId: string };

  const currentUserNickname = useUserNickname();

  const lockLoadMore = useRef(false);

  const [containerTarget, setContainerTarget] = useState<
    HTMLElement | undefined
  >(undefined);
  const { loading, data, fetchMore } = useChatQuery({
    variables: {
      id,
      skip: 1,
      take: INITIAL_LOAD_MESSAGES_AMOUNT,
    },
    notifyOnNetworkStatusChange: true,
  });

  const chat = data?.chats[0];

  const fetchMoreMessages = async () => {
    if (!data) return;

    const {
      chats: [{ messages }],
    } = data;

    await fetchMore({
      variables: {
        id,
        skip: messages.length,
        take: LOAD_MORE_MESSAGES_AMOUNT,
      },
    });
  };

  const loadMoreCondition = (scrollToTop: number) =>
    scrollToTop < window.innerHeight / 2;

  const conditionallyLoadMore = async (scrollToTop: number) => {
    if (!chat) return;
    if (
      !chat.loadedAll &&
      !lockLoadMore.current &&
      loadMoreCondition(scrollToTop)
    ) {
      lockLoadMore.current = true;

      await fetchMoreMessages();

      lockLoadMore.current = false;
    }
  };

  const calculateScrollToTopOnReversedColumn = (scrollTarget: HTMLElement) => {
    const { scrollTop, scrollHeight, offsetHeight } = scrollTarget;

    const height = scrollHeight - offsetHeight;

    const scrollToTop = scrollTop + height;

    return scrollToTop;
  };

  const handleScroll = async (event: React.UIEvent<HTMLElement>) => {
    if (!containerTarget) return;

    const scrollToTop = calculateScrollToTopOnReversedColumn(containerTarget);

    conditionallyLoadMore(scrollToTop);
  };

  const unitedMessages = useMemo(
    () =>
      chat?.messages.reduce((prev: UnitedMessages[], curr) => {
        const lastEntry = prev[prev.length - 1];

        if (lastEntry?.userNickname === curr.userNickname) {
          lastEntry.messages.unshift(curr);

          return prev;
        }

        prev.push({
          userNickname: curr.userNickname,
          messages: [curr],
          firstMessageCreatedAt: curr.createdAt,
        });

        return prev;
      }, []),
    [chat]
  );

  const openedChatOpponentNickname = chat?.users.filter(
    ({ nickname }) => nickname !== currentUserNickname
  )[0].nickname;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: { sm: 'none' } }}>
        <AppBar nickname={openedChatOpponentNickname || 'Loading chat...'} />
      </Box>
      {!unitedMessages?.length && !loading && <EmptyChat />}
      <List
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          paddingBottom: 2,
          paddingTop: 0,
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        ref={(node) => node && setContainerTarget(node)}
        onScroll={handleScroll}
      >
        {unitedMessages?.map((message) => (
          <Message key={message.firstMessageCreatedAt} message={message} />
        ))}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {chat?.loadedAll && !!unitedMessages?.length && (
          <>
            <Divider variant="middle" component="li" />
            <Typography
              sx={{ textAlign: 'center', p: 2 }}
              variant="body1"
              component="h3"
            >
              Start of messaging history
            </Typography>
          </>
        )}
      </List>
      <MessageSender chatId={id} />
    </Box>
  );
};

export default Chat;
