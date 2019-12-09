import gql from 'graphql-tag';

export default gql`
  type ProductItem {
    product_id: ID!
    name: String
    unit_price: Int
    recip_id: Int
    desc: String
    img: String
    quantity: Int
  }

  type Cart {
    id: ID!
    items: [ProductItem]
    total: Int!
  }

  type Query {
    cart: Cart
    isInCart(id: ID!): Int!
  }

  type Mutation {
    addToCart(item: Product!): ProductItem!
    removeFromCart(product_id: Int!): ProductItem
    updateCartItem(product_id: Int!, quantity: Int!): ProductItem
  }
`;
