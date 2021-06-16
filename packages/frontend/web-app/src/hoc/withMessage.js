import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ClearIcon from '@material-ui/icons/Clear';

import { theme } from '../util/theme';

const withMessage = WrappedComponent => props => {
  const [message, setMessage] = React.useState(null);

  return (
    <>
      <WrappedComponent setMessage={setMessage} {...props} />
      {message ? (
        <Paper
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            padding: '8px',
          }}
        >
          <Typography style={{ padding: '8px' }}>{message}</Typography>
          <IconButton
            onClick={() => setMessage(null)}
            style={{
              color: theme.palette.getContrastText(theme.palette.secondary.main),
            }}
          >
            <ClearIcon />
          </IconButton>
        </Paper>
      ) : null}
    </>
  );
};

export default withMessage;
