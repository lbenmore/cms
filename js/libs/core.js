
const core = {};
core.container = '.core-container';
core.events = document.createElement('div');
core.vars = {};
core.fns = {};
core.controllers = {};
core.components = {};
core.debug = !0;

core.log = (...args) => {
  if (core.debug) console.log.apply(null, args);
};

core.fns.parseTokens = () => {
  const pattern = /\{\{\s*(\S*)\s*\}\}/g;
  let match;
  
  core.log('parseTokens');
  
  while ((match = pattern.exec($$(core.container).innerHTML)) !== null) {
    const [ macro, token ] = match;
    const tokenBits = token.split('.');
    let result = core.vars;
    let next;
    
    core.log('parseTokens ->', token);
    
    while (next = tokenBits.shift()) {
      result = result[next];
    }
    $$(core.container).innerHTML = $$(core.container).innerHTML.replace(new RegExp(macro, 'g'), result);
  }
  
  core.events.pageLoaded = true;
  core.events.dispatchEvent(core.events.pageLoad);
};

core.fns.loadControllers = () => {
  const ctrls = $$(`${core.container} [data-core-controller]`, true);
  
  ctrls.forEach(ctrl => {
    const name = ctrl.dataset.coreController;
    core.controllers[name] && core.controllers[name]();
  });
  
  core.fns.parseTokens();
};

core.fns.parseIncludes = () => {
  const incs = $$(`${core.container} [data-core-include]`, true);
  const numIncs = incs.length;
  let currInc = 0;
  
  const checkLoad = (total, current) => {
    if (current === total) {
      if ($$(`${core.container} [data-core-include]`, true).length) {
        core.fns.parseIncludes();
      } else {
        core.fns.loadControllers();
      }
    }
  }
  
  core.log('parseIncludes');
  
  incs.forEach(inc => {
    const src = inc.dataset.coreInclude;
    const url = src.indexOf('html/') === -1 ? `html/${src}` : src;
    const incName = url.split('/').pop().split('.')[0];
    
    core.log('parseIncludes ->', url);
    
    $$.ajax({
      url,
      success: html => {
        inc.innerHTML = html;
        inc.removeAttribute('data-core-include');
        checkLoad(numIncs, ++currInc);
      },
      error: res => console.log(`Error retrieving include: ${url} -> ${res}`)
    });
  });
};

core.fns.parsePage = () => {
  core.log('parsePage');
  core.fns.parseIncludes();
};

core.fns.loadPage = (page, pageName) => {
  const assets = page.css.concat(page.js);
  assets.push(page.html);
  
  core.log('loadPage -> pageName:', pageName);
  
  core.events.pageLoaded = false;
  core.events.pageLoad = new CustomEvent('corePageLoad', {
    detail: { page, pageName }
  });
  
  if (!$$('.core-stylesheets')) {
    const div = document.createElement('div');
    div.className = 'core-stylesheets';
    document.body.appendChild(div);
  }
  
  if (!$$('.core-scripts')) {
    const div = document.createElement('div');
    div.className = 'core-scripts';
    document.body.appendChild(div);
  }
  
  $$.preload(assets, () => {
    core.log('loadPage -> preload complete');
    $$.ajax({
      url: page.html,
      success: res => {
        let appendedAssets = 1;
        
        const checkLoad = (appended) => {
          if (appended === assets.length) {
            core.log('loadPage -> asset appendage complete');
            core.fns.parsePage();
          }
        }
        
        $$(core.container).innerHTML = res;
        core.log('loadPage -> html retrieval complete');
        
        $$('.core-stylesheets').innerHTML = '';
        for (const ss of page.css) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = ss;
          link.onload = checkLoad.bind(null, ++appendedAssets);
          $$('.core-stylesheets').appendChild(link);
        }
        
        $$('.core-scripts').innerHTML = '';
        for (const scr of page.js) {
          const scrpt = document.createElement('script');
          scrpt.src = scr;
          scrpt.onload = checkLoad.bind(null, ++appendedAssets);
          $$('.core-scripts').appendChild(scrpt);
        }
      },
      error: xhr => core.log('Error retrieving HTML')
    });
  });
};

core.fns.onHashChange = () => {
  const pageName = window.location.hash.slice(2);
  if (!core.config.hasOwnProperty(pageName)) {
    core.log('onHashChange -> Page does not exist:', pageName);
    return;
  }
  core.log('onHashChange -> pageName:', pageName);
  core.fns.loadPage(core.config[pageName], pageName);
};

core.fns.goToPage = pageName => {
  if (!pageName) pageName = Object.keys(core.config)[0];
  core.log('goToPage -> pageName:', pageName);
  if (window.location.hash.slice(2) === pageName) {
    core.fns.loadPage(core.config[pageName], pageName);
  } else {
    window.location.hash = `/${pageName}`;
  }
};
  
window.addEventListener('hashchange', core.fns.onHashChange);