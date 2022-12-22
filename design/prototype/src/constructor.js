{
  // constructor functions method

  function Circle(radius) {
    this.radius = radius;
    this.getArea = function () {
      return Math.PI * this.radius ** 2;
    };
  }

  const circle1 = new Circle(1);
  const circle2 = new Circle(2);

  console.log(circle1.getArea === circle2.getArea); // false
  // 생성되는 인스턴스마다 해당 메서드를 중복 생성 및 중복 소유
  // -> 메모리 및 퍼포먼스 낭비
}

{
  // constructor functions prototype

  function Circle(radius) {
    this.radius = radius;
  }

  Circle.prototype.getArea = function () {
    return Math.PI * this.radius ** 2;
  };

  const circle1 = new Circle(1);
  const circle2 = new Circle(2);

  console.log(circle1.getArea === circle2.getArea); // true
  console.log(circle1.__proto__); // { getArea: ƒ, constructor: ƒ }

  // 모든 객체는 __proto__ 라는 접근자 프로퍼티를 통해 자신의 prototype ([[Prototype]] 내부슬롯)에 접근할 수 있다.
}
