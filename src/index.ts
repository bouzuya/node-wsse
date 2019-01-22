import crypto from 'crypto';

const ensure = <T>(v: T | null | undefined, d: T): T => {
  return typeof v !== 'undefined' && v !== null ? v : d;
};

type SHA1Encoding = 'base64' | 'latin1' | 'hex';

class UsernameToken {
  private _created: string;
  private _nonce: string;
  private _password: string;
  private _sha1encoding: SHA1Encoding;
  private _username: string;

  constructor({ username, password, created, nonce, sha1encoding }: {
    username: string;
    password: string;
    created?: string;
    nonce?: string;
    sha1encoding?: SHA1Encoding;
  }) {
    this._username = username; // required
    this._password = password; // required
    this._created = ensure(created, this._newCreated());
    this._nonce = ensure(nonce, this._newNonce());
    this._sha1encoding = ensure<SHA1Encoding>(sha1encoding, 'base64');
  }

  public getCreated(): string {
    return this._created;
  }

  public getNonce(): string {
    return this._nonce;
  }

  public getNonceBase64(): string {
    return this._base64(this._nonce);
  }

  public getPassword(): string {
    return this._password;
  }

  public getPasswordDigest(): string {
    const text = this.getNonce() + this.getCreated() + this.getPassword();
    return this._base64(this._sha1(text, this._sha1encoding));
  }

  public getUsername(): string {
    return this._username;
  }

  public getWSSEHeader(options?: { nonceBase64?: boolean; }): string {
    const opts = ensure<{ nonceBase64?: boolean; }>(options, {});
    const nonceBase64 = ensure<boolean>(opts.nonceBase64, false);
    return 'UsernameToken ' +
      [
        `Username="${this.getUsername()}"`,
        `PasswordDigest="${this.getPasswordDigest()}"`,
        `Nonce="${nonceBase64 ? this.getNonceBase64() : this.getNonce()}"`,
        `Created="${this.getCreated()}"`
      ].join(', ');
  }

  public newToken(): UsernameToken {
    // new nonce & new created
    return new UsernameToken({
      password: this._password,
      sha1encoding: this._sha1encoding,
      username: this._username
    });
  }

  public toString(options?: { nonceBase64?: boolean; }): string {
    const opts = ensure<{ nonceBase64?: boolean; }>(options, {});
    const nonceBase64 = ensure<boolean>(opts.nonceBase64, false);
    return this.getWSSEHeader({ nonceBase64 });
  }

  private _base64(s: string): string {
    return new Buffer(s).toString('base64');
  }

  private _sha1(s: string, encoding: SHA1Encoding): string {
    const sha1 = crypto.createHash('sha1');
    sha1.update(s, 'utf8');
    return sha1.digest(encoding);
  }

  private _newCreated(): string {
    return new Date().toISOString();
  }

  private _newNonce(): string {
    return new Array(10)
      .fill(0)
      .map(() => Math.floor(Math.random() * 256).toString(16))
      .join('');
  }
}

const usernameToken = (
  { username, password }: { username: string; password: string; }
): UsernameToken => {
  return new UsernameToken({ username, password });
};

export default usernameToken;
export { UsernameToken };
