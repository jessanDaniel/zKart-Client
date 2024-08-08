import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('landing', {path : "/zKartApp/products"}, function() {
    this.route('details', {path : "/:productId"});
  });
  this.route('auth', {path :"/zKartApp/auth"});
  this.route('dashboard',{path : "/zKartApp/admin/dashboard"});
  this.route('cart', {path : "/zKartApp/cart/:cartId"});
  this.route('order',{path : "/zKartApp/user/:userId/order"});
});

export default Router;
