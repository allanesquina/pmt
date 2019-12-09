import {
  getProductById,
  getProducts,
  createTransactionPayloadObject,
  checkout,
  normalizePaymentResponseObject,
} from './controller';

export default {
  Query: {
    product: (_, { id }) => {
      return getProductById(id);
    },
    products: () => {
      return getProducts();
    },
  },
  Mutation: {
    checkout: (_, { payload }) => {
      const payloadObject = createTransactionPayloadObject(payload);
      return checkout(payloadObject).then(result => {
        return normalizePaymentResponseObject(result);
      });
    },
  },
};
