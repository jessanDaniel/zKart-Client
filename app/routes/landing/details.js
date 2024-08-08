import Ember from 'ember';

export default Ember.Route.extend({
    productService : Ember.inject.service("product-service"),
    templateName :"landing/details",
    model(params) {
        return this.get('productService').fetchProductDetails(params.productId);
    },

    setupController(controller, model){
        this._super(controller, model);
        let landingController = this.controllerFor('landing');
        let userInfo = landingController.get('userInfo');
        console.log("inside details route..", model);
        controller.set('userInfo', userInfo);
        controller.set('product', model.product);
    },

    actions : {
        willTransition(transition) {
            let landingController = this.controllerFor('landing');
            landingController.set('productsView', true);
        }
    }
});
