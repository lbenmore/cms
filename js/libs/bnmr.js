let $$;
(function (win, doc) {
  $$ = (selector, forceArray) => {
    const el = selector instanceof HTMLElement || selector instanceof HTMLBodyElement || selector instanceof HTMLDocument
      ? selector
      : forceArray || doc.querySelectorAll(selector).length > 1
        ? Object.keys(doc.querySelectorAll(selector)).map(x => doc.querySelectorAll(selector)[x])
        : doc.querySelector(selector);
        
    function listener (el, evt, fn, opts) {
      if ('addEventListener' in win) {
        el.addEventListener(evt, fn, opts);
      } else if ('attachEvent' in win) {
        el.attachEvent('on' + evt, fn);
      }
    }
    
    function evalSwipeEvent (evt, origEvt, endEvt, fn, opts) {
      const finalEvt = {};
      
      const minSwipeLength = 50;
      const maxWaverLength = 20;
      
      const isMobile = !!event.changedTouches;
      const startX = isMobile ? origEvt.changedTouches[0].clientX : origEvt.clientX;
      const startY = isMobile ? origEvt.changedTouches[0].clientY : origEvt.clientY;
      const endX = isMobile ? endEvt.changedTouches[0].clientX : endEvt.clientX;
      const endY = isMobile ? endEvt.changedTouches[0].clientY : endEvt.clientY;
      
      for (const _ in endEvt) finalEvt[_] = endEvt[_];
      finalEvt.originalEvent = origEvt;
      finalEvt.type = evt;
      
      switch (evt) {
        case 'swipeup':
          if (
            startY - endY > minSwipeLength &&
            Math.abs(startX - endX) < maxWaverLength
          ) {
            fn.call(el, finalEvt);
          }
          break;
          
        case 'swiperight':
          if (
            endX - startX > minSwipeLength &&
            Math.abs(startY - endY) < maxWaverLength
          ) {
            fn.call(el, finalEvt);
          }
          break;
          
        case 'swipedown':
          if (
            endY - startY > minSwipeLength &&
            Math.abs(startX - endX) < maxWaverLength
          ) {
            fn.call(el, finalEvt);
          }
          break;
          
        case 'swipeleft':
          if (
            startX - endX > minSwipeLength &&
            Math.abs(startY - endY) < maxWaverLength
          ) {
            fn.call(el, finalEvt);
          }
          break;
      }
    }
    
    function initSwipeEvent (el, evt, fn, opts) {
      let isMobile;
      try {
        new TouchEvent(Math.random().toString(16).slice(2));
        isMobile = true;
      } catch (err) {
        console.log(err);
        isMobile = false;
      }
      const startEventName = isMobile ? 'touchstart' : 'mousedown';
      const endEventName = isMobile ? 'touchend' : 'mouseup';
      
      listener(el, startEventName, () => {
        const origEvt = event;
        
        listener(el, endEventName, () => {
            const endEvt = event;
            evalSwipeEvent(evt, origEvt, endEvt, fn, opts)
        }, { once: true });
      }, opts);
    }
    
    el.on = (evt, fn, opts) => {
      if (el.length) {
        for (const _ of el) $$(_).on(evt, fn, opts);
        return el;
      }
      
      switch (evt) {
        case 'swipeup':
        case 'swiperight':
        case 'swipedown':
        case 'swipeleft':
          initSwipeEvent(el, evt, fn, opts);
          break;
          
        default:
          listener(el, evt, fn, opts);
      }
      
      return el;
    };
    
    return el;
  };
  
  $$.ajax = options => {
    const {
      type = 'ajax',
      method = 'GET',
      url = './',
      async = true,
      success = (() => {}),
      error = (() => {}),
      progress = (() => {}),
      headers,
      params
    } = options;
    
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    
    for (const _ in params) fd.apped(_, params[_]);
    
    xhr.onerror = () => error.call(xhr);
    xhr.onprogress = () => progress.call(xhr);
    xhr.onload = () => {
      let data;
      
      switch (method) {
        case 'json':
          try {
            data = JSON.parse(xhr.responseText);
          } catch (err) {
            error.call(xhr, err);
            return;
          }
          break;
        
        case 'xml':
          data = xhr.responseXML;
          break;
          
        default:
          data = xhr.responseText;
      }
      
      success.call(xhr, data);
    };
    
    xhr.open(method, url, async);
    for (const _ in headers) xhr.setRequestHeader(_, headers[_]);
    params ? xhr.send(fd) : xhr.send();
  };
  
  $$.onReady = fn => {
    if (doc.readyState === 'complete') fn()
    else {
      $$(doc).on('readystatechange', () => {
        if (doc.readyState === 'complete') fn();
      });
    }
  };
})(window, window.document);