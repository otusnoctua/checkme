import useLocalStorage from "./useLocalStorage";

/**
 * Hook to manage localStorage authorization fields
 * @returns username, name, surname, token - corresponding strings
 * 
 * signOut(): signs out current authorization session
 * 
 * authorize(username, token, name, surname): signs in
 */
function useAuthorization() {
    let [username, setUsername] = useLocalStorage('username');
    let [token, setToken] = useLocalStorage('token');
    let [name, setName] = useLocalStorage('name');;
    let [surname, setSurname] = useLocalStorage('surname');;

    const signOut = () => {
        setToken(null);
        setUsername(null);
        setName(null);
        setSurname(null);
    }

    const authorize = (username, token, name, surname) => {
        setUsername(username);
        setToken(token);
        setName(name);
        setSurname(surname);
    }

    return { 
        username: username, 
        name: name, 
        surname: surname,
        token: token, 
        signOut: signOut, 
        authorize: authorize 
    };
}

export default useAuthorization;
