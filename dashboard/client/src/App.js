import React from 'react';
import { jsonServerRestClient, Admin, Resource } from 'admin-on-rest';

import authClient from './authClient';

import { PostList } from './components/posts';

import Dashboard from './Dashboard';

const App = () => (
  <Admin 
    title="GIM Dashboard"
    authClient={authClient}  
    dashboard={Dashboard} 
    restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}
  >
    <Resource name="Posts" list={PostList} />
  </Admin>
);

export default App;