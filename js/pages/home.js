core.controllers.Home = () => {
  let textEditor;
  
  core.log('Home initialized');
  core.vars.title = 'Home';
  
  function validatePost () {
    core.log('validatePost');
    const title = $$('input[placeholder*=Title').value;
    const body = textEditor.innerHTML;
    const post = { title, body };
    
    core.log(post.title, post.body);
    /*
      will be replaced with saving via php to
      /content/YYYY/MM/DD/timestamp.json = { title, body }
      files from the /content directory will populate
      the cms menu
    */
  }
  
  function initFns () {
    $$('.btn-post').on('click', validatePost);
  
    $$(core.events).on('coreComponentLoad', () => {
      if (event.detail.componentName === 'TextEditor') {
        textEditor = new event.detail.component({
          target: $$('.TextEditor')
        });
      }
    }, { once: true }); 
  }
  
  $$(core.events).once('corePageLoad', () => {
    if (event.detail.pageName === 'home') initFns();
  });
};