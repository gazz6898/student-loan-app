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

const styles = theme => ({
  root: {
    padding: theme.spacing(),
  },

  actionBar: {
    justifyContent: 'flex-end',
  },
});

class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  render() {
    const { classes } = this.props;
    const { username, password } = this.state;

    return (
      <div className={classes.root}>
        <Container maxWidth='sm'>
          <Card>
            <CardHeader title='Hello, World!' />
            <CardContent>
              <Typography align='center'>
                {backendResponse ? backendResponse : `The backend didn't respond... :(`}
              </Typography>
            </CardContent>
            <CardActions className={classes.actionBar}>
              <Button color='primary' variant='contained'>
                Cool
              </Button>
              <Button color='secondary' variant='contained'>
                Good
              </Button>
            </CardActions>
          </Card>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
