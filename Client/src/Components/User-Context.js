import React, {useState, useEffect} from 'react';
export const UserContext = React.createContext();

export function UserProvider(Props){

   

    const [User, setUser] = useState({
        username: null,
        _id: null,
        email: null,
        avatar: null,
        tracks: [],
    });
    
    
    
    useEffect(()=>{
        if(User.username === null){
            const user = JSON.parse(localStorage.getItem('UserStorage'));
            setUser(user)
        }
        
    }, [])

    
   
    return(
        <UserContext.Provider value={{User, setUser}}>
            {Props.children}
        </UserContext.Provider>
    );
}


