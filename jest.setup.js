import '@testing-library/jest-dom'

// Enable fetch mocks
require('jest-fetch-mock').enableMocks()

beforeAll(() => {
  if (!document.getElementById('modal-root')) {
    const modalRoot = document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')
    document.body.appendChild(modalRoot)
  }
})
// jest.mock('remark-gfm', () => ({}))

// Allow router mocks.
// eslint-disable-next-line no-undef
const NAVIGATION_PROPS = {
  pathname: '/',
  // router: TEST_ROUTER_MOCK,
  searchParams: {
    get: () => null,
    entries: () => []
  }
}
jest.mock('next/navigation', () => ({
  usePathname: () => NAVIGATION_PROPS.pathname,
  useSearchParams: () => NAVIGATION_PROPS.searchParams,
  useServerInsertedHTML: () => {
  },
  redirect: jest.fn()
}))


