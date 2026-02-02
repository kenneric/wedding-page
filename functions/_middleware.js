export async function onRequest(context) {
  const COOKIE_NAME = "wedding_auth";
  const PASSWORD = "october"; // <--- UPDATE THIS

  const cookieHeader = context.request.headers.get("Cookie");
  
  // 1. Check if the user already has the correct cookie
  if (cookieHeader && cookieHeader.includes(`${COOKIE_NAME}=${PASSWORD}`)) {
    // They are authorized! Let them through to the website.
    return context.next();
  }

  // 2. If they just submitted the password (POST request)
  if (context.request.method === "POST") {
    const formData = await context.request.formData();
    const inputPassword = formData.get("password");

    if (inputPassword === PASSWORD) {
      // Password is correct! Give them a cookie and reload the page.
      return new Response("", {
        status: 302,
        headers: {
          "Location": "/",
          // This cookie lasts for 1 year so they don't have to log in again
          "Set-Cookie": `${COOKIE_NAME}=${PASSWORD}; Path=/; HttpOnly; Secure; Max-Age=31536000` 
        }
      });
    }
  }

  // 3. Otherwise, show the Custom Login Page
  // You can edit the CSS/HTML inside this string to match your wedding colors!
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wedding Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: 'Georgia', serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0;
            background-color: #f9f9f9; 
          }
          .login-container { 
            background: white; 
            padding: 3rem; 
            border-radius: 8px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
            text-align: center; 
            max-width: 400px;
            width: 90%;
          }
          h2 { color: #333; margin-bottom: 1rem; }
          p { color: #666; margin-bottom: 2rem; }
          input { 
            padding: 12px; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            margin-bottom: 1rem; 
            width: 100%; 
            box-sizing: border-box;
            font-size: 16px;
          }
          button { 
            background-color: #333; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 16px;
            width: 100%;
            transition: background 0.3s;
          }
          button:hover { background-color: #555; }
        </style>
      </head>
      <body>
        <div class="login-container">
          <h2>Welcome to Our Wedding</h2>
          <p>Please enter the password to view the details.</p>
          <form method="POST">
            <input type="password" name="password" placeholder="Password" required autofocus />
            <button type="submit">Enter</button>
          </form>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}