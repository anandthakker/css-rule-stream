
var through = require('through2');

// object mode transform stream takes tokenized css and yields complete,
// parseable rules or at-rules as strings.
module.exports = function match() {
  var current = null, depth = 0;
  function write(token, enc, next) {
    var type = token[0], buf = token[1];
    if(depth === 0 && current) {
      this.push({content: Buffer.concat(current).toString()});
      current = null;
      return next();
    }
    if(('rule_start' === type || 'atrule_start' === type))
      depth++;
    if(depth > 0 && !current)
      current = [];
    if('rule_end' === type || 'atrule_end' === type)
      depth--;
    if(current) current.push(buf);
    
    next();
  }
  
  function end(next) {
    if(current) this.push({content: Buffer.concat(current).toString()});
    this.push(null);
    next();
  }
  return through.obj(write, end);
}
