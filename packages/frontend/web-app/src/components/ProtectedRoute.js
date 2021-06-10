import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ children, ...props }) => {
  const auth = useSelector(({ metadata: { token, user } }) => ({ token, user }));

  return (
    <Route
      {...props}
      render={({ location }) =>
        auth?.token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

ProtectedRoute.propTypes = {};

ProtectedRoute.defaultProps = {};

export default ProtectedRoute;
