
// Vercel Serverless Function per il Webhook di Stripe
// Nota: Assicurati di aver impostato STRIPE_WEBHOOK_SECRET e STRIPE_SECRET_KEY nelle env di Vercel

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // In un ambiente reale useresti la libreria stripe per validare la firma:
  // const sig = req.headers['stripe-signature'];
  // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details.email;

    console.log(`PAGAMENTO COMPLETATO: Licenza attivata per ${customerEmail}`);

    // QUI: Salva l'email nel tuo Database (es. Supabase, Firebase, KV)
    // Per ora simuliamo il successo.
    // await db.users.update({ email: customerEmail, isPro: true });
    
    return res.status(200).json({ received: true, email: customerEmail });
  }

  res.status(200).json({ received: true });
}
