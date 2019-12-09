/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Grid, Container, Paper, Box, NoSsr } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Dinero from 'dinero.js';
import Button from '@material-ui/core/Button';
import { useQuery, useMutation } from '@apollo/react-hooks';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import CartItem from '../../components/Cart/CartItem';
import Link from '../../components/Link/Link';
import { GET_CART_ITEMS, EMPTY_CART } from '../../graphql/client/queries';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

export default function Cart() {
  const isServer = typeof window === 'undefined';
  const [emptyCart] = useMutation(EMPTY_CART);
  let cart = { items: [], total: 0 };
  let total = 0;

  if (!isServer) {
    const { error, data } = useQuery(GET_CART_ITEMS);

    if (error) {
      return <p>{error}</p>;
    }

    cart = data.cart;
    total = Dinero({ amount: cart.total, currency: 'BRL' }).toFormat('$0,0.00');
  }

  const LinkRef = React.forwardRef((props, ref) => (
    <Link {...props} ref={ref} />
  ));
  if (cart.items.length === 0) {
    return (
      <NoSsr>
        <Breadcrumb to="/" />
        <Paper>
          <Box padding={15} textAlign="center">
            <Typography color="primary" variant="h6">
              Your cart is empty :(
            </Typography>
          </Box>
        </Paper>
      </NoSsr>
    );
  }

  return (
    <NoSsr>
      <Container>
        <Breadcrumb to="/" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <Paper>
              <Box padding={2} textAlign="right">
                <Button variant="contained" onClick={emptyCart}>
                  Clear cart
                </Button>
              </Box>
            </Paper>
            {cart.items.map(p => (
              <CartItem key={p.name} product={p} />
            ))}
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper>
              <Box padding={15}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h4">{total}</Typography>
                <br />
                <Button
                  component={LinkRef}
                  variant="contained"
                  color="primary"
                  fullWidth
                  to="/checkout"
                >
                  Checkout
                  <ArrowRightAltIcon />
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </NoSsr>
  );
}

Cart.propTypes = {};
