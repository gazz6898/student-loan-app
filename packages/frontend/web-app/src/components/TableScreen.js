import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { APIS, client } from '@ku-loan-app/libs-api-client';

import withDispatch from '../hoc/withDispatch';
import withMetadata from '../hoc/withMetadata';

const TABLE_HEADER_SIZE = '64px';
const TABLE_FOOTER_SIZE = '64px';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(),
    bottom: theme.spacing(),
    left: theme.spacing(),
    right: theme.spacing(),
  },
  paper: {
    width: '100%',
    maxHeight: '100%',
  },
  table: {
    minWidth: 750,
  },
  tableBody: {
    maxHeight: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  tableContainer: {
    height: `calc(100vh - (64px + ${TABLE_HEADER_SIZE} + ${TABLE_FOOTER_SIZE} + ${theme.spacing()}px))`,
    overflowX: 'auto',
    overflowY: 'scroll',
    backgroundColor: theme.palette.background.light,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  toolbarRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    flex: '1 1 100%',
  },
});

class TableScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      order: { by: null, direction: null },
      rowsPerPage: 25,
      page: 0,
      selection: [],

      showFormDialog: false,
    };

    this.sortHandlers = {};

    this.populateData = this.populateData.bind(this);

    this.createSortHandler = this.createSortHandler.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);

    this.renderHeader = this.renderHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  async componentDidMount() {
    await this.populateData();
  }

  async populateData() {
    const { api, route } = this.props;
    this.setState({
      data: await client.json({ api: APIS[api], route }, {}),
    });
  }

  createSortHandler(columnName) {
    if (!this.sortHandlers[columnName]) {
      this.sortHandlers[columnName] = this.handleSort.bind(this, columnName);
    }

    return this.sortHandlers[columnName];
  }

  handleChangePage(_, newPage) {
    this.setState({ page: newPage, selection: [] });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: event.target.value, selection: [] });
  }

  handleSelect(idx) {
    const { selection } = this.state;
    const matchIndex = selection.findIndex(x => x === idx);
    this.setState({
      selection:
        matchIndex !== -1
          ? [...selection.slice(0, matchIndex), ...selection.slice(matchIndex + 1)]
          : selection.concat([idx]),
    });
  }

  handleSelectAll() {
    this.setState(({ data, page, rowsPerPage, selection }) => {
      const allSize = Math.min(rowsPerPage, data.length - rowsPerPage * page);
      return {
        selection: selection.length < allSize ? [...new Array(allSize)].map((_, i) => i) : [],
      };
    });
  }

  handleSort(columnName, _) {
    const { order } = this.state;

    const isAsc = order.by === columnName && order.direction === 'asc';
    this.setState({ order: { by: columnName, direction: isAsc ? 'desc' : 'asc' }, selection: [] });
  }

  renderCellContents(format, data, transformer = x => x) {
    if (data === null || data === undefined) {
      return '';
    } else {
      switch (format) {
        case 'string':
          return <Typography>{transformer(data)}</Typography>;
        case 'number':
          return <Typography>{transformer(data)}</Typography>;
        case 'boolean':
          return transformer(data) ? <CheckIcon /> : <ClearIcon />;
      }
    }
  }

  renderHeader() {
    const { classes, columns } = this.props;
    const { data, order, page, rowsPerPage, selection } = this.state;

    const allSize = Math.min(rowsPerPage, data.length - rowsPerPage * page);

    return (
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <Checkbox
              indeterminate={!!(selection.length && selection.length < allSize)}
              checked={data.length > 0 && selection.length === allSize}
              onChange={this.handleSelectAll}
            />
          </TableCell>
          {columns
            .filter(({ visible = true }) => visible)
            .map(({ name, label = name, format }) => (
              <TableCell
                key={name}
                align={format === 'number' ? 'right' : 'left'}
                sortDirection={order.by === name ? order.direction : false}
              >
                <TableSortLabel
                  active={order.by === name}
                  direction={order.by === name ? order.direction : 'asc'}
                  onClick={this.createSortHandler(name)}
                >
                  {label}
                  {order.by === name ? (
                    <span className={classes.visuallyHidden}>
                      {order.direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
        </TableRow>
      </TableHead>
    );
  }

  renderRow(row, idx) {
    const { selection } = this.state;
    const { labelField, columns } = this.props;

    const selected = selection.includes(idx);

    return (
      <TableRow
        hover
        onClick={() => this.handleSelect(idx)}
        role='checkbox'
        tabIndex={-1}
        key={row[labelField]}
        selected={selected}
      >
        <TableCell padding='checkbox'>
          <Checkbox checked={selected} />
        </TableCell>
        {columns
          .filter(({ visible = true }) => visible)
          .map(({ name, format, transformer }) => (
            <TableCell
              key={name}
              {...(name === labelField ? { component: 'th', id: `row-${idx}` } : {})}
              align={format === 'number' ? 'right' : 'left'}
            >
              <Typography>{this.renderCellContents(format, row[name], transformer)}</Typography>
            </TableCell>
          ))}
      </TableRow>
    );
  }

  render() {
    const { actions, classes, title } = this.props;
    const { data, order, page, rowsPerPage, selection = [] } = this.state;

    const cmpsgn = order.direction === 'desc' ? 1 : -1;
    const selectedData = selection.map(i => data[page * rowsPerPage + i]);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Toolbar
            className={clsx(classes.toolbarRoot, {
              [classes.highlight]: selection.length > 0,
            })}
          >
            {selection.length > 0 ? (
              <Typography className={classes.title} variant='subtitle1'>
                {selection.length} selected
              </Typography>
            ) : (
              <Typography className={classes.title} variant='h6'>
                {title}
              </Typography>
            )}

            {actions.map(
              ({
                action,
                disabled = () => false,
                InnerComponent = null,
                innerComponentProps = {},
                title,
              }) => (
                <Tooltip title={title}>
                  <IconButton
                    onClick={() => action(selectedData, this.props)}
                    disabled={disabled(selectedData, this.props)}
                    color='secondary'
                  >
                    <InnerComponent {...innerComponentProps} />
                  </IconButton>
                </Tooltip>
              )
            )}
          </Toolbar>
          <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} size='medium' stickyHeader>
              {this.renderHeader()}
              <TableBody className={classes.tableBody}>
                {data
                  .sort(
                    (a, b) =>
                      cmpsgn * (b[order.by] < a[order.by] ? -1 : b[order.by] > a[order.by] ? 1 : 0)
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(this.renderRow)}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component='div'
            rowsPerPageOptions={[5, 10, 25]}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    );
  }
}

TableScreen.propTypes = {
  api: PropTypes.string,
  route: PropTypes.string,

  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
      format: PropTypes.oneOf(['string', 'number', 'boolean']),
    })
  ).isRequired,
  labelField: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,

  actions: PropTypes.arrayOf(
    PropTypes.shape({
      InnerComponent: PropTypes.node,
      innerComponentProps: PropTypes.object,
      title: PropTypes.string,
      action: PropTypes.func,
    })
  ),
};

TableScreen.defaultProps = {
  api: 'DB',
  route: 'query',
  actions: [],
};

export default withDispatch(withMetadata(withStyles(styles)(TableScreen)));
