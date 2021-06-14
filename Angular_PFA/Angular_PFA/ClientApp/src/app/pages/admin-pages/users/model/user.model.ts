import { RoleModel } from "../../roles/model/roles.model";

export class UserModel {
    id: number;
    fname: string;
    lname: string;
    cin: string;
    email: string;
    'email_verified_at': string | null;
    'password_modified': number;
    'created_at': string;
    'updated_at': string;
    'deleted_at': string | null;
    roles:RoleModel[];
}
