import type { JWTPayload } from "jose";

// Function to verify jwt
export async function verifyJWT(jwt: string, secret: string): Promise<JWTPayload> {
  const { jwtVerify } = await (new Function('return import("jose")')()) as typeof import("jose");
  const jsecret = new TextEncoder().encode(secret);
  const result = await jwtVerify(jwt, jsecret);
  return result.payload;
}

// Generate a new jwt function
export async function generateSignedJWT(account: {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  role: "standard" | "superadmin"
},
): Promise<string>{
  const secret = process.env.JWT_SECRET_KEY;
  const jsecret = new TextEncoder().encode(secret);

  // Dynamically import signjwt since the regular import isn't supported
  const { SignJWT } = await (new Function('return import("jose")')()) as typeof import("jose");
  return await new SignJWT(account)
  .setProtectedHeader({ alg: "HS256"})
  .setIssuedAt()
  .setExpirationTime("9h")
  .setSubject(account.id.toString())
  .sign(jsecret);
}