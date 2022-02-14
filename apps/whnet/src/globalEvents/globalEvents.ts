import React, { useEffect } from 'react';
import { useEventListener } from 'usehooks-ts';

import { upsertCSSCustomVhVariable } from '@whnet/helpers';

export const useGlobalEvents = () => {
  useEventListener('resize', () => upsertCSSCustomVhVariable());

  useEffect(() => {
    upsertCSSCustomVhVariable();
  }, []);
};

export default useGlobalEvents;
