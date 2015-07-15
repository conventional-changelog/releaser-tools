var fs = require('fs');
var shell = require('shelljs');

shell.config.silent = true;
shell.rm('-rf', 'tmp');
shell.mkdir('tmp');
shell.cd('tmp');

shell.exec('git init');
fs.writeFileSync('test1', '');
shell.exec('git add --all && git commit -m"First commit"');
