import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const url = formData.get('url');
    const pdfFile = formData.get('pdf_file');

    if (!url && !pdfFile) {
      return NextResponse.json({ error: 'Either URL or PDF file is required' }, { status: 400 });
    }

    // Prepare the request to the backend OCR API
    const backendUrl = 'http://127.0.0.1:5000/process_invoice';
    let backendResponse;
    let backendData;

    if (url) {
      // Send as form data with url
      const backendForm = new FormData();
      backendForm.append('url', url as string);
      backendResponse = await fetch(backendUrl, {
        method: 'POST',
        body: backendForm,
      });
    } else if (pdfFile) {
      // Send as form data with pdf_file
      const backendForm = new FormData();
      backendForm.append('pdf_file', pdfFile as Blob, (pdfFile as File).name || 'invoice.pdf');
      backendResponse = await fetch(backendUrl, {
        method: 'POST',
        body: backendForm,
      });
    }

    if (!backendResponse || !backendResponse.ok) {
      return NextResponse.json({ error: 'Failed to process invoice with OCR backend' }, { status: 502 });
    }

    backendData = await backendResponse.json();
    return NextResponse.json(backendData);
  } catch (error: any) {
    console.error('Invoice processing error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process invoice' }, { status: 500 });
  }
}
