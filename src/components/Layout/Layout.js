/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Helmet from 'react-helmet';
import Header from '../Header';
import Footer from '../Footer';

const useStyles = makeStyles(() => ({
  space: {
    marginTop: 60,
  },
}));

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <>
      <Header />
      <Helmet defaultTitle="CloudChair - The chair marketplace">
        <meta charSet="utf-8" />
        <meta name="description" content="Best marketplace ever." />
      </Helmet>
      <div className={classes.space} />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
