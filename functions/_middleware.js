export async function onRequest(context) {
  const authHeader = context.request.headers.get('Authorization');
  const USERNAME = "guest";
  const PASSWORD = "change_this_password"; // <--- UPDATE THIS

  if (authHeader) {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials).split(':');
    if (credentials[0] === USERNAME && credentials[1] === PASSWORD) {
      return context.next();
    }
  }

  return new Response('Authentication Required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Wedding Guest Area"' }
  });
}