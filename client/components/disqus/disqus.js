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
var disqus_shortname = 'anticodersblog';

DISQUS_LOADER = function() {
  var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
  dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
};