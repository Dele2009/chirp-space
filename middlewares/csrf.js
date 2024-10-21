import csrf from 'csurf';

// Setup CSRF protection
const csrfProtection = csrf({ cookie: true });

export default csrfProtection;
