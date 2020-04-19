const { fs, vol }  = require('memfs')

// console.log('-----fs', fs)
// fs.writeFileSync('/hello.txt', 'World!');
// fs.readFileSync('/hello.txt', 'utf8'); // World!

// fs.writeFileSync('/test2.txt', `console.log`)
const script = process.argv[3]
module.exports = eval(script)
// console.log('-------test', process.argv[3])

// console.log('-------test', fs.readFileSync('/test2.txt', 'utf8'))
// console.log('-------test', vol.readFileSync('/Users/surmon/Projects/JavaScript/NPM/vuniversal/.vun/server.js', 'utf8'))