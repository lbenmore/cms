core.controllers.reset_password = () => {
  $$('.ResetPassword .btnResetPassword').on('click', () => {
    core.fns.goToPage('sign_in');
  });
  
  $$('.ResetPassword .btnSignIn').on('click', () => {
    core.fns.goToPage('sign_in');
  });
  
  $$('.ResetPassword .btnRegister').on('click', () => {
    core.fns.goToPage('register');
  });
};