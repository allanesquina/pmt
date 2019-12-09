/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Grid, Container, Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import ProductCard from '../../components/ProductCard/ProductCard';
import { GET_PRODUCTS } from '../../graphql/client/queries';

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 10,
  },
}));

export default function Home() {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return (
      <>
        <Skeleton variant="text" width={110} height={28} />
        <Grid container spacing={2}>
          {Array(10)
            .fill(null)
            .map(() => (
              <Grid
                key={`${Math.random(10000)}-${Date.now()}`}
                item
                xs={6}
                sm={3}
              >
                <Skeleton variant="rect" width="100%" height={178} />
                <Skeleton variant="text" width={140} height={28} />
                <Skeleton variant="text" width={110} height={28} />
              </Grid>
            ))}
        </Grid>
      </>
    );
  }

  const { products } = data;

  return (
    <Container>
      <>
        <Box padding={2}>
          <Typography variant="subtitle1" className={classes.title}>
            {products.length} products
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {products.map(p => (
            <Grid key={p.name} item xs={6} sm={3}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      </>
    </Container>
  );
}

Home.propTypes = {};
