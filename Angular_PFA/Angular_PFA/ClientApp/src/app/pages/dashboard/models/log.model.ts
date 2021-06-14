export class LogModel {
	id: number;
	category: string;
	target_id: number;
	user_id: number;
	user_fullname: string;
	user_roles: string[];
	event: string;
	created_at: string;
	updated_at: string;
}