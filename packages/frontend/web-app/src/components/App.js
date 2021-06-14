import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';

import {
  Switch,
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';

import Typography from '@material-ui/core/Typography';

import Login from './Login';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';

import { requestLogin, signout } from '~/util/redux/reducers/metadata';
import routes from '~/util/routes';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(8),
    bottom: 0,
    left: 0,
    right: 0,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: theme.palette.background.dark,
    padding: theme.spacing(),

    overflow: 'hidden',
  },

  spacer: {
    flexGrow: 1,
  },
});

const App = ({ classes }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  return (
    <div className={classes.root}>
      <Navbar />
      <Switch>
        <Route path='/login'>
          <Login
            onSubmit={payload => {
              dispatch(requestLogin(payload)).then(() =>
                history.replace(location?.state?.from ?? { pathname: '/' })
              );
            }}
          />
        </Route>

        {routes.map(({ path, Component, componentProps }) => (
          <ProtectedRoute key={path} path={path} exact={path === '/'}>
            <Component {...componentProps} />
          </ProtectedRoute>
        ))}

        <Route path='*'>
          <Typography variant='h1' color='error'>
            404
          </Typography>
        </Route>
      </Switch>
    </div>
  );
};

App.propTypes = {};

App.defaultProps = {};

export default withStyles(styles)(App);
