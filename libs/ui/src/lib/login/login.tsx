import React from 'react';
import styled from '@emotion/styled';

import { useUserQuery } from '@whnet/data-access';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginProps {}

const StyledLogin = styled.div`
  color: green;
`;

export const Login = (props: LoginProps) => {
  const { loading, error, data } = useUserQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <StyledLogin>
      <ul>
        {data?.users.map((user) => (
          <li key={user.id}>
            {user.nickname}: {user.id}
          </li>
        ))}
      </ul>
    </StyledLogin>
  );
};

export default Login;
