import { useUser } from 'context/userContext';
import React from 'react';

const PrivateComponent = ({ roleList, children }) => {  //recibe una lista de roles
  const { userData } = useUser();
  console.log(userData);

  if (roleList.includes(userData.rol)) {
    return children;
  }

  return <></>;
};

export default PrivateComponent;