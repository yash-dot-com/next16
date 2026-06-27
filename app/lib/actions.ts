"use server"

import { z } from "zod"
import postgres from 'postgres';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// By adding the 'use server', you mark all the exported functions within the file as Server Actions. These server functions can then be imported and used in Client and Server components. Any functions included in this file that are not used will be automatically removed from the final application bundle.

export type Invoice = {
  id: string; // Will be created on the database
  customer_id: string;
  amount: number; // Stored in cents
  status: 'pending' | 'paid';
  date: string;
};

const formSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string()
})

const CreateInvoice = formSchema.omit({
  id: true,
  date: true
})

export async function createInvoice(formData: FormData){
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  // after updating the data you want to revalidate the cached page, re render the server component that fetches data from db 
  revalidatePath("/dashboard/invoices")
  // and send back user to that all invoices page
  redirect("/dashboard/invoices")
}

const UpdateInvoiceSchema = formSchema.omit({
  id: true,
  date: true
})

export async function updateInvoice(id: string, formData: FormData){
  const { customerId, amount, status } = UpdateInvoiceSchema.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `
  } catch (error) {
    // We'll also log the error to the console for now
    console.error(error);
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  revalidatePath("/dashboard/invoices")
  redirect("/dashboard/invoices")
}

export async function deleteInvoice(id: string){
  try{
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  }catch(error){
     console.log("error while deleting the invoice...")
    return {
      message: "error while deleting the invoice..."
    }
  }
  revalidatePath('/dashboard/invoices');
}