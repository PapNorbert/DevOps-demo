import express from 'express';
import {
  selectRendezvenyById,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

router.get('', async (request, response) => {
  const kivalasztottRendezvenyId = request.query.rendezveny;
  const szervezok = await selectRendezvenyById(kivalasztottRendezvenyId);
  response.send(szervezok);
});

export default router;
