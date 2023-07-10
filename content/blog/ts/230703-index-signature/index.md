---
title: TS 개념 정리
date: "2023-07-05T22:12:03.284Z"
description:
category: TS
---

## 인덱스 시그니쳐

```typescript
interface Phone {
  [name: string]: string
}

const phone: Phone = {
  cpu: "A15",
  sim: "eSIM",
  brand : "Apple",
  ...
}
```

객체의 속성의 개수가 정해져 있지 않다면 인덱스 시그니쳐를 사용하는 게 좋다.

## 유니온타입

```typescript
interface Phone {
  cpu: string
  sim: string
}
interface Laptop {
  cpu: string
  gpu: string
}

function getDevice(device: Phone | Laptop) {
  // device는 Phone과 Laptop 중 어떤 타입인지 정해져있지 않기 때문에
  // 두 인터페이스가 공통으로 갖고 있는 속성만 접근 가능하다.

  console.log(device.cpu) // ✅
  console.log(device.sim) // ❌

  // typeof나 in 연산자를 이용하여 타입을 필터링해주면 접근이 가능해진다.
  if ("sim" in device) {
    console.log(device.sim)
  }
  if ("gpu" in device) {
    console.log(device.gpu)
  }
}
```

## 인터섹션 타입

```typescript
interface Phone {
  cpu: string
  sim: string
}
interface Laptop {
  cpu: string
  gpu: string
}

function getDevice(device: Phone & Laptop) {
  // device는 Phone과 Laptop 의 속성을 모두 만족시켜야 한다.
  console.log(device.cpu) // ✅
  console.log(device.sim) // ✅
}

getDevice({ cpu: "Intel", sim: "eSIM" }) // ❌, Laptop이 갖고 있는 속성도 만족시켜야함.
```

## 타입 alias

```typescript
type Phone = {
  cpu: string
  sim: string
}
const myPhone: Phone = {
  cpu: "A16",
  sim: "physical",
}
```

```typescript
interface Phone {
  cpu: string
  sim: string
}
interface Laptop {
  cpu: string
  gpu: string
}
// type은 연산자를 이용한 확장 가능
type Device = Phone | Laptop
```

## enum

#### 숫자형 enum

```typescript
enum Count {
  ZERO,
  ONE,
  TWO,
}
// 별도로 값을 지정하지 않으면 0부터 1씩 증가하면서 값이 배정된다
console.log(Count.ZERO) // 0
console.log(Count.ONE) // 1
console.log(Count.TWO) // 2
```

#### 문자형 enum

```typescript
enum Color {
  PRIMARY = "blue",
  SECONDARY = "white",
}
console.log(Color.PRIMARY) // blue
console.log(Color.SECONDARY) // white
```

#### const enum

기본적인 enum은 컴파일 시, `[속성이름]=값`을 연결해주는 별도의 객체를 생성한다.  
하지만 enum 앞에 const를 붙이면 컴파일 시 객체를 생성하지 않고 `[속성이름]`을 직접 `값`으로 치환해버리기 때문에 컴파일 코드의 양을 줄일 수 있다.

## 제네릭

```typescript
function getValue<T>(value: T): T {
  return value
}
// 파라미터에 어떤 타입을 넣느냐에 따라 value의 타입이 정해짐
console.log(gatValue(10)) // number type
console.log(gatValue("hello")) // string type
```

#### `T extends type`

```typescript
function getValue<T extends string>(value: T) {
  return value.length
}
// extends 키워드를 통해 제네릭으로 받을 타입을 제한할 수 있음
const num = getValue(10) // ❌
const str = getValue("hello") // ✅
```

#### `T extends keyof type`

```typescript
interface Phone {
  cpu: string
  sim: string
}
type PhoneType = keyof Phone // "cpu" | "sim"

function getPhoneComponent<T extends keyof Phone>(component: T) {
  return component
}
const component1 = getPhoneComponent("cpu") //  ✅
const component2 = getPhoneComponent("gpu") // ❌
```

## Non-null assertion

```typescript
const elem = document.querySelector(".elem")
// elem : HTMLElement | null
elem.textContent = "Hello" // ❌, elem is possibly null;
elem!.textContent = "Hello" // ✅
```

## 유틸리티 타입

#### Pick

특정 타입만 골라내서 새로운 타입을 만듦

```typescript
interface Phone {
  cpu: string
  ram: string
  sim: string
}
type Cpu = Pick<Phone, "cpu">
const myPhone: Cpu = {
  cpu: "A15",
}
```

#### Omit

특정 타입만 제외해서 새로운 타입을 만듦

```typescript
interface Phone {
  cpu: string
  ram: string
  sim: string
}
type withoutCpu = Omit<Phone, "cpu">
const myPhone: withoutCpu = {
  ram: "8GB",
  sim: "physical",
}
```

#### Partial

모든 타입을 옵셔널 파라미터로 바꿔서 새로운 타입으로 만듦

```typescript
interface Phone {
  cpu: string
  ram: string
  sim: string
}
type PartialPhone = Partial<Phone>
/*
  PartialPhone = {
    cpu?:string
    ram?:string
    sim?:string
  }
*/
const myPhone: PartialPhone = {
  ram: "8GB",
}
const yourPhone: PartialPhone = {
  cpu: "A16",
  ram: "8GB",
}
```

#### Exclude

유니온 타입에서 특정 타입을 제외하여 새로운 타입으로 만듦

```typescript
type PhoneBrands = "Samsung" | "Apple" | "LG"
type WithoutApple = Exclude<PhoneBrands, "Apple"> // 'Samsung' | 'LG'
```

#### Record

key-value 값 형태의 객체 타입을 만들어줌

```typescript
type PhoneBrands = "Samsung" | "Apple" | "LG"
interface Phone {
  cpu: string
  ram: string
  sim: string
}
type PhoneComponent = Record<PhoneBrands, Phone>
/*
 type PhoneComponent = {
  Samsung: Phone
  Apple: Phone
  LG: Phone
}
*/
```

## 맵드 타입

이미 정의된 타입을 가지고 새로운 타입을 만들어줌

#### in

유니온타입의 원소를 하나씩 순회하면서 string 형태로 뽑아줌

```typescript
type PhoneBrands = "Samsung" | "Apple" | "LG"
type Phone = {
  [brand in PhoneBrands]: string
}
/*
type Phone = {
    Samsung: string;
    Apple: string;
    LG: string;
}
*/
```

#### in keyof

객체의 각 속성을 하나씩 순회하면서 string 형태로 뽑아줌

```typescript
interface Phone {
  cpu: string
  ram: string
  sim: string
}
type PhoneIncluded = {
  [phone in keyof Phone]: boolean
}
/*
type PhoneIncluded = {
    cpu: boolean;
    ram: boolean;
    sim: boolean;
}
*/
```

## Reference

[쉽게 시작하는 타입스크립트(장기효)](https://www.yes24.com/Product/Goods/119410497)
