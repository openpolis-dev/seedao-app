import fs from 'fs';
import { firebaseConfigDevelopment, firebaseConfigProduction } from './src/firebase.js';
import { config } from 'dotenv';
config();


const firebaseConfig =
  process.env.REACT_APP_ENV_VERSION === 'prod' ? firebaseConfigProduction : firebaseConfigDevelopment;

fs.writeFileSync('./public/firebase-env.js', `const firebaseConfig = ${JSON.stringify(firebaseConfig)}`);
