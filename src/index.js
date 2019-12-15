process.stdin.setEncoding('utf8');

let enter;

process.stdin.on('readable', () => {
  enter = process.stdin.read();
  process.stdin.emit('end');
});


process.stdin.on('end', () => {
   process.stdout.write(`Перевернутый результат: ${enter.split('').reverse().join('')}\n`);
});
