import { calculateTotal, writeCart } from './controller';
import { GET_CART_ITEMS } from './queries';

export default {
  Product: {
    isInCart: (_, vars, { cache }) => {
      const {
        cart: { items },
      } = cache.readQuery({ query: GET_CART_ITEMS });

      // looking for item in cart
      const foundItem = items.filter(p => p.product_id === _.product_id)[0];

      return foundItem ? 1 : 0;
    },
  },
  Query: {
    isInCart: (_, vars, { cache }) => {
      const { id } = vars;
      const {
        cart: { items },
      } = cache.readQuery({ query: GET_CART_ITEMS });

      // looking for item in cart
      const foundItem = items.filter(p => p.product_id === id)[0];

      return foundItem ? 1 : 0;
    },
    cart: (_, variables, { cache }) => {
      const { cart } = cache.readQuery({ query: GET_CART_ITEMS });
      return cart;
    },
  },
  Mutation: {
    emptyCart: (_, variables, { cache }) => {
      writeCart([], 0, cache);
    },
    addToCart: (_, variables, { cache }) => {
      const {
        cart: { items },
      } = cache.readQuery({ query: GET_CART_ITEMS });
      const { item } = variables;

      // looking for item in cart
      const foundItem = items.filter(p => p.product_id === item.product_id)[0];

      if (!foundItem) {
        item.quantity = 1;
        const newCartItems = [...items, item];
        const total = calculateTotal(newCartItems);
        writeCart(newCartItems, total, cache);
      }
    },
    updateCartItem: (_, { product_id, quantity }, { cache }) => {
      const {
        cart: { items },
      } = cache.readQuery({ query: GET_CART_ITEMS });

      // looking for item in cart
      const newCartItems = items.map(product => {
        const p = product;
        if (p.product_id === product_id) {
          p.quantity = quantity;
        }
        return p;
      });

      const total = calculateTotal(newCartItems);
      writeCart(newCartItems, total, cache);
    },
    removeFromCart: (_, { product_id }, { cache }) => {
      const { cart } = cache.readQuery({ query: GET_CART_ITEMS });

      // looking for item in cart
      const newCartItems = cart.items.filter(p => p.product_id !== product_id);
      const total = calculateTotal(newCartItems);
      writeCart(newCartItems, total, cache);
    },
  },
};
