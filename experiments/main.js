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

function getElementFromStringOrElement(it) {
  if (typeof it === "string") {
    return document.querySelector(it);
  }
  return it;
}

function addToVariableWidthDivs(element, opts) {
  opts = assign({
    numberOfDivs: 1,
    appendTo: document.body,
    titleElement: "h2",
  }, opts);
  opts.appendTo = getElementFromStringOrElement(opts.appendTo);
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

function getElementSource(element) {
  // https://stackoverflow.com/a/44943988/319878
  return new XMLSerializer().serializeToString(element);
}

function appendOuterHTMLOf(element, opts) {
  opts = assign({
    appendTo: document.body,
    format: false,
  }, opts);

  opts.appendTo = getElementFromStringOrElement(opts.appendTo);

  var markup = getElementSource(element);
  if (opts.format) {
    markup = markup.replace(/>/g, ">\n");
  }

  if (opts.appendTo.tagName === "TEXTAREA") {
    opts.appendTo.value = markup;
  } else {
    var pre = document.createElement("pre");
    pre.innerText = markup;
    var div = document.createElement("div");
    div.className = "source-container";
    div.style.overflow = "auto";
    div.appendChild(pre);
    opts.appendTo.appendChild(div);
  }
}

function parentElement(element) {
  // IE doesn't have parentElement for SVG
  return element.parentElement || element.parentNode;
}
