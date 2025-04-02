import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { emit } from "process";
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { sql } from "@vercel/postgres";
import { parse } from "path";
import { users } from "./app/lib/placeholder-data";
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, {ssl:'require'});

async function getUser(email: string): Promise<User | undefined> {
    try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      if (user.rows[0].isoauth === true) {
        throw new Error('User tried to login using an OAuth account without defining a password first');
      }
  
      return user.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch user.');
    }
  }

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials){

                const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6)}).safeParse(credentials);

                if(parsedCredentials.success){
                    const { email, password } = parsedCredentials.data;

                    const user = await getUser(email);

                    if(!user) return null;

                    //ene sda gajigtai code baina→ const passwordsMatch = await bcrypt.compare(password, user.password);
                    let passwordsMatch = false;
                    if(password === user.password){
                        passwordsMatch = true;
                    }

                    if(passwordsMatch) return user;
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});

function postgres(arg0: string, arg1: { ssl: string; }) {
    throw new Error("Function not implemented.");
}
