const output = document.createElement('div');
const _log = console.log;

output.setAttribute('contenteditable', 'true');
Object.assign(output.style, {
  position: 'fixed',
  bottom: '8px',
  right: '8px',
  padding: '16px',
  width: '25vw',
  height: '50vh',
  outline: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  fontFamily: 'monospace',
  whiteSpace: 'nowrap',
  opacity: '0.8',
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.5)',
  overflow: 'auto',
  zIndex: '2'
});

document.body.appendChild(output);

output.onkeydown = () => event.preventDefault();
output.onfocus = () => {
  Object.assign(output.style, {
    width: 'calc(100vw - (var(--gutter) * 4))',
    height: 'calc(100vh - var(--gutter))',
    backgroundColor: 'white',
    opacity: '1'
  });
};
output.onblur = () => {
  Object.assign(output.style, {
    width: '25vw',
    height: '50vh',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    opacity: '0.8'
  });
};

$$(output).on('swiperight', () => {
  output.blur();
});

window.onerror = function (message, source, lineno, colno, error) {
  const div = document.createElement('div');
  div.style.color = 'crimson';
  div.innerHTML += `${source.split('/').pop()} @ ${lineno}: ${message}`;
  output.appendChild(div);
};

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