import Ember from 'ember';

export default Ember.Controller.extend({
    cartService : Ember.inject.service("cart-service"),
    toastService : Ember.inject.service("toast-service"),
    
    userInfo : null,
    product : null,
    productQuantity : 1,

    init() {
        this._super(...arguments);
    },
    
    isAdmin : Ember.computed('userInfo',function() {
        console.log("isAdmin computed property:", this.get('userInfo').user_role);
        if(this.get('userInfo') !== null && this.get("userInfo.user_role") === 1) {
            return true;
        } else {
            return false;
        }
    }),

    isSessionPresent : Ember.computed('userInfo',function() {
        console.log(this.get('userInfo'), "details page");
        if(this.get('userInfo') !== null && this.get('userInfo.m_status_code') !== 404) {
            return true; 
        } else {
            return false;
        }
    }),
    
    // init(){
    //     console.log(this.get('userInfo'));
    // },




    actions : {
        setUserNull() {
            this.set('userInfo', null);
        },

        backToLanding() {
            this.transitionToRoute("landing");
        },

        incrementStock(){
            if(this.get('productQuantity') < this.get("product.stock")) {
                this.incrementProperty('productQuantity');
            }
        },
        decrementStock(){
            if(this.get('productQuantity') > 1) {
                this.decrementProperty('productQuantity');
            }
        },

        addToCart(productId) {
            let cartObj = {};
            let cartId = this.get('userInfo.user_id');
            if(cartId === null) {
                console.log("no user id");
            } else {    
                cartObj.cartId = cartId;
                cartObj.productId = productId;
                cartObj.quantity = this.get('productQuantity');

                this.get('cartService').addToCart(cartObj).then(response => {
                    let type = 'success';
                    if(response.m_status_code === 409) {
                        type = "info"
                    } else if (response.m_status_code === 400) {
                        type = "error"
                    }
                    this.get("toastService").show(response.message, type);
                }).catch(error => {
                    console.log(error);
                    this.get("toastService").show(error.message ,"error")
                });
            }
        }

    }

});
