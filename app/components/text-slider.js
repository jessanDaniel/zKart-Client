import Ember from 'ember';

export default Ember.Component.extend({
  currentTextIndex: 0,

  textSlides: [
    { caption: "Don't worry we got your electronic needs" },
    { caption: "We have the devices to occupy your desk" },
    { caption: "Are you still waiting ?, go ahead just signup" },
  ],

  textSlideCount: Ember.computed('textSlides', function() {
    return this.get('textSlides').length;
  }),

  didInsertElement() {
    this._super(...arguments);
    this.showTextSlides();
  },

  showTextSlides() {
    Ember.run.later(this, function() {
      let newIndex = this.get('currentTextIndex') + 1;
      if (newIndex >= this.get('textSlides').length) {
        newIndex = 0;
      }
      this.set('currentTextIndex', newIndex);
      this.showTextSlides();
    }, 3000); 
  },

  actions: {
    goToTextSlide(index) {
      this.set('currentTextIndex', index);
    }
  }
});
