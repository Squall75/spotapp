import OAuthSendBack from '../../lib/OauthSendBack';

export default function Callback() {
  OAuthSendBack();
  return false;
}
