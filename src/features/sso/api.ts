import { buildSsoLoginUrl, ssoConfig } from "./config";

export function startSsoLogin(returnTo = `${ssoConfig.appUrl}${ssoConfig.completePath}`) {
  window.location.assign(buildSsoLoginUrl(returnTo));
}
