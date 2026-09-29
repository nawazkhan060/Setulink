import express from 'express';
import { HealthConnector } from '../connectors/healthConnector.js';
import { TransportConnector } from '../connectors/transportConnector.js';
import { MunicipalConnector } from '../connectors/municipalConnector.js';

const router = express.Router();
const healthConn = new HealthConnector();
const transportConn = new TransportConnector();
const municipalConn = new MunicipalConnector();

// 1. Health Department API -> Returns Native JSON
router.get('/health', async (req, res, next) => {
  try {
    const records = await healthConn.fetchRecords();
    res.setHeader('Content-Type', 'application/json');
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// 2. Transport Authority API -> Returns Native XML
router.get('/transport', async (req, res, next) => {
  try {
    const records = await transportConn.fetchRecords();
    const xml = transportConn.toXmlPayload(records);
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

// 3. Municipal Corporation API -> Returns Native CSV
router.get('/municipal', async (req, res, next) => {
  try {
    const records = await municipalConn.fetchRecords();
    const csv = municipalConn.toCsvPayload(records);
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

export default router;
