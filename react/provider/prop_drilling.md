### prop drilling

- 컴포넌트의 레이어가 증가할수록 props로 거쳐가는 컴포넌트들이 많아짐

#### 문제가 발생하는 경우

1. 데이터의 형식이 변경되는 경우, 전체적으로 수정해야 함
   (ie: `{user: {name: 'Joe West'}} -> {user: {firstName: 'Joe', lastName: 'West'}}`)

2. 기존에 있던 props가 필요없게 되는 경우, 전체적으로 삭제해야 함

- 중간 레이어 컴포넌트에서 해당 props의 데이터를 사용하지 않아도, 리렌더링이 발생

3. 중간계층에서 props의 이름이 바뀌는 경우, 추적하기 어려움
   (ie `<Toggle on={on} /> renders <Switch toggleIsOn={on} />`)

#### 피하는 방법

1. 재사용성이 확정된 컴포넌트일 경우 위주로 컴포넌트를 분리하기

2. 상태를 앱의 최상위 수준이 아닌, 사용되는 공통 부모 컴포넌트에서 관리하기

3. drilling이 발생하는 props를 가진 컴포넌트를 합성(Composition)하기

   - 컴포넌트 중간에 있는 컴포넌트들이 props에 대한 정보를 알 필요가 없음

   props drilling

   ```jsx
   <Page user={user} avatarSize={avatarSize} />
   // ... 그 아래에 ...
   <PageLayout user={user} avatarSize={avatarSize} />
   // ... 그 아래에 ...
   <NavigationBar user={user} avatarSize={avatarSize} />
   // ... 그 아래에 ...
   <Link href={user.permalink}>
   <Avatar user={user} size={avatarSize} />
   </Link>
   ```

   composition

   ```jsx
   function Page(props) {
   const user = props.user;
   const userLink = (
      <Link href={user.permalink}>
         <Avatar user={user} size={props.avatarSize} />
      </Link>
   );
   return <PageLayout userLink={userLink} />;
   }

   <Page user={user} avatarSize={avatarSize} />
   // ... 그 아래에 ...
   <PageLayout userLink={...} />
   // ... 그 아래에 ...
   <NavigationBar userLink={...} />
   // ... 그 아래에 ...
   {props.userLink}
   ```

4. React의 context API, Vue의 Provide/inject와 같은 Provider Pattern을 사용하기
