import Ember from 'ember';
import $ from "jquery";
import config from "z-kart/config/environment";


export default Ember.Controller.extend({
  cartService: Ember.inject.service('cart-service'),
  loadingService : Ember.inject.service("loading"),
    
  userId : null,
  total : 0,
  cartItems : null,



  actions: {
    incrementQuantity(cartItem) {
    let newQuantity = cartItem.quantity+1;
    let itemId = cartItem.product_id;
    let cartObj = {}
    cartObj.productId = itemId;
    cartObj.quantity = newQuantity;
      this.get("loadingService").show();  
      this.get('cartService').updateCartItem(this.get('userId'),cartObj)
        .finally(()=>{
            this.get("loadingService").hide();
            this.send('refreshModel');
        })
    },

    decrementQuantity(cartItem) {
      let newQuantity = cartItem.quantity - 1;
      if(newQuantity == 0) {
        newQuantity = 1;
      }
      let itemId = cartItem.product_id;
      let cartObj = {}
      cartObj.productId = itemId;
      cartObj.quantity = newQuantity
      if (newQuantity > 0) {
        this.get("loadingService").show();
        this.get('cartService').updateCartItem(this.get('userId'),cartObj)
          .finally(() => {
            this.get("loadingService").hide();
            this.send('refreshModel');
        });
      }
    },

    deleteCartItem(cartItem) {
        this.get("loadingService").show();
      this.get('cartService').deleteCartItem(this.get('userId'), cartItem.product_id)
        .finally(() => {
            this.get("loadingService").hide();
            this.send('refreshModel');
        });
    },

    routeToLanding(){
        this.transitionToRoute("landing");
    },

    placeOrder(){
        console.log("inside palce order");
        let userId = this.get("userId")
        $.ajax({
            url:`${config.API_URL}/user/${userId}/order`,
            method : "POST",
            data :JSON.stringify({"useCoupon":true}),
            contentType : "application/json",
            success : (response) => {
                console.log(response);
                this.transitionToRoute("order",this.get("userId"));
            },

            error : (error) => {
                console.log(error);
            }
        })
        // this.transitionToRoute("order",this.get("userId"));
    }
  }
});
