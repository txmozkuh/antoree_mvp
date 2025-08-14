export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student'
}

export type User = {
  fullName: string
  name: string
  email: string
  token: string
  role: UserRole
}
