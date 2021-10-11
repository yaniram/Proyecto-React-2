import Sidebar from 'components/Sidebar';
import React from 'react'

const PrivateLayout = ({ children }) => {
    return (
     <div className="flex w-screen h-screen">
         <Sidebar />
         <main className="flex w-full bg-yellow-500 overflow-y-scroll">{children}</main>
         
     </div>
    );
    
};

export default PrivateLayout;
