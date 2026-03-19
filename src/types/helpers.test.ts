import type { Equal, ExpectFalse, IsUnion, TrueCases } from 'type-testing';
import type {
  Join,
  OneOfUnion,
  Range,
  Trim,
  TupleOf,
  UnionToIntersection,
} from './helpers.ts';

type TupleOfTest = TrueCases<
  [
    Equal<TupleOf<string, 0>, []>,
    Equal<TupleOf<string, 3>, [string, string, string]>,
    Equal<TupleOf<number, 3>, [number, number, number]>,
    Equal<
      TupleOf<number | string, 3>,
      [number | string, number | string, number | string]
    >,
  ]
>;

type TupleToStringTest = TrueCases<
  [
    Equal<Join<[]>, ''>,
    Equal<Join<[1, '2', 3]>, '123'>,
    Equal<Join<[-123, -456]>, '-123-456'>,
    Equal<Join<[1, '2', 3], ' '>, '1 2 3'>,
    Equal<Join<string[], ' '>, string>,
    Equal<Join<(string | number)[], ' '>, string>,
  ]
>;

type Spaces = Join<TupleOf<' ', 999>>;

type TestString = 'lorem ipsum dolor sit amet';

type TrimTest = TrueCases<
  [
    Equal<Trim<TestString>, TestString>,
    Equal<Trim<`${Spaces}${TestString}`>, TestString>,
    Equal<Trim<`${TestString}${Spaces}`>, TestString>,
    Equal<Trim<`${Spaces}${TestString}${Spaces}`>, TestString>,
  ]
>;

type RangeTest = TrueCases<
  [
    Equal<Range<0>, never>,
    Equal<Range<1>, 0>,
    Equal<Range<2>, 0 | 1>,
    Equal<Range<3>, 0 | 1 | 2>,
    Equal<Range<0, 3>, 0 | 1 | 2>,
    Equal<Range<1, 3>, 1 | 2>,
    Equal<Range<2, 2>, never>,
  ]
>;

type X = { x: number };
type Y = { y: number };
type Z = { z: number };

type UnionToIntersectionTest = TrueCases<
  [
    Equal<UnionToIntersection<never>, never>,
    Equal<UnionToIntersection<undefined>, undefined>,
    Equal<UnionToIntersection<null>, null>,
    Equal<UnionToIntersection<false>, false>,
    Equal<UnionToIntersection<true>, true>,
    Equal<UnionToIntersection<true | false>, true & false>,
    Equal<UnionToIntersection<true | false | null>, true & false & null>,
    Equal<
      UnionToIntersection<true | false | null | undefined>,
      true & false & null & undefined
    >,
    Equal<UnionToIntersection<{ a: 1 }>, { a: 1 }>,
    Equal<UnionToIntersection<X | Y | Z>, X & Y & Z>,
  ]
>;

type OneOfUnionTest = TrueCases<
  [
    Equal<OneOfUnion<never>, never>,
    Equal<OneOfUnion<undefined>, undefined>,
    Equal<OneOfUnion<null>, null>,
    Equal<OneOfUnion<false>, false>,
    Equal<OneOfUnion<X>, X>,
    ExpectFalse<IsUnion<OneOfUnion<X | Y | Z>>>,
    Equal<OneOfUnion<X | Y | Z>, Z>,
  ]
>;
