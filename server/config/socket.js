import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        console.log("A new client connected, ID:", socket.id);

        io.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        })
    });

    return io;
}

// This function will be used in controllers to emit leads to connected clients
export const getIO = () => {
    if(!io){
        throw new Error("Socket.io has not been initialized!");
    }
    
    return io;
}