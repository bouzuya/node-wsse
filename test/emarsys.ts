import assert from "power-assert";
import { UsernameToken } from "../src";
import { Test, fixture, test } from "./helper";

const category = "Emarsys bad implementation";
const setUp = (): {
  created: string;
  digest: string;
  nonce: string;
  header: string;
  password: string;
  sha1encoding: string;
  token: UsernameToken;
  username: string;
} => {
  // http://documentation.emarsys.com/resource/developers/api/getting-started/authentication/
  // http://documentation.emarsys.com/resource/developers/api/getting-started/authentication/ruby-sample/
  const created = "2014-03-20T12:51:45Z";
  const digest = "YWQyNWE5Y2JkOTY2ZTU1ODg2M2QzNzVhNDZlZGQwZjg5YjZlZTk4Yw==";
  const nonce = "d36e316282959a9ed4c89851497a717f";
  const password = "customersecret";
  const username = "customer001";
  const sha1encoding = "hex";
  return {
    created,
    digest,
    header:
      "UsernameToken " +
      [
        `Username="${username}"`,
        `PasswordDigest="${digest}"`,
        `Nonce="${nonce}"`,
        `Created="${created}"`,
      ].join(", "),
    nonce,
    password,
    sha1encoding,
    // specify sha1encoding
    token: new UsernameToken({
      created,
      nonce,
      password,
      sha1encoding,
      username,
    }),
    username,
  };
};
const tearDown = (): void => void 0;

const tests: Test[] = [
  test(
    category + "#getCreated",
    fixture(setUp, tearDown, ({ created, token }) => {
      assert(token.getCreated() === created);
    })
  ),
  test(
    "#getNonce",
    fixture(setUp, tearDown, ({ nonce, token }) => {
      assert(token.getNonce() === nonce);
    })
  ),
  test(
    "#getNonceBase64",
    fixture(setUp, tearDown, () => {
      // do nothing
    })
  ),
  test(
    "#getPassword",
    fixture(setUp, tearDown, ({ password, token }) => {
      assert(token.getPassword() === password);
    })
  ),
  test(
    "#getPasswordDigest",
    fixture(setUp, tearDown, ({ digest, token }) => {
      assert(token.getPasswordDigest() === digest);
    })
  ),
  test(
    "#getUsername",
    fixture(setUp, tearDown, ({ token, username }) => {
      assert(token.getUsername() === username);
    })
  ),
  test(
    "#getWSSEHeader with no args",
    fixture(setUp, tearDown, ({ header, token }) => {
      assert(token.getWSSEHeader() === header);
    })
  ),
  test(
    "#getWSSEHeader with { nonceBase64: true }",
    fixture(setUp, tearDown, () => {
      // TODO
    })
  ),
  test(
    "#newToken",
    fixture(setUp, tearDown, ({ token }) => {
      const newToken = token.newToken();
      assert(newToken.getUsername() === token.getUsername());
      assert(newToken.getPassword() === token.getPassword());
      assert(newToken.getCreated() !== token.getCreated());
      assert(newToken.getNonce() !== token.getNonce());
      // private method
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assert((newToken as any)._sha1encoding === (token as any)._sha1encoding);
    })
  ),
  test(
    "#toString",
    fixture(setUp, tearDown, ({ header, token }) => {
      assert(token.toString() === header);
      assert(token + "" === header);
    })
  ),
  test(
    "#toString with { nonceBase64: true }",
    fixture(setUp, tearDown, () => {
      // do nothing
    })
  ),
];

export { tests };
