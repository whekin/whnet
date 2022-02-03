import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import {
  useChatQuery,
  NewMessageDocument,
  NewMessageSubscription,
} from '@whnet/data-access';

import MessageSender from '../MessageSender/MessageSender';

const INITIAL_LOAD_MESSAGES_AMOUNT = 20;
const LOAD_MORE_MESSAGES_AMOUNT = 10;

export const Chat = () => {
  const { chatId: id } = useParams() as { chatId: string };

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

  return (
    <Box>
      {!chat?.messages.length && !loading && (
        <Box
          sx={{
            pt: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h2">
            Send first message!
          </Typography>
        </Box>
      )}
      <List
        sx={{
          height: 'calc(100vh - 48px)',
          overflowY: 'auto',
          paddingBottom: 20,
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        ref={(node) => node && setContainerTarget(node)}
        onScroll={handleScroll}
      >
        {chat?.messages.map(({ content, userNickname, createdAt }) => {
          return (
            <ListItem key={createdAt} sx={{ bgcolor: 'background.paper' }}>
              <ListItemText primary={userNickname} secondary={content} />
            </ListItem>
          );
        })}
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
        {loadedAllMessages && (
          <>
            <Divider variant="middle" component="li" />
            <Typography
              sx={{ textAlign: 'center' }}
              gutterBottom
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