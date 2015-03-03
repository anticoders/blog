// uses chuangbo:marked as markdown replacement & simple:highlight.js for syntax highlight

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});