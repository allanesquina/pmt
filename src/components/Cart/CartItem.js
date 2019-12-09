import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Paper,
  Box,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import Dinero from 'dinero.js';
import { useMutation } from '@apollo/react-hooks';
import {
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
} from '../../graphql/client/queries';

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: 10,
  },
  gridBg: {
    backgroundColor: theme.palette.background.default,
  },
  media: {
    height: 70,
  },
}));

export default function CartItem({ product }) {
  const classes = useStyles();
  const price = Dinero({ amount: product.unit_price, currency: 'BRL' });
  const [updateCartItem] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const subTotal = Dinero({
    amount: product.quantity * product.unit_price,
    currency: 'BRL',
  });

  const handleSelect = e => {
    updateCartItem({
      variables: { product_id: product.product_id, quantity: e.target.value },
    });
  };

  const handleRemoveClick = () => {
    removeFromCart({
      variables: { product_id: product.product_id },
    });
  };

  const renderSelectOptions = q => {
    const out = [];
    for (let i = 1; i < q; i += 1) {
      out.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>,
      );
    }
    return out;
  };

  return (
    <Paper>
      <Box padding={2} margin={2}>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Typography variant="h6" className={classes.title}>
              {product.name}
            </Typography>
            <Typography variant="body2" className={classes.title}>
              {price.toFormat('$0,0.00')}
            </Typography>
            <FormControl fullWidth className={classes.formControl}>
              <Select
                id="select-quantity"
                className={classes.selectEmpty}
                value={product.quantity}
                onChange={handleSelect}
                variant="outlined"
              >
                {renderSelectOptions(100)}
              </Select>
              <FormHelperText>Quantity</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <Typography
              variant="body2"
              component="span"
              className={classes.title}
            >
              Subtotal
            </Typography>
            <Typography variant="h6" className={classes.title}>
              {subTotal.toFormat('$0,0.00')}
            </Typography>
          </Grid>
          <Grid item xs={1} alignItems="center" justify="center" container>
            <IconButton aria-label="delete" onClick={handleRemoveClick}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

CartItem.propTypes = {
  product: PropTypes.object.isRequired,
};
