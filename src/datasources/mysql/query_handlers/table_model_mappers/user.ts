import { IUser, User } from '@models'

export function getUserFromUserTbl(userTable){
  const user:IUser = new User(userTable.firstname, userTable.lastname, userTable.email,userTable.phone);
  //TODO: map remaining fields
  return user;
}
