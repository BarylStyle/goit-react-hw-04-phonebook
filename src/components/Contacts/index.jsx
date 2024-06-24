import { nanoid } from "nanoid";
import React, { useState, useEffect } from "react";
import styles from "./Contact.module.scss";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleChange = (ev) => {
    const { name, value } = ev.currentTarget;
    if (name === "name") {
      setName(value);
    } else if (name === "number") {
      setNumber(value);
    } else if (name === "filter") {
      setFilter(value);
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const isDuplicate = contacts.some(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      alert(`Contact with the name "${name}" already exists.🫣😵‍💫`);
      return;
    }

    const isValidNumber = /^[0-9]+$/.test(number);

    if (!isValidNumber) {
      alert("The phone number must contain only digits.");
      return;
    }

    setContacts((prevContacts) => [
      ...prevContacts,
      { id: nanoid(), name, number },
    ]);
    setName("");
    setNumber("");
  };

  const handleDelete = (id) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== id)
    );
  };

  const nameId = nanoid();
  const numId = nanoid();
  const searchId = nanoid();

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor={nameId}>Name</label>
        <input
          id={nameId}
          type="text"
          name="name"
          required
          value={name}
          onChange={handleChange}
        />
        <label htmlFor={numId}>Phone number</label>
        <input
          id={numId}
          type="tel"
          name="number"
          required
          value={number}
          onChange={handleChange}
          pattern="[0-9]*"
          title="The phone number must contain only digits."
        />
        <button type="submit">Add contact</button>
      </form>
      <h1>Contacts</h1>
      <form className={styles.searchForm}>
        <label htmlFor={searchId}>Find contact</label>
        <input
          type="text"
          id={searchId}
          name="filter"
          value={filter}
          onChange={handleChange}
        />
      </form>
      <ul className={styles.list}>
        {contacts
          .filter((el) =>
            el.name.toLowerCase().includes(filter.toLowerCase())
          )
          .map((contact) => (
            <li key={contact.id}>
              {contact.name} - {contact.number}
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDelete(contact.id)}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Contacts;
