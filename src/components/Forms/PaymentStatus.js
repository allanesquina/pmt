import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Paper, Box, Container } from '@material-ui/core';
import Dinero from 'dinero.js';
import PropTypes from 'prop-types';

export default function PaymentStatus({ items, status, payment_details }) {
  return (
    <Container>
      <Paper>
        <Box padding={5} margin={5}>
          <Typography gutterBottom variant="h6" component="h2">
            Status: {status}
          </Typography>
        </Box>
        {items && (
          <Box padding={5} margin={5}>
            <Typography gutterBottom variant="h5" component="h2">
              Items
            </Typography>
            {items.map(item => (
              <Paper key={item.product.product_id}>
                <Box padding={2}>
                  <Typography gutterBottom variant="subtitle1" component="h2">
                    Name: <b>{item.product.name}</b>
                    <br />
                    unit_price:{' '}
                    <b>
                      {Dinero({
                        amount: item.product.unit_price,
                        currency: 'BRL',
                      }).toFormat('$0,0.00')}
                    </b>
                    <br />
                    quantity: <b>{item.quantity}</b>
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
        {payment_details && (
          <>
            <Box padding={5} margin={5}>
              <Typography gutterBottom variant="h5" component="h2">
                Payment Details
              </Typography>
              <Typography gutterBottom variant="h6" component="h2">
                Recipients
              </Typography>
              {payment_details.recipients.map(recipient => (
                <Paper key={recipient.id}>
                  <Box padding={2}>
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      Id: <b>{recipient.id}</b>
                      <br />
                      total:{' '}
                      <b>
                        {Dinero({
                          amount: recipient.amount,
                          currency: 'BRL',
                        }).toFormat('$0,0.00')}
                      </b>
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
            <Box padding={5} margin={5}>
              <Typography gutterBottom variant="h6" component="h2">
                Total:{' '}
                {Dinero({
                  amount: payment_details.total,
                  currency: 'BRL',
                }).toFormat('$0,0.00')}
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

PaymentStatus.propTypes = {
  items: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  payment_details: PropTypes.object.isRequired,
};
