// import { MethodToStub } from "ts-mockito/lib/MethodToStub"
import { instance, when, capture, verify, reset } from "ts-mockito"
// import { capture, instance, reset, verify, when } from "ts-mockito"
import { mockFn } from './mockFn'
import { MethodToStub } from "ts-mockito/lib/MethodToStub"

test('does create function mock', () => {
  const fn = (): number => 42
  const mockedFoo = mockFn<typeof fn>()
  expect(mockedFoo instanceof MethodToStub).toBe(true)
})

test('does when', () => {
  const mockedFoo = mockFn<(s: string) => number>()
  const foo = instance(mockedFoo)
  when(mockedFoo("foo")).thenReturn(42)
  expect(foo("foo")).toBe(42)
})

test('does capture', () => {
  const mockedFoo = mockFn<(n: number) => void>()
  const foo = instance(mockedFoo)
  foo(42)
  const [arg] = capture(mockedFoo).last()
  expect(arg).toBe(42)
})

test("does verify", () => {
  const mockedFoo = mockFn<(n: number) => void>()
  const foo = instance(mockedFoo)
  foo(42)
  verify(mockedFoo(42)).once()
})

it("does reset", () => {
  const mockedFoo = mockFn<(s: string) => number>()
  const foo = instance(mockedFoo)
  when(mockedFoo("foo")).thenReturn(41)
  reset(mockedFoo)
  expect(foo("foo")).toBe(null)
})
