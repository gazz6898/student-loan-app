import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
  },
});

const Screen = ({ classes, route, ...props }) => (
  <Paper className={classes.root}>
  </Paper>
);

export default withStyles(styles)(Screen);
