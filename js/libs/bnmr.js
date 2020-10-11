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
    
    if (el) {
      el.css = (property, value, delay) => {
        if (el.length) {
          for (const _ of el) $$(_).css(property, value, delay);
          return el;
        }
        
        let propIsObj = false;
        
        if (typeof property === 'object') {
          delay = value;
          value = null;
          propIsObj = true;
        }
        
        setTimeout(() => {
          if (typeof property === 'string') el.style[property] = value;
          else if (propIsObj) for (const _ in property) el.style[_] = property[_];
        }, delay || 0);
        
        return el;
      };
      
      el.animate = (properties, duration, delay, timingFunction, callback) => {
        if (typeof duration === 'function') { callback = duration; duration = null }
        if (typeof delay === 'function') { callback = delay; delay = null }
        if (typeof timingFunction === 'function') { callback = timingFunction; timingFunction = null }
        
        if (el.length) {
          for (const _ of el) $$(_).animate(properties, duration, delay, timingFunction);
          callback && setTimeout(callback, (duration || 0) + (delay || 0));
          return el;
        }
        
        const dur = duration || 500
        let transitionStyle = '';
        let setTime = (delay || 0) >= 50 ? delay - 50 : 0;
        let execTime = setTime + 50;
        
        core.log('dur, setTime, execTime', dur, setTime, execTime);
        
        for (const prop in properties) transitionStyle += `${prop} ${dur}ms ${timingFunction || 'ease'}, `;
        transitionStyle = transitionStyle.slice(0, -2);
        el.css('-webkit-transition', transitionStyle, setTime);
        el.css('transition', transitionStyle, setTime);
        
        for (const prop in properties) el.css(prop, properties[prop], execTime);
        
        callback && setTimeout(callback, (dur || 0) + (delay || 0));
        
        return el;
      };
      
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
      
      el.once = (evt, fn) => {
        const remove = () => {
          el.removeEventListener(evt, callback);
        };
        
        const callback = () => {
          fn();
          remove();
        };
        
        el.addEventListener(evt, callback);
      };
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
      passback,
      headers,
      params
    } = options;
    
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    
    for (const _ in params) fd.append(_, params[_]);
    
    xhr.onerror = () => error.call(xhr, passback);
    xhr.onprogress = () => progress.call(xhr, passback);
    xhr.onload = () => {
      let data;
      
      switch (type) {
        case 'json':
          try {
            data = JSON.parse(xhr.responseText);
          } catch (err) {
            error.call(xhr, err, passback);
            return;
          }
          break;
        
        case 'xml':
          data = xhr.responseXML;
          break;
          
        default:
          data = xhr.responseText;
      }
      
      success.call(xhr, data, passback);
    };
    
    xhr.open(method, url, async);
    for (const _ in headers) xhr.setRequestHeader(_, headers[_]);
    params ? xhr.send(fd) : xhr.send();
  };
  
  $$.preload = (assets, fn) => {
    function loadAsset (assets, currentIndex) {
      const img = new Image();
      img.src = assets[currentIndex];
      img.onload = img.onerror = loadHandler.bind(null, assets, ++currentIndex);
    }
    
    function loadHandler (assets, currentIndex) {
      if (currentIndex < assets.length) {
        loadAsset(assets, currentIndex);
      } else {
        fn && fn();
      }
    }
    
    if (typeof assets === 'string') assets = [assets];
    
    loadHandler(assets, 0);
  }
  
  $$.onReady = fn => {
    if (doc.readyState === 'complete') fn()
    else {
      $$(doc).on('readystatechange', () => {
        if (doc.readyState === 'complete') fn();
      });
    }
  };
})(window, window.document);