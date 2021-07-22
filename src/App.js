import React, { useState, useEffect, useMemo } from 'react';
import contactsData from './components/data/ContactsList.json';
import Form from './components/Form';
import Section from './components/Section';
import Contacts from './components/Contacts';
import Filter from './components/Filter';
import { v4 as uuidv4 } from 'uuid';


function App() {
  const [contacts, setContacts] = useLocalStorage('contacts', contactsData);
  const [filter, setFilter] = useState('');

 

function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(() => {
    return JSON.parse(window.localStorage.getItem(key)) || defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
    const localstorageArrayLength =
      JSON.parse(window.localStorage.getItem(key)).length === 0;
    if (localstorageArrayLength) {
      setState(defaultValue);
    }
  }, [defaultValue, key, state]);

  return [state, setState];
}

  const formSubmitHandler = data => {
    const isContactValid = validateContact(data, contacts);

    if (isContactValid) {
      data.id = uuidv4();
      setContacts(state => [data, ...state]);
    }
  };
  

     const validateContact = (data, contacts) => {
    if (contacts.some(({ name }) => name === data.name)) {
      alert(`${data.name} is already in contacts.`);
      return false;
    } else return true;
  };

   const deleteContact = id => {
     setContacts(state => state.filter(contact => contact.id !== id));
  };

   const handleSearch = e => {
      setFilter(e.currentTarget.value);
  };

  const filteredContacts = useMemo(() => {
    const getFiltredContacts = contacts => {
      const lowerCaseFilter = filter.toLowerCase();
      return contacts.filter(person =>
        person.name.toLowerCase().includes(lowerCaseFilter),
      );
    };
    return getFiltredContacts(contacts);
  }, [contacts, filter]);


    return (
      <>
        <Section title="Phonebook">
          <Form onSubmit={formSubmitHandler} />
        </Section>

        <Section title="Contacts">
          <Filter value={filter} onChange={handleSearch} />
          <Contacts
            contacts={filteredContacts}
            onDeleteBtnClick={deleteContact}
          />
        </Section>
      </>
    );
  }


export default App;