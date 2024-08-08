import Ember from 'ember';

export default Ember.Route.extend({
    loading: Ember.inject.service("loading"),
    orderService : Ember.inject.service("order-service"),
    userId : null,
    userSession : Ember.inject.service("user-session-service"),
    routing : Ember.inject.service("-routing"),


    beforeModel(){
        let userInfo = this.get("userSession").fetchUserInfo().then(response=>response);
        if(userInfo !== null && userInfo.m_status_code === 404) {
            this.get("routing").transitionTo("auth"); 
        }

    },

    model(params) {
        this.get("loading").show();
        this.set("userId",params.userId);
        return this.get("orderService").getOrderItems(this.get("userId")).finally(()=>{
            this.get("loading").hide();
        })
    },

    afterModel(model) {
        let orderHistory = model.orderHistory;
        let orderTotals = {};
    
        for (let orderId in orderHistory) {
          if (orderHistory.hasOwnProperty(orderId)) {
            let products = orderHistory[orderId];
            let total = products.reduce((sum, product) => sum + product.price, 0);
            orderTotals[orderId] = total;
          }
        }
    
        model.orderTotals = orderTotals;
      },

    actions :{
        refreshModel(){
            this.refresh();
        }
    }

    
});
