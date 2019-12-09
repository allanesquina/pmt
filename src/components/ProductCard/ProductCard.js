import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dinero from 'dinero.js';
import { useMutation, useQuery } from '@apollo/react-hooks';
import Link from '../Link/Link';
import theme from '../../theme';
import { ADD_TO_CART, IS_IN_CART } from '../../graphql/client/queries';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.common.black,
  },
  recipIdBox: {
    wordBreak: 'break-all',
    color: '#999',
  },
});

export default function ProductCard({ product }) {
  const classes = useStyles();
  const price = Dinero({ amount: product.unit_price, currency: 'BRL' });
  const [addToCart] = useMutation(ADD_TO_CART);
  const [buttonText, setButtonText] = useState();
  const isServer = typeof window === 'undefined';
  let isInCart = 0;

  const handleClick = () => {
    addToCart({ variables: { item: product } });
    setButtonText('In Cart');
  };

  if (!isServer) {
    const { data: isInCartData } = useQuery(IS_IN_CART, {
      variables: { id: product.product_id },
    });
    isInCart = isInCartData ? isInCartData.isInCart : isInCart;
  }

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <Link className={classes.link} to={`/product/${product.product_id}`}>
          <CardMedia
            className={classes.media}
            image={product.img}
            title={product.name}
          />
          <CardContent>
            <Typography gutterBottom variant="subtitle1" component="h2">
              {product.name}
            </Typography>
            <Typography gutterBottom variant="h6" component="h2">
              {price.toFormat('$0,0.00')}
            </Typography>
            <Typography
              className={classes.recipIdBox}
              gutterBottom
              variant="body2"
              component="span"
            >
              recip_id: {product.recip_id}
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" fullWidth onClick={handleClick}>
          {buttonText || isInCart ? 'In Cart' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
