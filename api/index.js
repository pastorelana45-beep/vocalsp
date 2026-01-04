const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // 1. Accetta solo richieste POST da Stripe
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // 2. Legge il corpo della richiesta (Buffer)
    const body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => { data += chunk; });
      req.on('end', () => { resolve(data); });
    });

    // 3. Verifica l'autenticità del segnale con la chiave whsec_
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`❌ Errore Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 4. Gestisce l'evento di pagamento completato
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('✅ PAGAMENTO RICEVUTO! Email cliente:', session.customer_details.email);
    
    // In questa sezione puoi attivare la licenza Pro nel tuo database
  }

  // 5. Risponde a Stripe che il segnale è stato ricevuto
  res.status(200).json({ received: true });
}
