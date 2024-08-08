// app/helpers/calculate-total.js

import Ember from 'ember';

export function calculateTotal([products]) {
  return products.reduce((sum, product) => sum + product.price, 0);
}

export default Ember.Helper.helper(calculateTotal);
