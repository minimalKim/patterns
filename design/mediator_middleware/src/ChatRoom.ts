// Mediator
// - Colleague 간의 상호참조를 조정

class ChatRoom {
  users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

  deleteUser(user: User) {
    this.users.filter((u) => u.name !== user.name);
  }

  sendMessage(sender: User, message: string) {
    for (const u of this.users) {
      if (u !== sender) {
        u.receive(sender.name, message);
      }
    }
  }
}

// Colleague
// - Mediator를 통해 다른 Colleague와의 상호참조

class User {
  name: string;
  chatroom: ChatRoom;

  constructor(name: string, chatroom: ChatRoom) {
    this.name = name;
    this.chatroom = chatroom;
  }

  send(message: string) {
    console.log(`${this.name}님이 보낸 메세지: ${message}`);
    this.chatroom.sendMessage(this, message);
  }

  receive(senderName: string, message: string) {
    console.log(`${this.name}님이 ${senderName}에게 받은 메세지: ${message}`);
  }
}

const chatroom = new ChatRoom();

const user1 = new User("Kim", chatroom);
const user2 = new User("Lee", chatroom);
const user3 = new User("Park", chatroom);

chatroom.addUser(user1);
chatroom.addUser(user2);
chatroom.addUser(user3);

user1.send("나는 Kim");
// Kim님이 보낸 메세지: 나는 Kim
// Lee님이 Kim에게 받은 메세지: 나는 Kim
// Park님이 Kim에게 받은 메세지: 나는 Kim

user2.send("나는 Lee");
// Lee님이 보낸 메세지: 나는 Lee
// Kim님이 Lee에게 받은 메세지: 나는 Lee
// Park님이 Lee에게 받은 메세지: 나는 Lee
