import { gql } from 'apollo-server-express';

export default gql`
  type Product {
    product_id: ID!
    name: String
    unit_price: Int
    recip_id: ID!
    desc: String
    img: String
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    checkout(payload: PaymentPayload!): PaymentResponse
  }

  input ItemIn {
    id: ID!
    quantity: Int!
  }

  type Item {
    product: Product!
    quantity: Int!
  }

  type Recipient {
    id: ID!
    amount: Int!
  }

  type PaymentResponse {
    status: String!
    items: [Item]
    payment_details: PaymentDetails
  }

  type PaymentDetails {
    total: Int!
    recipients: [Recipient]!
  }

  input PaymentPayload {
    amount: Int!
    card_number: String!
    card_holder_name: String!
    card_expiration_date: String!
    card_cvv: String!
    items: [ItemIn]
  }
`;
