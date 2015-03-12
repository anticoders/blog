Template.disqus.rendered = function () {
  this.isDisqusLoaded = new ReactiveVar(false);
  if (this.isDisqusLoaded.get() !== true) {
    DISQUS_LOADER();
    this.isDisqusLoaded.set(true);
  }
  if (typeof(DISQUS) !== "undefined") {
    DISQUS.reset({
      reload: true,
      config: function () {
      }
    });
  }
  //var parentData = Template.parentData(1);
  //window.disqus_title = parentData.title;
};

DISQUS_LOADER = function() {
  var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
  dsq.src = '//' + 'anticodersblog' + '.disqus.com/embed.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
};