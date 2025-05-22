import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, clients(*), invoice_items(*)')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Invoice API received:", JSON.stringify(body, null, 2));
    
    const { client_id, date, due_date, status, total, items } = body;
    
    if (!client_id) {
      console.error("Missing client_id in request");
      return NextResponse.json({ error: 'Missing client_id' }, { status: 400 });
    }
    
    if (!date) {
      console.error("Missing date in request");
      return NextResponse.json({ error: 'Missing date' }, { status: 400 });
    }
    
    if (!due_date) {
      console.error("Missing due_date in request");
      return NextResponse.json({ error: 'Missing due_date' }, { status: 400 });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Missing or invalid items in request");
      return NextResponse.json({ error: 'Missing or invalid items' }, { status: 400 });
    }
    
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{ client_id, date, due_date, status, total }])
      .select()
      .single();
      
    if (invoiceError) {
      console.error("Error inserting invoice:", invoiceError);
      return NextResponse.json({ error: invoiceError.message }, { status: 500 });
    }
    
    const itemsToInsert = items.map((item: any) => ({ 
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      invoice_id: invoice.id 
    }));
    
    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert);
    
    if (itemsError) {
      console.error("Error inserting invoice items:", itemsError);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
    
    return NextResponse.json(invoice);
  } catch (err) {
    console.error("Unexpected error in POST /api/invoices:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 