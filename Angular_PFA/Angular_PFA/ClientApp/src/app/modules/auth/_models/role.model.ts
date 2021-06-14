export class Role {
    'id': 1;
    'name': string;
    'guard_name': string;
    'created_at': Date;
    'updated_at': Date;
    'pivot': Pivot;
}

class Pivot {
    'model_id': number;
    'role_id': number;
    'model_type': string;
}
