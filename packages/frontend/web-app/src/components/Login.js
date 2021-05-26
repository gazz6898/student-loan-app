import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
  },

  actionBar: {
    justifyContent: 'flex-end',
  },
});

class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      inputs: {
        email: '',
        password: '',
      },
    };

    this.onEmailChange = this.onInputChange.bind(this, 'email');
    this.onPasswordChange = this.onInputChange.bind(this, 'password');
    this.onLogin = this.onLogin.bind(this);
  }

  onInputChange(field, event) {
    this.setState(({ inputs }) => ({ inputs: { ...inputs, [field]: event.target.value } }));
  }

  async onLogin() {
    const { onSubmit } = this.props;
    const {
      inputs: { email, password },
    } = this.state;
    await onSubmit({ email, password });
  }

  render() {
    const { classes } = this.props;
    const {
      inputs: { email, password },
    } = this.state;

    return (
      <form className={classes.root}>
        <TextField onChange={this.onEmailChange} label='Email' value={email} autoComplete='email' />
        <TextField
          onChange={this.onPasswordChange}
          label='Password'
          value={password}
          type='password'
          autoComplete='current-password'
        />
        <Button onClick={this.onLogin} color='primary' variant='contained'>
          Log In
        </Button>
      </form>
    );
  }
}

export default withStyles(styles)(Login);
