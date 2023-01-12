// export default function (x: number) {
//   return x + x;
// } // 가능

// export default function double(x: number) {
//   return x + x;
// } // 가능

// export default (x: number) => x + x; // 가능

export default const double = (x: number) => x + x; // 불가능
