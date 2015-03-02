// uses simple:highlight.js for syntax highlight

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});