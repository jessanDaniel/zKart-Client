import Ember from 'ember';

export default Ember.Component.extend({
    
    filterBy:null,

    didInsertElement(){
        this._super(...arguments);
        this.element.value = this.get('filterBy') || ""
    },
    
    change(event) {
        const filterBy = event.target.value;

        this.get('onChange')(filterBy || "");
    }

});
