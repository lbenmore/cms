
const core = {};
core.container = '.container';
core.events = document.createElement('div');
core.vars = {};
core.fns = {};
core.controllers = {};
core.config = {};
core.user = {};
core.debug = !0;

core.log = function () {
  if (core.debug) console.log.apply(null, arguments);
  // err is an empty object on iPad iOS 14
  // try { throw new Error(); } catch (err) {
  //   console.log(err);
  //   // use error properties to create informative label
  //   for (const _ in err) {
  //     console.log(`${_}, ${err[_]}`);
  //   }
  // }
}

core.fns.parseIncludes = () => {
  const incs = $$(`${core.container} [data-core-include]`, true);
  
  core.log('parseIncludes');
  
  incs.forEach(inc => {
    const src = inc.dataset.coreInclude;
    const url = src.indexOf('html/') === -1 ? src : `html/${src}`;
    
    core.log('parseIncludes ->', url);
    
    $$.ajax({
      url,
      success: res => {
        inc.innerHTML = res;
        inc.removeAttribute('data-core-include');
      },
      error: res => {
        console.log(`Error retrieving include: ${url} -> ${res}`);
      }
    })
  })
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
};

core.fns.parsePage = () => {
  core.log('parsePage');
  core.fns.parseIncludes();
  core.fns.parseTokens();
};

core.fns.loadPage = (page, pageName) => {
  const assets = page.css.concat(page.js);
  assets.push(page.html);
  
  core.log('loadPage -> pageName:', pageName);
  
  core.events.pageLoad = new CustomEvent('corePageLoad', {
    detail: { page, pageName }
  })
  
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
        
        core.log('loadPage -> html retrieval complete');
        
        function checkLoad (appended) {
          if (appended === assets.length) {
            core.log('loadPage -> asset appendage complete');
            core.controllers[pageName]();
            core.events.dispatchEvent(core.events.pageLoad);
            core.fns.parsePage();
          }
        }
        
        $$('.core-stylesheets').innerHTML = '';
        for (const ss of page.css) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = ss;
          link.onload = checkLoad.bind(null, ++appendedAssets);
          $$('.core-stylesheets').appendChild(link);
        }
        
        $$(core.container).innerHTML = res;
        
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
  core.log('onHashChange -> pageName:', pageName);
  core.fns.loadPage(core.config[pageName], pageName);
};

core.fns.goToPage = pageName => {
  core.log('goToPage -> pageName:', pageName);
  if (!pageName) pageName = Object.keys(core.config)[0];
  window.location.hash = `/${pageName}`;
};

core.fns.setUser = user => {
  core.log('setUser -> user:', user);
  core.user = user;
  delete core.user.password;
  core.log(core.user);
}

core.fns.init = res => {
  core.log('init -> authentication response:', res);
  if (res.status) {
    if (res.payload.isSignedIn) {
      core.fns.goToPage();
      core.fns.setUser(res.payload.user);
    } else {
      core.fns.goToPage('sign_in');
    }
  } else {
    core.log('Error verifying user authentication.');
  }
  
  window.addEventListener('hashchange', core.fns.onHashChange);
};

core.fns.checkAuth = () => {
  core.log('checkAuth');
  $$.ajax({
    type: 'json',
    // method: 'POST',
    // url: 'php/app.php',
    url: 'test_user.json',
    // params: {
    //   action: 'check_authentication'
    // },
    success: core.fns.init,
    error: res => core.log('Error checking authentication.', this.responseText)
  });
};

core.fns.getConfig = () => {
  core.log('getConfig');
  $$.ajax({
    type: 'json',
    url: 'config.json',
    success: res => {
      core.config = res;
      core.log('getConfig -> config:', core.config);
      core.fns.checkAuth();
    },
    error: res => core.log('Error retrieving config json.', this.responseText)
  });
}

$$.onReady(core.fns.getConfig);