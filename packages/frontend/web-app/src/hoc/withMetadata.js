import React from 'react';

import { useSelector } from 'react-redux';

export default WrappedComponent => props => {
  const metadata = useSelector(state => state?.metadata);

  return <WrappedComponent metadata={metadata} {...props} />;
};
