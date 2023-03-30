# Static Import

## 개요

다른 모듈이 export한 코드를 import한다

## 특징

- import module from 'module' 과 같이 ES2015의 import 구문으로 사용한 코드는 정적으로 가져오게 된다.

```jsx
// App.js
import React from "react";

// Statically import Chatlist, ChatInput and UserInfo
import UserInfo from "./components/UserInfo";
import ChatList from "./components/ChatList";
import ChatInput from "./components/ChatInput";

import "./styles.css";

console.log("App loading", Date.now()); // ---- 5

const App = () => (
  <div className="App">
    <UserInfo />
    <ChatList />
    <ChatInput />
  </div>
);

export default App;
```

```jsx
// UserInfo.js
import React from "react";
import Horizontal from "./icons/Horizontal";

const UserInfo = () => (
  <div className="user-info">
    <div className="user-details">
      <div className="user-avatar" />
      <div className="user-name">
        John Doe
        <span className="user-status">Online</span>
      </div>
    </div>
    <Horizontal />
  </div>
);

console.log("UserInfo loading", Date.now()); // ---- 1

export default UserInfo;
```

```jsx
// ChatList.js
import React from "react";
import messages from "../data/messages";

const ChatMessage = ({ message, side }) => (
  <div className={`msg-container ${side}`}>
    <div className="chat-msg">
      <div className="msg-contents">{message}</div>
    </div>
  </div>
);

const ChatList = () => (
  <div className="chat-list">
    {messages.map((message) => (
      <ChatMessage
        message={message.body}
        key={message.id}
        side={["left", "right"][Number(message.senderId === 1)]}
      />
    ))}
  </div>
);

console.log("ChatList loading", Date.now()); // ---- 2

export default ChatList;
```

```jsx
// ChatInput.js
import React from "react";
import Send from "./icons/Send";
import Emoji from "./icons/Emoji";

import EmojiPicker from "./EmojiPicker";

const ChatInput = () => {
  const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);

  return (
    <div className="chat-input-container">
      <input type="text" placeholder="Type a message..." />
      <Emoji onClick={togglePicker} />
      {pickerOpen && <EmojiPicker />}
      <Send />
    </div>
  );
};

console.log("ChatInput loading", Date.now()); // ---- 4

export default ChatInput;
```

```jsx
// EmojiPicker.js
import React from "react";
import Picker from "emoji-picker-react";

const EmojiPicker = () => (
  <div className="emoji-picker">
    <Picker />
  </div>
);

console.log("EmojiPicker loading", Date.now()); // ---- 3

export default EmojiPicker;
```

- console의 출력순서는

  1. UserInfo
  2. ChatList
  3. EmojiPicker
  4. ChatInput
  5. App
     이다.

- 위처럼 컴포넌트들이 정적으로 포함될 경우, 웹팩은 해당 코드들을 초기 번들에 포함시킨다.

## 장점

- 즉각적인 종속성 로드

  - 정적으로 가져온 구성 요소를 즉시 사용할 수 있다.

## 단점

- 큰 번들 크기
  - 모든 모듈을 가져올 때 필요하지 않은 코드를 포함할 수 있다.

### 참고

- https://javascriptpatterns.vercel.app/patterns/performance-patterns/static-import
