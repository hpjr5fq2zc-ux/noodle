/* Noodle mini-runtime: renders the design-component template with Preact. */
(function () {
  var h = preact.h, render = preact.render;
  var tpl = document.getElementById('tpl').content;
  var roots = Array.prototype.filter.call(tpl.childNodes, function (n) { return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()); });

  function lookup(path, scopes) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var parts = path.split('.');
    var cur;
    for (var i = scopes.length - 1; i >= 0; i--) { if (scopes[i] && parts[0] in scopes[i]) { cur = scopes[i][parts[0]]; break; } }
    for (var j = 1; j < parts.length && cur != null; j++) cur = cur[parts[j]];
    return cur;
  }
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/, ANY = /\{\{\s*([^}]+?)\s*\}\}/g;
  function evalStr(v, scopes) {
    var m = v.match(WHOLE);
    if (m) return lookup(m[1], scopes);
    if (v.indexOf('{{') < 0) return v;
    return v.replace(ANY, function (_, p) { var r = lookup(p, scopes); return r == null ? '' : r; });
  }
  function walk(node, scopes) {
    if (node.nodeType === 3) { var tx = node.textContent; return tx.indexOf('{{') >= 0 ? String(evalStr(tx, scopes) == null ? '' : evalStr(tx, scopes)) : tx; }
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    if (tag === 'helmet') return null;
    if (tag === 'sc-if') {
      return evalStr(node.getAttribute('value') || '', scopes) ? kids(node, scopes) : null;
    }
    if (tag === 'sc-for') {
      var list = evalStr(node.getAttribute('list') || '', scopes) || [];
      var as = node.getAttribute('as') || 'item';
      var out = [];
      list.forEach(function (item, i) { var sc = {}; sc[as] = item; sc.$index = i; out.push.apply(out, kids(node, scopes.concat([sc]))); });
      return out;
    }
    var props = {};
    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a], name = at.name;
      if (name.indexOf('hint-') === 0) continue;
      var val = evalStr(at.value, scopes);
      if (name.indexOf('on') === 0) {
        if (typeof val !== 'function') continue;
        if (name === 'onchange' && tag === 'input') name = 'onInput';
        else name = 'on' + name.charAt(2).toUpperCase() + name.slice(3);
      }
      if (val === undefined || val === null) continue;
      props[name] = val;
    }
    return h.apply(null, [tag, props].concat(kids(node, scopes)));
  }
  function kids(node, scopes) {
    var out = [];
    node.childNodes.forEach(function (c) { var r = walk(c, scopes); if (Array.isArray(r)) out.push.apply(out, r); else if (r !== null && r !== '') out.push(r); });
    return out;
  }

  var comp, mounted = false, queued = false;
  window.DCLogic = function DCLogic(props) { this.props = props || {}; this.state = {}; };
  DCLogic.prototype.setState = function (u) {
    var patch = typeof u === 'function' ? u(this.state, this.props) : u;
    this.state = Object.assign({}, this.state, patch);
    schedule();
  };
  DCLogic.prototype.forceUpdate = function () { schedule(); };
  function schedule() { if (queued) return; queued = true; requestAnimationFrame(draw); }
  var stage = document.getElementById('stage');
  function draw() {
    queued = false;
    var vals = comp.renderVals();
    var tree = [];
    roots.forEach(function (n) { var r = walk(n, [vals]); if (Array.isArray(r)) tree.push.apply(tree, r); else if (r) tree.push(r); });
    render(h('div', { id: 'dc-root' }, tree), stage);
    if (!mounted) { mounted = true; if (comp.componentDidMount) comp.componentDidMount(); }
    else if (comp.componentDidUpdate) comp.componentDidUpdate();
  }
  window.bootNoodle = function (Component) { comp = new Component({}); window.__noodle = comp; draw(); };

  function fit() {
    var ls = window.innerWidth > window.innerHeight && window.innerHeight < 500;
    document.body.classList.toggle('ls', ls);
    if (ls) return;
    var s = Math.min(window.innerWidth / 390, window.innerHeight / 844);
    stage.style.transform = 'scale(' + s + ')';
    stage.style.left = Math.max(0, (window.innerWidth - 390 * s) / 2) + 'px';
  }
  window.addEventListener('resize', fit);window.addEventListener('orientationchange', function(){setTimeout(fit,200);});
  fit();
})();
