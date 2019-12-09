/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import CloudCircle from '@material-ui/icons/CloudCircle';
import { Badge, NoSsr, Button } from '@material-ui/core';

import { useQuery } from '@apollo/react-hooks';
import Link from '../Link/Link';
import { GET_CART_ITEMS } from '../../graphql/client/queries';

export const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    margin: 10,
  },
  toolbar: {
    marginLeft: 10,
  },
}));

const LinkRef = React.forwardRef((props, ref) => <Link {...props} ref={ref} />);

export default function ButtonAppBar() {
  const classes = useStyles();
  const isServer = typeof window === 'undefined';
  let count = 0;

  if (!isServer) {
    const { error, data } = useQuery(GET_CART_ITEMS);
    if (error) {
      return <p>{error}</p>;
    }
    count = data && data.cart.items.length ? data.cart.items.length : count;
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary">
        <Toolbar className={classes.toolbar}>
          <CloudCircle />
          <Typography variant="h6" className={classes.title}>
            CloudChair
          </Typography>
          <NoSsr>
            <Button
              component={LinkRef}
              aria-label="show 4 new mails"
              color="inherit"
              to="/cart"
            >
              <Badge badgeContent={count} color="secondary">
                <ShoppingCart />
              </Badge>
            </Button>
          </NoSsr>
        </Toolbar>
      </AppBar>
    </div>
  );
}
