core.controllers.Home = () => {
  let textEditor;
  
  core.log('Home initialized');
  core.vars.title = 'Home';
  
  core.events.addEventListener('coreComponentLoad', () => {
    if (event.detail.componentName === 'TextEditor') {
      textEditor = new event.detail.component({
        target: $$('.TextEditor')
      });
    }
  });
};