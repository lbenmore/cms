const output = document.createElement('div');
const _log = console.log;

output.setAttribute('contenteditable', 'true');
Object.assign(output.style, {
  position: 'fixed',
  top: '8px',
  left: `${innerWidth - (innerWidth / 4) - 8}px`,
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
  zIndex: '999'
});

document.body.appendChild(output);

output.dragEnd = (isMobile, dragBind) => {
  const moveEvent = isMobile ? 'touchmove' : 'mousemove';
  removeEventListener(moveEvent, dragBind);
  
  output.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.5)';
};

output.drag = isMobile => {
  const x = isMobile ? event.changedTouches[0].clientX : event.clientX;
  const y = isMobile ? event.changedTouches[0].clientY : event.clientY;
  // const offsetX = isMobile ? event.changedTouches[0].layerX : event.layerX;
  // const offsetY = isMobile ? event.changedTouches[0].layerY : event.layerY;
  
  Object.assign(output.style, {
    // top: `${y - offsetY}px`,
    // left: `${x - offsetX}px`
    top: `${y}px`,
    left: `${x}px`
  });
};

output.dragStart = isMobile => {
  const moveEvent = isMobile ? 'touchmove' : 'mousemove';
  const endEvent = isMobile ? 'touchend' : 'mouseup';
  const dragBind = output.drag.bind(null, isMobile);
  const dragEndBind = output.dragEnd.bind(null, isMobile, dragBind);
  
  output.style.boxShadow = '0px 0px 8px rgba(128, 0, 255, 0.5)';
  
  addEventListener(moveEvent, dragBind);
  addEventListener(endEvent, dragEndBind);
};

output.initDrag = isMobile => {
  const endEvent = isMobile ? 'touchend' : 'mouseup';
  const to = setTimeout(output.dragStart.bind(output, isMobile), 500);
  output.addEventListener(endEvent, () => clearTimeout(to));
};

output.addEventListener('mousedown', output.initDrag.bind(null, false));
output.addEventListener('touchstart', output.initDrag.bind(null, true));

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