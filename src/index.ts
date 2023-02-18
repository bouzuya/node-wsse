import { createHash, randomFillSync } from "node:crypto";
import { Buffer } from "node:buffer";

const ensure = <T>(v: T | null | undefined, d: T): T => {
  return typeof v !== "undefined" && v !== null ? v : d;
};

type SHA1Encoding = "base64" | "latin1" | "hex";

class UsernameToken {
  private _created: string;
  private _nonce: string;
  private _password: string;
  private _sha1encoding: SHA1Encoding | undefined;
  private _username: string;

  constructor({
    username,
    password,
    created,
    nonce,
    sha1encoding,
  }: {
    username: string;
    password: string;
    created?: string;
    nonce?: string;
    // YOU SHOULD NOT USE THIS OPTION.
    // See: https://github.com/bouzuya/node-wsse/issues/1
    sha1encoding?: SHA1Encoding;
  }) {
    this._username = username; // required
    this._password = password; // required
    this._created = ensure(created, this._newCreated());
    this._nonce = ensure(nonce, this._newNonce());
    this._sha1encoding = sha1encoding;
  }

  public getCreated(): string {
    return this._created;
  }

  public getNonce(): string {
    return this._nonce;
  }

  public getNonceBase64(): string {
    return this._base64ForString(this._nonce);
  }

  public getPassword(): string {
    return this._password;
  }

  public getPasswordDigest(): string {
    const text = this.getNonce() + this.getCreated() + this.getPassword();
    const buf = this._sha1(text);
    return typeof this._sha1encoding === "undefined"
      ? this._base64(buf)
      : // workaround for emarsys bad implementation
      this._base64ForString(buf.toString(this._sha1encoding));
  }

  public getUsername(): string {
    return this._username;
  }

  public getWSSEHeader(options?: { nonceBase64?: boolean }): string {
    const opts = ensure<{ nonceBase64?: boolean }>(options, {});
    // workaround for hatena api
    const nonceBase64 = ensure<boolean>(opts.nonceBase64, false);
    return (
      "UsernameToken " +
      [
        `Username="${this.getUsername()}"`,
        `PasswordDigest="${this.getPasswordDigest()}"`,
        `Nonce="${nonceBase64 ? this.getNonceBase64() : this.getNonce()}"`,
        `Created="${this.getCreated()}"`,
      ].join(", ")
    );
  }

  public newToken(): UsernameToken {
    // new nonce & new created
    return new UsernameToken({
      password: this._password,
      sha1encoding: this._sha1encoding,
      username: this._username,
    });
  }

  public toString(options?: { nonceBase64?: boolean }): string {
    return this.getWSSEHeader(options);
  }

  private _base64(b: Buffer): string {
    return b.toString("base64");
  }

  private _base64ForString(s: string): string {
    return this._base64(Buffer.from(s, 'utf-8'));
  }

  private _newCreated(): string {
    return new Date().toISOString();
  }

  private _newNonce(): string {
    const buf = Buffer.alloc(10);
    randomFillSync(buf);
    return buf.toString("hex");
  }

  private _sha1(s: string): Buffer {
    const sha1 = createHash("sha1");
    sha1.update(s, "utf-8");
    return sha1.digest();
  }
}

const usernameToken = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): UsernameToken => {
  return new UsernameToken({ username, password });
};

export default usernameToken;
export { UsernameToken };
