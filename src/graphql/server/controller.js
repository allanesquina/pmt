import pagarme from 'pagarme';
import productList from '../../data/products';
import userInfo from '../../data/userInfo';
import config from '../../config';

export const getProductById = id => {
  return productList.filter(p => p.product_id === id)[0];
};

export const getProducts = () => {
  return productList;
};

export const populateItems = (items, full = false) => {
  return items.map(item => {
    const p = getProductById(item.id);
    if (full) {
      return {
        product: p,
        quantity: item.quantity,
      };
    }

    return {
      id: p.product_id,
      title: p.name,
      unit_price: p.unit_price,
      quantity: item.quantity,
      tangible: true,
      recipient_id: p.recip_id,
    };
  });
};

export const calculateSplitRules = items => {
  const recipients = {};
  const {
    pagarmePlatformPercentage,
    pagarmeClientPercentage,
    pagarmeRecipientIdPlatform,
  } = config;

  items.forEach(item => {
    const subtotal = item.quantity * item.unit_price;
    const recip_amount = (subtotal / 100) * parseInt(pagarmeClientPercentage);
    const platform_amount =
      (subtotal / 100) * parseInt(pagarmePlatformPercentage);

    recipients[item.recipient_id] = recipients[item.recipient_id]
      ? recipients[item.recipient_id] + recip_amount
      : recip_amount;

    recipients[pagarmeRecipientIdPlatform] = recipients[
      pagarmeRecipientIdPlatform
    ]
      ? recipients[pagarmeRecipientIdPlatform] + platform_amount
      : platform_amount;
  });

  return Object.keys(recipients).map(id => ({
    recipient_id: id,
    amount: recipients[id],
    liable: true,
    charge_processing_fee: id !== pagarmeRecipientIdPlatform,
  }));
};

export const createTransactionPayloadObject = payload => {
  const newPayload = payload;
  const populatedItems = populateItems(payload.items);
  const splitRules = calculateSplitRules(populatedItems);

  newPayload.items = populatedItems.map(item => {
    const out = item;
    delete out.recipient_id;
    return out;
  });

  return {
    ...newPayload,
    ...userInfo,
    split_rules: splitRules,
  };
};

export const normalizePaymentResponseObject = response => {
  const splitRules = response.split_rules || [];
  const items = response.items || [];
  const populatedItems = populateItems(items, true);

  return {
    items: populatedItems,
    status: response.status,
    payment_details: {
      total: response.amount,
      recipients: splitRules.map(r => ({
        id: r.recipient_id,
        amount: r.amount,
      })),
    },
  };
};

export const checkout = payload => {
  const { pagarmeApiKey } = config;
  return pagarme.client
    .connect({ api_key: pagarmeApiKey })
    .then(client =>
      client.transactions
        .create(payload)
        .then(result => result)
        .catch(err => console.error(JSON.stringify(err))),
    )
    .catch(err => console.error(JSON.stringify(err)));
};
