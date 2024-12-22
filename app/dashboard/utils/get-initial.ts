export default function getInitials(email: string) {
  const username = email.split('@')[0];
  const matches = username.match(/\b(\w)/g);
  return matches ? matches.join('').toUpperCase() : '';
}
