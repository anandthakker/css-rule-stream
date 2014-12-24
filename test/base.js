
var fs = require('fs'),
  test = require('tape'),
  through = require('through2'),
  rules = require('../');
  

test('works', function(t) {
  var expected = [
    {"content":"div {\n  background: red;\n}"},
    {"content":".cls {\n  color: green;\n}"},
    {"content":"#id {\n  font-size: 10px;\n}"},
    {"content":"@media screen and (min-width: 1000px) {\n  a {\n    text-decoration: underline;\n  }\n}"},
    {"content":"a:hover {\n  font-weight: bold;  \n}"},
    {"content":"section \n\n\n{\n  margin: 0;\n  /* comment wthin a rule */\n  padding: 5px;\n}"},
    {"content":"body > * {\n  \n}"}
  ]
  
  t.plan(expected.length + 1);
  
  var rs = rules();
  rs.pipe(through.obj(function(chunk, enc, next) {
    t.same(chunk, expected.shift());
    next();
  },
  function(next) {
    t.ok(true);
    next();
  }));
  
  fs.createReadStream(__dirname + '/gauntlet.css').pipe(rs);
  
})
