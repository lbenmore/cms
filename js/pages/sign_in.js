core.controllers.sign_in = () => {
  $$('.SignIn .btnSignIn').on('click', () => {
    core.fns.goToPage('home');
  });
  
  $$('.SignIn .btnResetPassword').on('click', () => {
    core.fns.goToPage('reset_password');
  });
  
  $$('.SignIn .btnRegister').on('click', () => {
    core.fns.goToPage('register');
  });
};