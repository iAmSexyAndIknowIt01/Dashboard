'use server';

import { date, string, z } from 'zod';
import { db, sql } from '@vercel/postgres';
import { InvoicesTable } from './definitions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { constants } from 'buffer';
// import postgres from 'postgres';


// const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

const invoice = await db.connect();

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function deleteInvoice(id: string){

    throw new Error('Failed to Delete Invoice');

    await invoice.sql`DELETE FROM invoices WHERE id = ${id}`;

    revalidatePath('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData){
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    }); 

    const amountInCents = amount * 100;

    await invoice.sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try{
        await invoice.sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date});
        `;
    }catch(error){
        console.log(error);
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}