# compound pattern

## 개요

- 허나의 작업을 수행하기 위해, 함께 동작하는 여러 컴포넌트를 만들어 역할을 분담하게 한다.
- 서로 내부 상태를 공유하는 컴포넌트 집합으로 볼 수 있다.
  ex) select + option

## 예시

![image](https://flowergeoji.me/static/43fcd090eead55225be5de0a904782d7/7a3d6/shuffle-components.png)

```jsx
// 초기 기획안
<NonCompoundShuffleInput
  value={value}
  onShuffle={(value) => shuffle(value)}
  onReset={() => _setValue(0)}
/>

// 변경된 기획안
<NonCompoundShuffleInput
    value={value}
    showReset={true} // <== 추가
    shuffleBtnPosition={"left"} // <== 추가
    onShuffle={(value) => shuffle(value)}
    onReset={() => _setValue(0)}
/>
```

- 추가된 요구사항을 반영하기 위해서 컴포넌트의 Property를 추가하고, 내부 상태와 로직을 수정하는 방식
- 추가되는 props로 인해 컴포넌트는 복잡해지고, 컴포넌트는 점점 더 요구사항에 유연하게 대처할 수 없게 된다.

#### Compound Pattern을 적용한 후

```jsx
// 초기 기획안
<CompoundShuffleInput
    value={value}
    onShuffle={(value) => shuffle(value)}
    onReset={() => _setValue(0)}
>
    <Input />
    <Button type={"button"} />
    <Button type={"reset"} />
</CompoundShuffleInput>

// 변경된 기획안
<CompoundShuffleInput
    value={value}
    onShuffle={(value) => shuffle(value)}
    onReset={() => _setValue(0)}
>
    <Button type={"button"} />
    <Input />
    <Button type={"reset"} hidden={true}/>
</CompoundShuffleInput>
```

- 특징

  - 하위 컴포넌트들은 상위 컴포넌트에 의해 control 된다.
  - react 에서는 상위 컴포넌트를 Context.Provider로 wrapping하여, 여러 하위 컴포넌트들에게 props를 제공할 수 있다.

- 작성한 소스: https://stackblitz.com/edit/react-ts-8uzf89?file=App.tsx

## 장점

- API 복잡성 감소
  - 하나의 거대한 부모 컴포넌트에 모든 props를 집어넣고 하위 UI 컴포넌트로 향해 내려가는 대신, 각 prop는 가장 적합한 자식 컴포넌트(SubComponent)와 연결되어 있다.
- 유연한 마크업 구조
  - 컴포넌트의 UI의 유연성을 증가시킬 수 있고, 하나의 컴포넌트로부터 다양한 케이스를 생성할 수 있다. 예를 들어, 사용자는 SubComponent의 순서를 변경하거나 이 중에서 무엇을 표시할지 정할 수 있다.

## 단점

- 너무 높은 UI의 유연성
  - 유연성이 높다는 것은 예기치 않은 동작을 유발할 가능성이 크다는 것을 의미한다. 예를 들어, 필요 없는 자식 컴포넌트가 존재하거나, 자식 컴포넌트의 순서가 잘못되어 있을 수 있고, 필수인 자식 컴포넌트가 없을 수도 있다.
    사용자가 컴포넌트를 어떻게 사용하기를 원하는지에 따라, 유연성을 어느 정도 제한하고 싶을 수도 있다. (error throw 등으로 알리기)

참고

- https://github.com/alexis-regnaud/advanced-react-patterns/tree/main/src/patterns/compound-component
- https://flowergeoji.me/react/react-pattern-compound-components/
