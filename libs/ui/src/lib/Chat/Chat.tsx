import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  List,
  CircularProgress,
} from '@mui/material';
import { useUserNickname } from '@whnet/context';

import {
  useChatQuery,
  NewMessageDocument,
  NewMessageSubscription,
} from '@whnet/data-access';

import AppBar from '../AppBar/AppBar';
import Message, { UnitedMessages } from '../Message/Message';
import MessageSender from '../MessageSender/MessageSender';
import EmptyChat from './EmptyChat';

const INITIAL_LOAD_MESSAGES_AMOUNT = 20;
const LOAD_MORE_MESSAGES_AMOUNT = 10;

export const Chat = () => {
  const { chatId: id } = useParams() as { chatId: string };

  const currentUserNickname = useUserNickname();

  const [containerTarget, setContainerTarget] = useState<
    HTMLElement | undefined
  >(undefined);
  const { loading, data, error, subscribeToMore, fetchMore } = useChatQuery({
    variables: {
      id,
      skip: 0,
      take: INITIAL_LOAD_MESSAGES_AMOUNT,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [triggerLoadMore, setTriggerLoadMore] = useState(false);
  const [loadedAllMessages, setLoadedAllMessages] = useState(false);

  useEffect(() => {
    subscribeToMore<NewMessageSubscription>({
      variables: { chatId: id } as any,
      document: NewMessageDocument,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { newMessage } = subscriptionData.data;

        return {
          ...prev,
          chats: [
            {
              ...prev.chats[0],
              messages: [newMessage, ...prev.chats[0].messages],
            },
          ],
        };
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult) return prev;

        const {
          chats: [prevChat],
        } = prev;
        const prevMessages = prevChat.messages;
        const olderMessages = fetchMoreResult.chats[0].messages;

        if (olderMessages.length < LOAD_MORE_MESSAGES_AMOUNT) {
          setLoadedAllMessages(true);
        }

        return {
          ...prev,
          chats: [
            {
              ...prevChat,
              messages: [...prevMessages, ...olderMessages],
            },
          ],
        };
      },
    });
  };

  const loadMoreCondition = (scrollToTop: number) =>
    scrollToTop < window.innerHeight / 2;

  const conditionallyLoadMore = async (scrollToTop: number) => {
    if (
      !loadedAllMessages &&
      !triggerLoadMore &&
      loadMoreCondition(scrollToTop)
    ) {
      setTriggerLoadMore(true);

      await fetchMoreMessages();

      setTriggerLoadMore(false);
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

  const chat = data?.chats[0];

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
        {loadedAllMessages && !!unitedMessages?.length && (
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
