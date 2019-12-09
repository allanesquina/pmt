/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Divider, Container, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Dinero from 'dinero.js';
import { Skeleton } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Helmet from 'react-helmet';
import {
  ADD_TO_CART,
  GET_PRODUCT,
  IS_IN_CART,
} from '../../graphql/client/queries';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 10,
  },
  price: {
    fontWeight: 'bold',
  },
  media: {
    height: 400,
  },
}));

export default function ProductDetails({ params }) {
  const classes = useStyles();
  const [addToCart] = useMutation(ADD_TO_CART);
  const [buttonText, setButtonText] = useState();
  const isServer = typeof window === 'undefined';
  let isInCart = 0;

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id: params.id },
  });

  if (!isServer) {
    const { data: isInCartData } = useQuery(IS_IN_CART, {
      variables: { id: params.id },
    });
    isInCart = isInCartData ? isInCartData.isInCart : isInCart;
  }

  if (error) {
    return <p>{JSON.stringify(error)}</p>;
  }

  if (loading) {
    return (
      <>
        <Breadcrumb to="/" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <Skeleton variant="rect" width="100%" height={300} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Grid container spacing={0}>
              <Grid item xs={8} sm={12}>
                <Skeleton variant="text" width={140} height={38} />
              </Grid>
              <Grid item xs={4} sm={12}>
                <Skeleton variant="text" width={100} height={38} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" width={240} height={58} />
            <Skeleton variant="text" width="100%" height={28} />
            <Skeleton variant="text" width="100%" height={28} />
            <Skeleton variant="text" width="100%" height={28} />
            <Skeleton variant="text" width="100%" height={28} />
            <Skeleton variant="text" width="100%" height={28} />
            <Skeleton variant="text" width="100%" height={28} />
          </Grid>
        </Grid>
      </>
    );
  }

  const { product } = data;

  if (!product) {
    return <div>No product</div>;
  }

  const price = Dinero({ amount: product.unit_price, currency: 'BRL' });

  const handleClick = e => {
    e.stopPropagation();
    addToCart({ variables: { item: product } });
    setButtonText('In Cart');
  };

  return (
    <Container>
      <Helmet>
        <title>{product.name}</title>
        <meta name="description" content={product.desc} />
      </Helmet>
      <Breadcrumb to="/" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <Paper>
            <CardMedia
              className={classes.media}
              image={product.img}
              title={product.name}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box padding={5}>
            <Grid container spacing={0}>
              <Grid item xs={8} sm={12}>
                <Typography variant="h5" className={classes.price}>
                  {price.toFormat('$0,0.00')}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={12}>
                <Button
                  size="small"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleClick}
                >
                  {buttonText || isInCart ? 'In Cart' : 'Add to Cart'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
          <Box padding={5} marginTop={5}>
            <Typography variant="h4" className={classes.title}>
              {product.name}
            </Typography>
            <Typography variant="body1" component="p">
              {product.desc}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

ProductDetails.propTypes = {
  params: PropTypes.object.isRequired,
};
