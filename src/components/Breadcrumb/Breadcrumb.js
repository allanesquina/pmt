/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Link from '../Link/Link';

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.common.black,
    display: 'flex',
    alignItems: 'center',
    maxWidth: 100,
  },
}));

export default function Breadcrumb({ to }) {
  const classes = useStyles();
  return (
    <Box padding={2} margin={2}>
      <Link className={classes.link} to={to}>
        <ArrowBackIosIcon />
        Back
      </Link>
    </Box>
  );
}

Breadcrumb.propTypes = {
  to: PropTypes.string.isRequired,
};
