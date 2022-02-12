import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useUserAuthNickname } from '@whnet/helpers';
import { LoginPage, Chat, Ui, ChatIntroduction } from '@whnet/ui';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const userNickname = useUserAuthNickname();
  const location = useLocation();

  if (!userNickname) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <RequireAuth>
          <Navigate to="/chats" replace />
        </RequireAuth>
      }
    />
    <Route
      path="chats"
      element={
        <RequireAuth>
          <Ui />
        </RequireAuth>
      }
    >
      <Route index element={<ChatIntroduction />} />
      <Route path=":chatId" element={<Chat />} />
    </Route>
    <Route path="login" element={<LoginPage />} />
    <Route path="*" element={<div>Not found</div>} />
  </Routes>
);

export default AppRoutes;
