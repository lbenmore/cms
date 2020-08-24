const output = document.createElement('div');
Object.assign(output.style, {
  position: 'fixed',
  top: '8px',
  right: '8px',
  padding: '16px',
  width: '25vw',
  height: '50vh',
  backgroundColor: 'rgba(128, 128, 128, 0.5)',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  opacity: '0.8',
  overflow: 'auto'
});
document.body.appendChild(output);

window.onerror = function (message, source, lineno, colno, error) {
  const div = document.createElement('div');
  div.style.color = 'crimson';
  div.innerHTML += `${source.split('/').pop()} @ ${lineno}: ${message}`;
  output.appendChild(div);
};

const _log = console.log;
console.log = function () {
  const args = Array.from(arguments);
  const result = []
  for (const arg of args) {
    if (typeof arg === 'object') result.push(JSON.stringify(arg));
    else result.push(arg);
  }
  output.innerHTML += `<div>Log: ${result.join(' ')}</div>`;
  _log(arguments);
}