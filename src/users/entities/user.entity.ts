import { Gender, Role, Status, User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  username: string;
  password: string;
  fullNameEn: string;
  fullNameKh: string;
  role: Role;
  gender: Gender;
  forgotPasswordToken: string;
  status: Status;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  departmentId: string;
}
