import React from 'react';

import { useDispatch } from 'react-redux';

export default WrappedComponent => props => {
  const dispatch = useDispatch();

  return <WrappedComponent dispatch={dispatch} {...props} />;
};
