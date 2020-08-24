
const core = {};
core.container = '.container';
core.events = document.createElement('div');
core.vars = {};
core.fns = {};
core.controllers = {};
core.config = {};
core.user = {};

core.fns.parsePage = () => {
  const pattern = /\{\{\s*(\S*)\s*\}\}/g;
  let match;
  
  while ((match = pattern.exec($$(core.container).innerHTML)) !== null) {
    const [ macro, token ] = match;
    const tokenBits = token.split('.');
    let result = core.vars;
    let next;
    while (next = tokenBits.shift()) {
      result = result[next];
    }
    $$(core.container).innerHTML = $$(core.container).innerHTML.replace(new RegExp(macro, 'g'), result);
  }
};

core.fns.loadPage = (page, pageName) => {
  const assets = page.css.concat(page.js);
  assets.push(page.html);
  
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
    $$.ajax({
      url: page.html,
      success: res => {
        let appendedAssets = 1;
        
        function checkLoad (appended) {
          if (appended === assets.length) {
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
      error: xhr => console.log('Error retrieving HTML')
    });
  });
};

core.fns.onHashChange = () => {
  const pageName = window.location.hash.slice(2);
  core.fns.loadPage(core.config[pageName], pageName);
};

core.fns.goToPage = pageName => {
  if (!pageName) pageName = Object.keys(core.config)[0];
  window.location.hash = `/${pageName}`;
};

core.fns.setUser = user => {
  core.user = user;
  delete core.user.password;
  console.log(core.user);
}

core.fns.init = res => {
  if (res.status) {
    if (res.payload.isSignedIn) {
      core.fns.goToPage();
      core.fns.setUser(res.payload.user);
    } else {
      core.fns.goToPage('sign_in');
    }
  } else {
    console.log('Error verifying user authentication.');
  }
  
  window.addEventListener('hashchange', core.fns.onHashChange);
};

core.fns.checkAuth = () => {
  $$.ajax({
    type: 'json',
    // method: 'POST',
    // url: 'php/app.php',
    url: 'test_user.json',
    // params: {
    //   action: 'check_authentication'
    // },
    success: core.fns.init,
    error: res => console.log('Error checking authentication.', this.responseText)
  });
};

core.fns.getConfig = () => {
  $$.ajax({
    type: 'json',
    url: 'config.json',
    success: res => {
      core.config = res;
      core.fns.checkAuth();
    },
    error: res => console.log('Error retrieving config json.', this.responseText)
  });
}

$$.onReady(core.fns.getConfig);