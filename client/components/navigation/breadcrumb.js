
Template.breadcrumb.helpers({
  initial: function () {
    return this.items && this.items.slice(0, this.items.length-1);
  },
  last: function () {
    return this.items && this.items[this.items.length-1];
  },
});
