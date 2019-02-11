function array(n) {
  var arr = [];
  for (var i = 0; i < n; i++) {
    arr.push(i);
  }
  return arr;
}

// basic Object.assign replacement for IE
function assign() {
  var dest = arguments[0] || {};
  for (var i = 0; i < arguments.length; i++) {
    var src = arguments[i];
    for (var k in src) {
      if (src.hasOwnProperty(k)) {
        dest[k] = src[k];
      }
    }
  }
  return dest;
}

function openTag(t, leaveOpen) {
  leaveOpen = leaveOpen === true;
  return "<" + t + (leaveOpen ? "" : ">");
}

function closeTag(t) {
  return "</" + t + ">";
}

function addToVariableWidthDivs(element, opts) {
  opts = assign({
    appendTo: null,
    numberOfDivs: 1,
    appendTo: document.body,
    titleElement: "h2",
  }, opts);
  array(opts.numberOfDivs)
    .map(function(_, i) {
      // e.g. 100 / 1 => 100%
      // e.g. 100 / 2 => 50%
      // e.g. 100 / 3 => 33%
      return (100 / (i + 1)).toFixed(2) + "%";;
    })
    .forEach(function(width) {
      opts.appendTo.appendChild(document.createElement("br"));
      var div = document.createElement("div");
      div.style.width = width;
      div.innerHTML = openTag(opts.titleElement) + "At " + width + " width" + closeTag(opts.titleElement);
      div.appendChild(element.cloneNode(true));
      opts.appendTo.appendChild(div);
    });
}

function appendOuterHTMLOf(element, appendTo) {
  appendTo = appendTo || document.body;
  var pre = document.createElement("pre");
  // https://stackoverflow.com/a/44943988/319878
  pre.innerText = new XMLSerializer().serializeToString(element);
  appendTo.appendChild(pre);
}

function parentElement(element) {
  // IE doesn't have parentElement for SVG
  return element.parentElement || element.parentNode;
}
