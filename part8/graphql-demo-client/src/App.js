import React, { useEffect, useState } from 'react';
import { useApolloClient, useQuery, useSubscription } from '@apollo/client';
import Persons from './components/Persons';
import AddPersonForm from './components/AddPersonForm';
import { ALL_PERSONS, PERSON_ADDED } from './queries';
import Notify from './components/Notify';
import EditNumberForm from './components/EditNumberForm';
import LoginForm from './components/LoginForm';

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const result = useQuery(ALL_PERSONS);
  const client = useApolloClient();

  const notify = message => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const updateCacheWith = addedPerson => {
    const includedIn = (set, object) => set.map(p => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_PERSONS });
    if (!includedIn(dataInStore.allPersons, addedPerson)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: { allPersons: dataInStore.allPersons.concat(addedPerson) },
      });
    }
  };

  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedPerson = subscriptionData.data.personAdded;
      notify(`${addedPerson.name} added`);
      updateCacheWith(addedPerson);
    },
  });

  useEffect(() => {
    if (localStorage.length > 0) {
      const loggedInUserToken = localStorage.getItem('phonebook-user-token');
      setToken(JSON.stringify(loggedInUserToken));
    }
  }, []); //eslint-disable-line

  if (result.loading) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    );
  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <h1>Hello GraphQL</h1>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <AddPersonForm setError={notify} updateCacheWith={updateCacheWith} />
      <EditNumberForm setError={notify} />
    </div>
  );
}

export default App;
