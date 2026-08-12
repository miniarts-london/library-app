export interface User {
  active: boolean
  admin: boolean
  globalAdmin: boolean
  basicUser: boolean
  company: string
  companyId: number
  companyTz: string
  created: string
  createdBy: number
  currency: string
  displayCompanyLogo: boolean
  displayName: string
  email: string
  firstName: string
  homepage: string
  id: number
  identityId: number
  intercomToken: string
  intercomUserId: string
  lang: string
  lastLogin: string
  lastName: string
  loginAvailable: boolean | null
  loginTrials: number
  mustChangePassword: boolean
  phone: null | string
  previousLogin: string
  provider: string
  pwdBeforeRequest: string
  randomPwdCreated: boolean | null
  role: Role
  roleId: number
  saltBeforeRequest: string
  siteId: number
  super: boolean
  updated: string
  updatedBy: number
}

export interface Role {
  id: number
  name: string

  companyId: number
}

export interface SsoStatus {
  providerId: string
  displayName: string
  email: string
  siteUsers: (User & { xsrfToken: string })[]
}

export interface SsoAuthMethod {
  loginUrl: string
  label: string
  iconUrl: string
  priority: number
}

export interface SsoAuthMethodMap {
  [id: string]: SsoAuthMethod
}

export interface License {
  ID: number
  ProductName: string
  Expires: number
}
