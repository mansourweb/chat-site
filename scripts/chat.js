// adding new chat
// setting up real-time listener
// updating username
// update room

class Chatroom {
    constructor(room,username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addChat(message){
        // format chat object
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save chat
        const response = await this.chats.add(chat)
        return response;
    }
    getChats(callback){
        this.unsub = this.chats
            .where('room','==',this.room)
            .orderBy('created_at')
            .onSnapshot(snapshopt => {
                snapshopt.docChanges().forEach(change => {
                    if(change.type === 'added'){
                        callback(change.doc.data())
                    }
                });
            });
    }
    updateName(username){
        this.username = username;
        localStorage.setItem('username',username);
    };
    updateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
            this.unsub();
        }   
    }
};

