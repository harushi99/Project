export class AuthModel {
  // tslint:disable-next-line:variable-name
  access_token: string;
  // tslint:disable-next-line:variable-name
  // refresh_token: string;
  // tslint:disable-next-line:variable-name
  token_type: string;
  // tslint:disable-next-line:variable-name
  expires_in: number;

  setAuth(auth: any) {
    this.access_token = auth.accessToken;
    // this.refresh_token = auth.refreshToken;
    this.expires_in = auth.expiresIn;
    this.token_type = auth.tokenType;
  }
}
