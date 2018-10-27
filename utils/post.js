var open = require('open');
var _str, fs, mkdirp, moment, prompt, yaml;

prompt = require('prompt');

mkdirp = require('mkdirp');

moment = require('moment');

_str = require('underscore.string');

yaml = require('js-yaml');

fs = require('fs');

prompt.start();

prompt.get(['title', 'brief', 'tags (separate with commas)'], function(err, result) {
  var dir, frontmatter, postFileStr;
  dir = "./pages/posts/" + (moment().format('YYYY-MM-DD')) + "---" + (_str.slugify(result.title));
  mkdirp.sync(dir);
  postFileStr = "---\n";
  frontmatter = {
    title: result.title,
    date: moment().format('YYYY-MM-DD'),
    layout: 'post',
    brief: result['brief'],
    tags: result['tags (separate with commas)'].split(',')
    // path: `/${result.title}/`
  };
  postFileStr += yaml.safeDump(frontmatter);
  postFileStr += "---\n";
  fs.writeFileSync(dir + "/index.md", postFileStr, {
    encoding: 'utf-8'
  });
  console.log(`\n${dir}`); // eslint-disable-line
  open(`${dir}/index.md`);
  return console.log(dir);
});
