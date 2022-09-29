import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (isLogged, isAdmin) => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        if (isLogged) {
            let socketInstance = io('http://localhost:3000/', {
                auth: {
                    isLogged: isLogged,
                    isAdmin: isAdmin,
                }
            });
            setSocket(socketInstance);
        }
    }, [isLogged, isAdmin])
    return socket;
}

export default useSocket;