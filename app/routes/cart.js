import Ember from 'ember';

export default Ember.Route.extend({
    cartService: Ember.inject.service("cart-service"),
    userSession : Ember.inject.service("user-session-service"),
    routing : Ember.inject.service("-routing"),
    loadingService : Ember.inject.service("loading"),

    userId: null,
    total : null,
    cartItems : null,

    beforeModel(){
        let userInfo = this.get("userSession").fetchUserInfo().then(response=>response);
        if(userInfo !== null && userInfo.m_status_code === 404) {
            this.get("routing").transitionTo("auth"); 
        }

    },

    model(params) {
        this.set("userId", params.cartId);
        this.get("loadingService").show();
        return this.get('cartService').getCartItems(params.cartId).finally(() => {
            this.get("loadingService").hide();
        });
    },

    afterModel(cartData) {

        if (!cartData || !Array.isArray(cartData.cart_items_array)) {
            console.error('Invalid cart data:', cartData);
            return;
        }

         let cartItems = cartData.cart_items_array;

         cartItems.forEach(item => {
            Ember.set(item, 'subtotal', item.price*item.quantity);
         });

         this.set("cartItems", cartItems);

         let total = cartItems.reduce((acc, item)=> acc + item.subtotal,0);

         this.set("total",total);
         console.log(this.get("total"));

         Ember.set(cartData,"total", total);

    },

    setupController(controller, model) {
        this._super(controller, model);
        controller.set('userId', this.get('userId'));
        controller.set("cartItems", this.get("cartItems"));
        controller.set("total", this.get("total"));       
    },

    actions : {
        refreshModel() {
            this.refresh();
        }
    }

});
