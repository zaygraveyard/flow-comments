import { type AX, type BX, CX } from './types';

export type { AE } from './types';
import lib from 'library';
export { fooE } from 'foo';
export type { BE, CE } from './types';

import type AI, { BI, CI } from './types';
import type DI from './types';
import typeof EI, { FI, GI } from './types';

import A1, { B1, type C1, type D1, E1 } from './types';
import F1, { typeof G1, H1, type I1 } from './types';
import { type J1 } from './types';
import K1, { L1, M1 } from './types';
import './types';

/*a*/const/*b*/ /*c*/x/*d*/ = /*e*/(/*f*/foo/*g*/  ? /*h*/)/*i*/ => /*j*/{/*k*/}/*l*/
/*a*/const/*b*/ /*c*/y/*d*/ = /*e*/(/*f*/foo/*g*/  : /*x*/ string /*h*/)/*i*/ => /*j*/{/*k*/}/*l*/
/*a*/class/*b*/ Foo/*c*/ extends/*d*/ Bar/*e*/<T>/*f*/ {/*g*/}/*h*/
/*a*/class/*b*/ X/*c*/ {/*d*/
  /*e*/
  /*f*/a/*g*/: number/*h*/
  /*i*/b/*j*/: /*k*/?string/*l*/
  /*m*/
/*n*/}/*o*/
/*a*/class/*b*/ Y/*c*/ {/*d*/
  /*e*/
  /*f*/a/*g*/: number/*h*/ = /*x*/ 2 /*y*/
  /*i*/b/*j*/: /*k*/?string/*l*/ = /*1*/ '3'/*2*/
  /*5*/c/*6*/: /*7*/?number/*8*/
  /*m*/
/*n*/}/*o*/
/*a*/class/*b*/ Z/*c*/ {/*d*/
  /*e*/
  /*f*/foo/*h*/ = /*x*/ 2 /*y*/
  /*i*/bar/*j*/: /*k*/number/*l*/ = /*1*/ 3/*2*/
  /*5*/baz/*6*/: /*7*/?string/*8*/
  /*m*/
/*n*/}/*o*/
/*1*/class/*2*/ Foo2/*3*//*4*/ implements/*5*/ Bar, Baz/*6*/ {/*7*/}/*8*/
class Foo3<S, T> implements Bar, Baz {}
class Foo4<T> extends Bar {}
class Foo5<T> /* inner */ extends Bar<R> {}
/*a*/class /*b*/Baz/*c*/<T>/*d*/extends /*e*/Bar/*f*/<R>/*g*/ {/*h*/}/*i*/
/*1*/class/*2*/ FooB/*c*/<T>/*d*/extends /*e*/Bar/*f*/<R>/*3*//*4*/ implements/*5*/ Bar, Baz/*6*/ {/*7*/}/*8*/
class Foo6<T> {}
declare var foo
declare var foo;
declare function foo(): void
declare function foo(): void;
declare function foo<T>(): void;
declare function foo(x: number, y: string): void;
declare class A {}
declare class A<T> extends B<T> { x: number }
declare class A { static foo(): number, static x : string }
declare class A { static [ indexer: number]: string }
declare class A { static () : number }
declare class A mixins B<T>, C {}
declare type A0 = string
declare type T<U> = { [k:string]: U }
declare interface I { foo: string }
declare interface I0<T> { foo: T }
function foo_0(numVal?) {}
function foo_1(numVal? = 2) {}
function foo_2(numVal: number) {}
function foo_3(numVal?: number) {}
function foo_4(numVal: number = 2) {}
function foo_5(numVal?: number = 2) {}
class C<+T2, -U> {}
function f<+T2, -U>() {}
type T2<+T2, -U> = {};
export type GraphQLFormattedError = number;
export type GraphQLFormattedError2 = {
  message: string,
  locations?: Array<{
    line: number,
    column: number
  }>
};
export interface foo0 { p: number }
export interface foo2<T> { p: T }
function add({ a, b }: {a: number, b: number}): number {
  return a + b;
}
const { a, b }: { a: number, b: number } = { a: 1, b: 2 };
// @flow
var obj = {
  method(a: string): number {
    return 5 + 5;
  }
};
function a2() {}
opaque type A_1 = number;
opaque type B = {
  name: string;
};

opaque type union =
 | {type: "A"}
 | {type: "B"}
;

opaque type overloads =
  & ((x: string) => number)
  & ((x: number) => string)
;
function multiply(num?: number) {}
function foo$(bar?) {}
function foo$2(bar?: string) {}
/**/
type Fooz = number;
/*a*/
type Fooz2 = number;
/*b*/
var foo3;
/*c*/
type Bar = number;
/*d*/
// @flow
class Ca {
  m(x: number): string {
    return 'a';
  }
}
// @flow
class Ca2 {
  m(x: number): string {
    return 'a';
  }
}
function ab() {}
type A_2 = number;
type B_2 = {
  name: string;
};

type union_2 =
 | {type: "A"}
 | {type: "B"}
;

type overloads_1 =
  & ((x: string) => number)
  & ((x: number) => string)
;
type T_2 = /*test*/ number;
type T2_2 = /* *-/ */ number;
type CustomType = {
/** This is some documentation. */
name: string;
};
var ac = (y: any);
var ad = ((y: foo): any);
function fooe(x: number): string {}
