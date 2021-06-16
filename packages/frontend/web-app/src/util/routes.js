import React from 'react';

import Typography from '@material-ui/core/Typography';

import HowToRegIcon from '@material-ui/icons/HowToReg';

import Screen from '~/components/Screen';
import TableScreen from '~/components/TableScreen';

import { APIS, client } from '@ku-loan-app/libs-api-client';

/**
 * @type {{
 *  path: string,
 *  Component: import('react').Component
 * }[]}
 */
export default [
  {
    path: '/loans',
    Component: TableScreen,
    componentProps: {
      api: 'EXTDB',
      route: 'find/loan',

      title: 'Loans',
      columns: [
        { name: '_id', label: 'ID', format: 'string', visible: false },
        { name: 'bank', label: 'Bank', format: 'string' },
        {
          name: 'interest',
          label: 'Interest',
          format: 'number',
          transformer: x => `${(x * 100).toFixed(2)}%`,
        },
        {
          name: 'principal',
          label: 'Principal',
          format: 'number',
          transformer: x => `$${x.toFixed(2)}`,
        },
        { name: 'subsidized', label: 'Subsidized', format: 'boolean' },
      ],
      labelField: '_id',
      actions: [
        {
          title: 'Apply',
          disabled: selectedData => !selectedData.length,
          InnerComponent: HowToRegIcon,
          action: async (selectedLoans, { dispatch, metadata: { user }, setMessage }) => {
            for await (const { _id } of selectedLoans) {
              await client.json({ api: APIS.EXTDB, route: `/apply/${_id}` }, { student_id: user });
            }
            setMessage(
              selectedLoans.length > 1
                ? `Applied for ${selectedLoans.length} loans.`
                : `Applied for loan.`
            );
          },
        },
      ],
    },
  },
  {
    path: '/students',
    Component: TableScreen,
    componentProps: {
      api: 'EXTDB',
      route: 'find/student',

      title: 'Students',
      columns: [
        { name: '_id', label: 'ID', format: 'string', visible: false },
        { name: 'firstName', label: 'First Name', format: 'string' },
        { name: 'lastName', label: 'Last Name', format: 'string' },
        { name: 'Email', label: 'Email', format: 'string' },
        { name: 'Student ID', label: 'Student ID', format: 'string' },
        { name: 'Credit Score', label: 'Credit Score', format: 'string' },
      ],
      labelField: 'Student ID',
    },
  },
  {
    path: '/studentLoans',
    Component: TableScreen,
    componentProps: {
      api: 'EXTDB',
      route: 'find/studentLoan',

      title: 'Student Loans',
      columns: [
        { name: '_id', label: 'ID', format: 'string', visible: false },
        { name: 'approved', label: 'Approved', format: 'boolean' },
        { name: 'bank', label: 'Bank', format: 'string' },
        {
          name: 'interest',
          label: 'Interest',
          format: 'number',
          transformer: x => `${(x * 100).toFixed(2)}%`,
        },
        {
          name: 'principal',
          label: 'Principal',
          format: 'number',
          transformer: x => `$${x.toFixed(2)}`,
        },
        { name: 'subsidized', label: 'Subsidized', format: 'boolean' },
        { name: 'first name', label: 'Student First Name', format: 'string' },
        { name: 'last name', label: 'Student Last Name', format: 'string' },
      ],
      labelField: '_id',
    },
  },
  {
    path: '/',
    Component: Screen,
    componentProps: {},
  },
];
