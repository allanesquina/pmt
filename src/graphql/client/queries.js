import gql from 'graphql-tag';

export const GET_CART_ITEMS = gql`
  query cart {
    cart @client {
      total
      items {
        product_id
        name
        unit_price
        recip_id
        desc
        img
        quantity
      }
    }
  }
`;

export const EMPTY_CART = gql`
  mutation emptyCart($n: String) {
    emptyCart(n: $n) @client
  }
`;

export const ADD_TO_CART = gql`
  mutation addToCart($item: Product!) {
    addToCart(item: $item) @client {
      product_id
      name
      unit_price
      recip_id
      desc
      img
    }
  }
`;

export const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    product(id: $id) {
      name
      unit_price
      img
      recip_id
      desc
      product_id
    }
  }
`;

export const IS_IN_CART = gql`
  query isInCart($id: ID!) {
    isInCart(id: $id) @client(always: true)
  }
`;

export const GET_PRODUCTS = gql`
  query products {
    products {
      name
      unit_price
      img
      recip_id
      desc
      product_id
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($product_id: Int!, $quantity: Int!) {
    updateCartItem(product_id: $product_id, quantity: $quantity) @client
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($product_id: Int!) {
    removeFromCart(product_id: $product_id) @client
  }
`;

export const CHECKOUT = gql`
  mutation Checkout($payload: PaymentPayload!) {
    checkout(payload: $payload) {
      status
      payment_details {
        total
        recipients {
          id
          amount
        }
      }
      items {
        product {
          product_id
          name
          unit_price
          recip_id
          desc
        }
        quantity
      }
    }
  }
`;
