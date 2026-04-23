import { registerRootComponent } from 'expo';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

import App from './App';
import { firebaseConfig } from './config/database';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
