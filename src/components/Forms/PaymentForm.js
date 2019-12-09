import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import useForm from 'react-hook-form';
import { Button, Chip, Box, CircularProgress, Paper } from '@material-ui/core';
import CardValidator from 'card-validator';
import MaskedInput from 'react-text-mask';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  GET_CART_ITEMS,
  CHECKOUT,
  EMPTY_CART,
} from '../../graphql/client/queries';
import PaymentStatus from './PaymentStatus';

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/[0-9]/, /[0-9]/, '/', /[1-9]/, /[0-9]/]}
      showMask={false}
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

export default function PaymentForm() {
  const isServer = typeof window === 'undefined';
  let cart = {};
  const {
    handleSubmit,
    register,
    errors,
    setValue,
    triggerValidation,
  } = useForm();
  const [cardBrand, setCardBrand] = useState('');
  const [
    checkout,
    { loading: checkoutLoading, data: checkoutResult },
  ] = useMutation(CHECKOUT);
  const [emptyCart] = useMutation(EMPTY_CART);
  const [cvv, setCvv] = useState({ name: 'CVV', size: 3 });
  const [expDateValues, setExpDateValues] = useState({
    textmask: '',
    error: false,
  });

  useEffect(() => {
    register({ name: 'expDate' }, { required: true });
    if (checkoutResult) {
      emptyCart();
    }
  }, [register, checkoutResult]);

  const validateExpDate = inDate => {
    const date = inDate.replace(/_/g, '');
    const today = new Date();
    const expDate = new Date();
    const exMonth = parseInt(date.split('/')[0]);
    const exYear = parseInt(date.split('/')[1]);

    setValue('expDate', undefined);

    expDate.setFullYear(
      parseInt(
        today
          .getFullYear()
          .toString()
          .substr(0, 2) + exYear,
        0,
      ),
      exMonth,
      1,
    );

    if (exMonth > 12 || exMonth <= 0) {
      return false;
    }

    if (expDate < today) {
      return false;
    }

    setValue('expDate', date);
    return true;
  };

  const handleExpDateChange = event => {
    const {
      target: { value },
    } = event;

    setExpDateValues({
      ...expDateValues,
      textmask: value,
      error: !validateExpDate(value),
    });

    triggerValidation();
  };

  if (!isServer) {
    const { error, data } = useQuery(GET_CART_ITEMS);
    cart = data.cart;

    if (error) {
      return <p>{error}</p>;
    }
  }

  const onSubmit = values => {
    const payload = {
      card_number: values.cardNumber,
      card_holder_name: values.cardName,
      card_expiration_date: values.expDate.replace('/', ''),
      card_cvv: values.cvv,
      amount: cart.total,
      items: cart.items.map(i => ({ id: i.product_id, quantity: i.quantity })),
    };

    checkout({ variables: { payload } });
  };

  if (checkoutLoading) {
    return (
      <Box
        minHeight={500}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
        <Typography variant="h5" gutterBottom>
          <p>Processing</p>
        </Typography>
      </Box>
    );
  }

  if (checkoutResult) {
    return <PaymentStatus {...checkoutResult.checkout} />;
  }

  return (
    <Paper>
      <Box padding={5}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography variant="h6" gutterBottom>
            Credit Card Information
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <TextField
                id="cardName"
                name="cardName"
                label="Name on card"
                variant="outlined"
                fullWidth
                error={!!errors.cardName}
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
              />
            </Grid>
            <Grid item xs={12} container justify="space-around" md={6}>
              <Grid item xs={8}>
                <TextField
                  error={!!errors.cardNumber}
                  inputRef={register({
                    required: true,
                    validate: v => {
                      const card = CardValidator.number(v);
                      if (card.card && card.card.type) {
                        setCardBrand(card.card.niceType);
                      }
                      return card.isValid;
                    },
                  })}
                  onChange={e => {
                    const card = CardValidator.number(e.target.value);
                    if (card.card && card.card.type) {
                      setCardBrand(card.card.niceType);
                      setCvv(card.card.code);
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  type="number"
                  required
                  id="cardNumber"
                  name="cardNumber"
                  label="Card number"
                />
              </Grid>
              <Grid item xs={4} justify="center" alignItems="center" container>
                {cardBrand && <Chip color="primary" label={cardBrand} />}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={!!errors.expDate}
                required
                id="expDate"
                name="expDate"
                label="Expiry date"
                fullWidth
                value={expDateValues.textmask}
                onChange={handleExpDateChange}
                variant="outlined"
                InputProps={{
                  inputComponent: TextMaskCustom,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={!!errors.cvv}
                inputRef={register({
                  required: true,
                  pattern: /^[0-9]+$/i,
                  maxLength: cvv.size,
                  minLength: cvv.size,
                })}
                type="number"
                required
                id="cvv"
                variant="outlined"
                name="cvv"
                label={cvv.name}
                helperText={`Last ${cvv.size} digits on signature strip`}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Box margin={15}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                >
                  Proceed
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  );
}
