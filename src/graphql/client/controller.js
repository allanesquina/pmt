export const calculateTotal = cart => {
  return cart.reduce((t, p) => {
    let buff = t;
    buff += p.unit_price * p.quantity;
    return buff;
  }, 0);
};

export const writeCart = (items, total, cache) => {
  cache.writeData({
    data: { cart: { items, total, __typename: 'Cart', id: 0 } },
  });
};
