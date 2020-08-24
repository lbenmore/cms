(function (win, doc) {
  function setStyles () {
    doc.body.style.setProperty('--vh', win.innerHeight / 100);
  }
  
  function eventListeners () {
    win.addEventListener('resize', setStyles);  
    
    core.events.addEventListener('corePageLoad', () => {
      core.vars.title = event.detail.pageName;
    });
  }
  
  function init () {
    eventListeners();
    setStyles();
  }
  
  $$.onReady(init);
})(window, window.document); 