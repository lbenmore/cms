core.controllers.Register = () => {
  $$('.Register .btnRegister').on('click', () => {
    core.fns.goToPage('home');
  });
  
  $$('.Register .btnSignIn').on('click', () => {
    core.fns.goToPage('sign_in');
  });
};