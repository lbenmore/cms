core.controllers.Home = () => {
  let textEditor;
  
  core.log('Home initialized');
  core.vars.title = 'Home';
  
  function validatePost () {
    core.log('validatePost');
    const title = $$('input[placeholder*=Title').value;
    const body = textEditor.innerHTML;
    const post = { title, body };
    
    /*
    will be replaced with saving via php to
    /content/YYYY/MM/DD/timestamp.json = { title, body }
    files from the /content directory will populate
    the cms menu
    */
    core.log(post.title, post.body);
  }
  
  function initFns () {
    $$('.btn-post').on('click', validatePost);
  
    $$(core.events).once('coreComponentLoad', () => {
      switch (event.detail.componentName) {
        case 'TextEditor':
          textEditor = new event.detail.component({
            target: $$('.TextEditor')
          });
          break;
      }
    }); 
  }
  
  $$(core.events).once('corePageLoad', () => {
    if (event.detail.pageName === 'home') initFns();
  });
};