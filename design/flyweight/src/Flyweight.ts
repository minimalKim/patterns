{
  // Flyweight
  class TreeType {
    name: string;
    color: string;
    texture: string;

    constructor(name: string, color: string, texture: string) {
      this.name = name;
      this.color = color;
      this.texture = texture;
    }

    public draw(canvas: any, x: number, y: number): void {
      // 1. 해당 type에 맞는 color, texture, someValueToDraw로 이미지를 생성한다.
      // 2. 주어진 canvas의 x, y축에 그린다.
    }
  }

  // FlyweightFactory
  class TreeFactory {
    static treeTypes: TreeType[] = [];

    static getOrCreateTreeType(
      name: string,
      color: string,
      texture: string
    ): TreeType {
      let type = this.treeTypes.find((treeType) => treeType.name === name);

      if (!type) {
        type = new TreeType(name, color, texture);
        this.treeTypes.push(type);
      }
      return type;
    }
  }

  // 아래 Client의 집합 멤버
  // - type이 중복되어 생성 가능
  class Tree {
    type: TreeType;
    x: number;
    y: number;

    constructor(type: TreeType, x: number, y: number) {
      this.type = type;
      this.x = x;
      this.y = y;
    }

    draw(canvas: any) {
      this.type.draw(canvas, this.x, this.y);
    }
  }

  // Client
  class FactoryUseForest {
    static trees: Tree[] = [];

    static plantTree(
      name: string,
      color: string,
      texture: string,
      x: number,
      y: number
    ) {
      // type 객체를 새로 생성하지 않고 기존의 type객체를 사용할 수 있다.
      const type = TreeFactory.getOrCreateTreeType(name, color, texture);
      const tree = new Tree(type, x, y);
      this.trees.push(tree);
    }

    static draw(canvas: any) {
      this.trees.forEach((tree) => tree.draw(canvas));
    }
  }

  class FactoryNotUseForest {
    static trees: Tree[] = [];

    static plantTree(
      name: string,
      color: string,
      texture: string,
      x: number,
      y: number
    ) {
      const tree = new Tree({ name, color, texture, draw: () => {} }, x, y);
      this.trees.push(tree);
    }

    static draw(canvas: any) {
      this.trees.forEach((tree) => tree.draw(canvas));
    }
  }

  FactoryUseForest.plantTree("소나무", "초록", "침엽수", 10, 20);
  FactoryUseForest.plantTree("소나무", "초록", "침엽수", 20, 40);

  FactoryNotUseForest.plantTree("소나무", "초록", "침엽수", 10, 20);
  FactoryNotUseForest.plantTree("소나무", "초록", "침엽수", 20, 40);

  console.log(
    FactoryUseForest.trees[0].type === FactoryUseForest.trees[1].type // true
  );

  console.log(
    FactoryNotUseForest.trees[0].type === FactoryNotUseForest.trees[1].type // false
  );
}
