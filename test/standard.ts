import assert from "node:assert";
import usernameToken, { UsernameToken } from "../src/index.js";
import { Test, fixture, test } from "./helper.js";

const category = "standard ";
const setUp = (): {
  created: string;
  digest: string;
  nonce: string;
  nonceBase64: string;
  nonceBase64Header: string;
  header: string;
  password: string;
  token1: UsernameToken;
  token2: UsernameToken;
  token3: UsernameToken;
  username: string;
} => {
  const created = "2003-12-15T14:43:07Z";
  const digest = "quR/EWLAV4xLf9Zqyw4pDmfV9OY=";
  const nonce = "d36e316282959a9ed4c89851497a717f";
  const nonceBase64 = "ZDM2ZTMxNjI4Mjk1OWE5ZWQ0Yzg5ODUxNDk3YTcxN2Y=";
  const password = "taadtaadpstcsm";
  const username = "bob";
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
    nonceBase64,
    nonceBase64Header:
      "UsernameToken " +
      [
        `Username="${username}"`,
        `PasswordDigest="${digest}"`,
        `Nonce="${nonceBase64}"`,
        `Created="${created}"`,
      ].join(", "),
    password,
    // specify created & nonce
    token1: new UsernameToken({ created, nonce, username, password }),
    // auto generate created & nonce
    token2: new UsernameToken({ username, password }),
    // auto generate created & nonce (use smart constructor)
    token3: usernameToken({ username, password }),
    username,
  };
};
const tearDown = (): void => void 0;

const tests: Test[] = [
  test(
    category + "#getCreated",
    fixture(setUp, tearDown, ({ created, token1, token2, token3 }) => {
      assert(token1.getCreated() === created);
      assert(token2.getCreated() !== null);
      assert(token3.getCreated() !== null);
    })
  ),
  test(
    category + "#getNonce",
    fixture(setUp, tearDown, ({ nonce, token1, token2, token3 }) => {
      assert(token1.getNonce() === nonce);
      assert(token2.getNonce() !== null);
      assert(token3.getNonce() !== null);
    })
  ),
  test(
    category + "#getNonceBase64",
    fixture(setUp, tearDown, ({ nonceBase64, token1, token2, token3 }) => {
      assert(token1.getNonceBase64() === nonceBase64);
      assert(token2.getNonceBase64() !== null);
      assert(token3.getNonceBase64() !== null);
    })
  ),
  test(
    category + "#getPassword",
    fixture(setUp, tearDown, ({ password, token1, token2, token3 }) => {
      assert(token1.getPassword() === password);
      assert(token2.getPassword() === password);
      assert(token3.getPassword() === password);
    })
  ),
  test(
    category + "#getPasswordDigest",
    fixture(setUp, tearDown, ({ digest, token1 }) => {
      assert(token1.getPasswordDigest() === digest);
    })
  ),
  test(
    category + "#getUsername",
    fixture(setUp, tearDown, ({ token1, token2, token3, username }) => {
      assert(token1.getUsername() === username);
      assert(token2.getUsername() === username);
      assert(token3.getUsername() === username);
    })
  ),
  test(
    category + "#getWSSEHeader with no args",
    fixture(setUp, tearDown, ({ header, token1 }) => {
      assert(token1.getWSSEHeader() === header);
    })
  ),
  test(
    category + "#getWSSEHeader with { nonceBase64: true }",
    fixture(setUp, tearDown, ({ nonceBase64Header, token1 }) => {
      assert(token1.getWSSEHeader({ nonceBase64: true }) === nonceBase64Header);
    })
  ),
  test(
    category + "#newToken",
    fixture(setUp, tearDown, ({ token1 }) => {
      const newToken = token1.newToken();
      assert(newToken.getUsername() === token1.getUsername());
      assert(newToken.getPassword() === token1.getPassword());
      assert(newToken.getCreated() !== token1.getCreated());
      assert(newToken.getNonce() !== token1.getNonce());
    })
  ),
  test(
    category + "#toString",
    fixture(setUp, tearDown, ({ header, token1 }) => {
      assert(token1.toString() === header);
      assert(token1 + "" === header);
    })
  ),
  test(
    category + "#toString with { nonceBase64: true }",
    fixture(setUp, tearDown, ({ nonceBase64Header, token1 }) => {
      assert(token1.toString({ nonceBase64: true }) === nonceBase64Header);
    })
  ),
];

export { tests };
