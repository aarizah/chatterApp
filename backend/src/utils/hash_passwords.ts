import argon2 from "argon2";

export const ARGON2_OPTS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,  // ✔ Argon2id
  memoryCost: 19 * 1024,  // 19 MiB in KiB
  timeCost: 2,            // 3 iterations
  parallelism: 1,         // 1 lane/thread
  hashLength: 32,         // 256-bit hash (optional, explicit)
  // saltLength: 16,      // optional; auto-generated if omitted
};

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, ARGON2_OPTS);
}

export async function verifyPassword(hash: string, plainPassword: string): Promise<boolean> {
  return await argon2.verify(hash, plainPassword);
}
