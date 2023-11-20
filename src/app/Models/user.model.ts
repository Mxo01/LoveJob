export interface User {
	username: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	companyName?: string;
	position?: string;
	token?: string;
	refreshToken?: string;
	refreshTokenExpiry?: Date;
	role?: string;
	resetPasswordToken?: string;
	resetPasswordExpiry?: Date;
}
