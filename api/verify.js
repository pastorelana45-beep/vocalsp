
export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email richiesta' });
  }

  // QUI: Interroga il tuo database reale
  // Esempio logica mock:
  // const user = await db.users.findUnique({ where: { email } });
  // const isPro = user?.isPro || false;

  // Per test: se l'email contiene "pro", la consideriamo valida
  const isPro = email.toLowerCase().includes('pro') || email.toLowerCase() === 'test@example.com';

  return res.status(200).json({ isPro, email });
}
