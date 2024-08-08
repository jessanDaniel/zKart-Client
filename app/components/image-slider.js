import Ember from 'ember';

export default Ember.Component.extend({
  currentIndex: 0,

  slides: [
    { image: 'assets/b-laptop.jpg', alt: 'Image 1', caption: 'Caption for Image 1' },
    { image: 'assets/b-mobile.jpg', alt: 'Image 2', caption: 'Caption for Image 2' },
    { image: 'assets/b-tab.jpg', alt: 'Image 3', caption: 'Caption for Image 3' },
  ],

  slideCount: Ember.computed('slides', function() {
    return this.get('slides').length;
  }),

  slideWidth: Ember.computed(function() {
    return 100; // 100% width of each slide
  }),

  slideStyle: Ember.computed('currentIndex', function() {
    let slideWidth = this.get('slideWidth');
    let currentIndex = this.get('currentIndex');
    let translateX = -currentIndex * slideWidth;
    return Ember.String.htmlSafe(`transform: translateX(${translateX}%);`);
  }),

  actions: {
    changeSlide(n) {
      let currentIndex = this.get('currentIndex');
      let slideCount = this.get('slideCount');
      let newIndex = currentIndex + n;

      if (newIndex >= slideCount) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = slideCount - 1;
      }

      this.set('currentIndex', newIndex);
    }
  }
});
