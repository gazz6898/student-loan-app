import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: theme.palette.background.dark,
    padding: theme.spacing(),
  },

  actionBar: {
    justifyContent: 'flex-end',
  },
});

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      backendResponse: null,
    };
  }

  async componentDidMount() {
    const backendResponse = await fetch('http://localhost:3000/test').then(res => res.text());
    this.setState({ backendResponse });
  }

  render() {
    const { classes } = this.props;
    const { backendResponse } = this.state;

    return (
      <div className={classes.root}>
        <Container maxWidth='sm'>
          <Card>
            <CardHeader title='Hello, World!' />
            <CardContent>
              <Typography align='center'>
                {backendResponse
                  ? `Backend Response: ${backendResponse}`
                  : `The backend didn't respond... :(`}
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

export default withStyles(styles)(App);
