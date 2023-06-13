import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../Firebase';
import People from './People';

const PeopleProps = () => {

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);


    return (
        <div>
            <People />
            {/* {api.map((item) => {
                return (
                    <>
                    </>
                )
            })} */}
        </div>
    )
}

export default PeopleProps
