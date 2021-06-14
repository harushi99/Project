import { AuthModel } from './auth.model';
import {Role} from './role.model';

export class UserModel extends AuthModel {
  id: number;
  password: string;
  'password_modified': number;
  cin: string;
  nce: string;
  level: string;
  email: string;
  'email_verified_at': any;
  roles: Role[];
  'created_at': string;
  'updated_at': string;
  'deleted_at': string;
  // Personal information
  fname: string;
  lname: string;
  fullname: string;
  // email settings
  emailSettings: {
    emailNotification: boolean,
    sendCopyToPersonalEmail: boolean,
    activityRelatesEmail: {
      youHaveNewNotifications: boolean,
      youAreSentADirectMessage: boolean,
      someoneAddsYouAsAsAConnection: boolean,
      uponNewOrder: boolean,
      newMembershipApproval: boolean,
      memberRegistration: boolean
    },
    updatesFromKeenthemes: {
      newsAboutKeenthemesProductsAndFeatureUpdates: boolean,
      tipsOnGettingMoreOutOfKeen: boolean,
      thingsYouMissedSindeYouLastLoggedIntoKeen: boolean,
      newsAboutMetronicOnPartnerProductsAndOtherServices: boolean,
      tipsOnMetronicBusinessProducts: boolean
    }
  };

  setUser(user: any) {
    this.id = user.id;
    this.lname = user.lname || '';
    this.fname = user.fname || '';
    this.fullname = `${user.fname} ${user.lname}`;
    this.password = user.password || '';
    this.email = user.email || '';
    this.level = user.level;
    this.roles = user.roles || [];
    this.password_modified = user.password_modified;
    this.cin = user.cin;
    this.nce = user.nce;
    this.email_verified_at = user.email_verified_at;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
    this.deleted_at = user.deleted_at;
  }
}
