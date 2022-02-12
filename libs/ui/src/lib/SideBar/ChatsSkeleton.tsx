import React from 'react';
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Skeleton,
  Avatar,
} from '@mui/material';

const calcRandomWidth = (from: number, to: number) =>
  from + Math.floor(Math.random() * (to - from));

export interface ChatsSkeletonProps {
  amount?: number;
}

export const ChatsSkeleton = ({ amount = 3 }: ChatsSkeletonProps) => {
  const skeletons = [...Array(amount).keys()] as const;

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {skeletons.map((num) => (
        <div key={num}>
          <ListItemButton alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={40}
                  height={40}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton width="60%" />}
              secondary={<Skeleton width={`${calcRandomWidth(50, 100)}%`} />}
            />
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  );
};

export default ChatsSkeleton;
