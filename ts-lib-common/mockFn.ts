import { mock, instance } from 'ts-mockito'

interface MockFn<T> {
  call: T
}

export function mockFn<T>(): T {
  const fnMock = mock<MockFn<T>>()
  const mockInstance = instance(fnMock)
  const mocker = fnMock.call;

  (mocker as any).__tsmockitoInstance = mockInstance.call;
  (mocker as any).__tsmockitoMocker = (fnMock as any).__tsmockitoMocker

  return mocker
}
