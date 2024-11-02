import dotenv from 'dotenv';

import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import flash from 'connect-flash';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import methodOverride from 'method-override';
import path from 'path';
import sequelize from './config/db.config.js'; // Ensure the .js extension
import { formatStringToAgo } from './utilities/helpers.js'; // Ensure the .js extension
import { userContext } from './middlewares/auth.js'; // Ensure the .js extension
import * as models from './models/index.js'; // Ensure the .js extension

// AdminJS imports

import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';

import indexroutes from './routes/index.js'
import userroutes from './routes/users.js'

dotenv.config()
const SequelizeStore = connectSessionSequelize(session.Store);
const app = express();

const sessionStore = new SequelizeStore({
     db: sequelize,
     checkExpirationInterval: 15 * 60 * 1000, // Check every 15 mins
     expiration: 24 * 60 * 60 * 1000, // Expire sessions after 24 hours
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'templates')); // Use process.cwd() for better path resolution
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static(path.join(process.cwd(), 'public'))); // Use process.cwd()
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
     session({
          secret: 'gghvhyg7678yuhfgvtr56y7uijhgfrd4e3wer5t6789ijuy7t6r5e4e',
          resave: true,
          saveUninitialized: true,
          store: sessionStore,
          cookie: {
               maxAge: 1000 * 60 * 60 * 24,
               secure: process.env.NODE_ENV === 'production',
          },
     })
);

app.use(userContext);
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.info_msg = req.flash('info_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error = req.flash('error');
     res.locals.formatStringToAgo = formatStringToAgo;
     next();
});

// Dynamic resource generation from Sequelize models
const resources = Object.values(models).map((model) => ({
     resource: model,
     options: {
          properties: {
               password: { isVisible: false },
               createdAt: { isVisible: { list: true, edit: false } },
               updatedAt: { isVisible: { list: true, edit: false } },
          },
     },
}));

// Register AdminJS adapter
AdminJS.registerAdapter(AdminJSSequelize);

// Create an AdminJS instance
const admin = new AdminJS({
     databases: [sequelize], // Use sequelize instance for database
     resources,
     rootPath: '/admin',
     branding: {
          companyName: 'Chirp Space Admin',
          logo: '/img/app_logo.png', // Add your logo path
          theme: {
               colors: {
                    primary100: '#009688',
                    accent: '#4caf50',
               },
          },
     },
});

// Build the AdminJS router
const adminRouter = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, adminRouter);

// Routes setup
app.use('/', indexroutes); // Ensure default export
app.use('/users', userroutes); // Ensure default export

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
