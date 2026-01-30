import { Firebase } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAklUXFdPs-AHI3D3YsS29yrxkHRn1RJQk', 
  authDomain: 'recipe-rocal-42e29.firebaseapp.com', 
  databaseURL: 'https://recipe-rocal-42e29.firebaseio.com', 
  projectId: 'recipe-rocal-42e29', 
  storageBucket: 'recipe-rocal-42e29.appspot.com', 
  messagingSenderId: '525472070731', // Need to change
  appId: '1:369857042083:android:2bb076a7faba6e73d19116', 
};

Firebase.initializeApp(firebaseConfig);

export { Firebase };
