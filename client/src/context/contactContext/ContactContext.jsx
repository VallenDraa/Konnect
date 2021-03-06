import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";
import groupedContactsReducer, {
  GROUPED_CONTACTS_ACTIONS,
  GROUPED_CONTACTS_DEFAULT,
} from "../../reducer/groupedContactsReducer/groupedContactsReducer";
import getUsersContactsPreview from "../../utils/apis/getUserContactsPreview";
import { UserContext } from "../user/userContext";

export const ContactsContext = createContext([]);

export default function ContactsContextProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const { userState } = useContext(UserContext);
  const [groupedContacts, gcDispatch] = useReducer(
    groupedContactsReducer,
    GROUPED_CONTACTS_DEFAULT
  );

  // get all the contact data from the current logged in user initial load
  useEffect(() => {
    if (contacts.length > 0 || !userState.user) return;
    const getAllContacts = async () => {
      try {
        const result = [];
        const data = await getUsersContactsPreview(
          sessionStorage.getItem("token")
        );

        if (data.contacts.length > 0) {
          for (const contact of data.contacts) {
            result.push(contact);
          }
          setContacts(result);
        } else {
          setContacts([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAllContacts();
  }, [userState]);

  //  group the contacts
  useEffect(() => {
    if (groupedContacts.length > 0) {
      gcDispatch({ type: GROUPED_CONTACTS_ACTIONS.isStartingUpdate });
    } else {
      gcDispatch({ type: GROUPED_CONTACTS_ACTIONS.isStarting });
    }

    const groupContact = () => {
      if (contacts.length === 0) return [];

      const temp = {};
      const sortedContacts = contacts.sort((a, b) =>
        a.user.username < b.user.username ? -1 : 1
      );

      for (const contact of sortedContacts) {
        const alphabet = contact.user.username.substring(0, 1);

        // setting the object keys
        if (!temp[alphabet]) temp[alphabet] = [];

        // pushing the contact name to the respective first letter alphabet object
        temp[alphabet].push(contact);
      }

      // return as an array of key value pairs array
      const result = Object.entries(temp);

      return result;
    };

    gcDispatch({ type: GROUPED_CONTACTS_ACTIONS.isLoading });

    gcDispatch({
      type: GROUPED_CONTACTS_ACTIONS.isLoaded,
      payload: groupContact(),
    });
  }, [contacts]);

  // useEffect(() => {
  //   console.log(
  //     "???? ~ file: ContactContext.jsx ~ line 111 ~ ContactsContextProvider ~ contacts",
  //     contacts
  //   );
  // }, [contacts]);
  // useEffect(() => {
  //   console.log(groupedContacts);
  // }, [groupedContacts]);

  return (
    <ContactsContext.Provider
      value={{ contacts, setContacts, groupedContacts, gcDispatch }}
    >
      {children}
    </ContactsContext.Provider>
  );
}
