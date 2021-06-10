import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { client } from '@ku-loan-app/libs-api-client';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },

  actionBar: {
    justifyContent: 'center',
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
      <Container maxWidth='sm'>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" color="primary"><strong>Log In</strong></Typography>
            <form className={classes.root}>
              <TextField
                onChange={this.onEmailChange}
                label='Email'
                value={email}
                autoComplete='email'
              />
              <TextField
                onChange={this.onPasswordChange}
                label='Password'
                value={password}
                type='password'
                autoComplete='current-password'
              />
            </form>
          </CardContent>
          <CardActions className={classes.actionBar}>
            <Button onClick={this.onLogin} color='primary' variant='contained'>
              Log In
            </Button>
          </CardActions>
        </Card>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
