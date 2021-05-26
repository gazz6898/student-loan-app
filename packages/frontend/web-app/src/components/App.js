import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';

import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';

import { APIS, client } from '@ku-loan-app/libs-api-client';

import Login from './Login';

import { login } from '../util/redux/reducers/metadata';

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
    const backendResponse = await client
      .query({ model: 'User', where: {} });
    this.setState({ backendResponse });
  }

  render() {
    const { classes, login, token } = this.props;
    const { backendResponse } = this.state;

    return (
      <div className={classes.root}>
        <Container maxWidth='sm'>
          <Card>
            <CardHeader title='Student Loan App' />
            <CardContent>
              <pre>{`Token: ${token}`}</pre>
            </CardContent>
            <Login onSubmit={login} />
          </Card>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ metadata: { token } }) => ({ token });

export default connect(mapStateToProps, { login })(withStyles(styles)(App));
