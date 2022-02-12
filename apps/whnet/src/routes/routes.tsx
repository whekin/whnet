import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useUserAuthNickname } from '@whnet/helpers';
import { LoginPage, Chat, Ui, ChatIntroduction } from '@whnet/ui';

/** Redirect to login page saving location */
const RedirectToLoginPage = () => {
  const location = useLocation();

  return <Navigate to="/login" state={{ from: location }} replace />;
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const userNickname = useUserAuthNickname();

  if (!userNickname) {
    return <RedirectToLoginPage />;
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
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
