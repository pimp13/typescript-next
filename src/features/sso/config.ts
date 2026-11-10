const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001").replace(
  /\/$/,
  "",
);
const IDP_URL = (process.env.NEXT_PUBLIC_SSO_IDP_URL ?? "http://localhost:8080").replace(
  /\/$/,
  "",
);

export const ssoConfig = {
  apiUrl: API_URL,
  appUrl: APP_URL,
  idpUrl: IDP_URL,
  completePath: "/sso/complete",
  idpLoginPath: "/sso/idp-login",
} as const;

export function buildSsoLoginUrl(returnTo = `${APP_URL}/sso/complete`) {
  const url = new URL(`${API_URL}/api/sso/login`);
  url.searchParams.set("return_to", returnTo);
  return url.toString();
}

export function isAllowedIdpReturnTo(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    const allowed = new URL(`${IDP_URL}/api/sso/authorize`);
    return (
      url.origin === allowed.origin &&
      url.pathname === allowed.pathname
    );
  } catch {
    return false;
  }
}
