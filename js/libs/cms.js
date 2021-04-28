const cms = {};
cms.fns = {};
core.config = {};
cms.user = {};

cms.fns.setUser = user => {
  core.log('setUser -> user:', user);
  cms.user = user;
  delete cms.user.password;
}

cms.fns.init = res => {
  core.log('init -> authentication response:', res);
  if (res.status) {
    if (res.payload.isSignedIn) {
      core.fns.goToPage(window.location.hash.slice(2));
      cms.fns.setUser(res.payload.user);
    } else {
      core.fns.goToPage('sign_in');
    }
  } else {
    core.log('Error verifying user authentication.');
  }
};

cms.fns.checkAuth = () => {
  core.log('checkAuth');
  $$.ajax({
    type: 'json',
    // method: 'POST',
    // url: 'php/app.php',
    url: 'test_user.json',
    // params: {
    //   action: 'check_authentication'
    // },
    success: cms.fns.init,
    error: res => core.log('Error checking authentication.', this.responseText)
  });
};

cms.fns.getConfig = () => {
  core.log('getConfig');
  $$.ajax({
    type: 'json',
    url: 'config.json',
    success: res => {
      core.config = res;
      core.log('getConfig -> config:', core.config);
      cms.fns.checkAuth();
    },
    error: res => core.log('Error retrieving config json.', this.responseText)
  });
}

$$.onReady(cms.fns.getConfig);