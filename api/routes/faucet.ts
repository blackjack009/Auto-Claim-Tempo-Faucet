import { Router, Request, Response } from 'express';

const router = Router();

router.post('/claim', async (req: Request, res: Response) => {
  const { address } = req.body;

  if (!address) {
    res.status(400).json({ error: 'Address is required' });
    return;
  }

  try {
    const rpcUrl = 'https://rpc.testnet.tempo.xyz';
    const payload = {
      jsonrpc: '2.0',
      method: 'tempo_fundAddress',
      params: [address],
      id: 1,
    };

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
      res.status(400).json({ error: data.error.message || 'RPC Error' });
      return;
    }

    res.json({ success: true, result: data.result });
  } catch (error) {
    console.error('Faucet claim error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
