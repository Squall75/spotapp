import OAuthSendBack from '../../lib/OAuthSendBack';

export default function Callback() {
  OAuthSendBack();
  return false;
}
