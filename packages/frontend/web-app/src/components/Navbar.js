import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { signout } from '~/util/redux/reducers/metadata';
import routes from '~/util/routes';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
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

  appbarLink: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(),
    '&:last-child': {
      marginRight: 0,
    },
  },

  spacer: {
    flexGrow: 1,
  },
});

/** @type {(s: string) => string} */
const upperFirst = s => `${s[0].toUpperCase()}${s.substring(1)}`

const Navbar = ({ classes }) => {
  const dispatch = useDispatch();
  const auth = useSelector(({ metadata: { token, user } }) => ({ token, user }));

  return (
    <nav>
      <AppBar>
        <Toolbar className={classes.appbar}>
          {auth?.token
            ? routes.map(({ path }) =>
                path === '/' ? null : (
                  <Link key={path} className={classes.appbarLink} to={path}>
                    {upperFirst(path.substring(1).replace(/([A-Z])/, ' $1'))}
                  </Link>
                )
              )
            : null}
          <span className={classes.spacer} />
          {auth?.token ? (
            <Link className={classes.appbarLink} onClick={() => dispatch(signout())} to='/login'>
              Log Out
            </Link>
          ) : (
            <Link className={classes.appbarLink} to='/login'>
              Log In
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </nav>
  );
};

Navbar.propTypes = {};

Navbar.defaultProps = {};

export default withStyles(styles)(Navbar);
