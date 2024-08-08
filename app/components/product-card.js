import Ember from 'ember';

export default Ember.Component.extend({
    cartService : Ember.inject.service('cart-service'),
    toastService : Ember.inject.service('toast-service'),


    isAdmin : Ember.computed('userInfo',function() {
        if(this.get('userInfo') !== null && this.get("userInfo.user_role") === 1) {
            return true;
        } else {
            return false;
        }
    }), 
    userInfo : null,

    sessionPresent : Ember.computed('userInfo', function() {
        // console.log(this.get('userInfo'), "product card page");
        if(this.get('userInfo') !== null && this.get('userInfo.m_status_code') !== 404) {
            return true; 
        } else {
            return false;
        }
    }),

    actions : {
        addToCart(productId) {
            let cartObj = {};
            console.log(this.get('userInfo.user_id'));
            let cartId = this.get('userInfo').user_id;
            if(cartId === null) {
                console.log("no user id");
            } else {    
                cartObj.cartId = cartId;
                cartObj.productId = productId;
                cartObj.quantity = 1;

                this.get('cartService').addToCart(cartObj).then(response => {
                    let type = 'success';
                    if(response.m_status_code === 409) {
                        type = "info"
                    } else if (response.m_status_code === 400) {
                        type = "error"
                    }
                    this.get("toastService").show(response.message, type)
                }).catch(error => {
                    console.log(error);
                    this.get("toastService").show(error.message ,"error")
                });
            }
        },

        detailsAction(){
            this.sendAction('showProductDetails')
        }
    }
});
