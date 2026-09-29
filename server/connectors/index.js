import { HealthConnector } from './healthConnector.js';
import { TransportConnector } from './transportConnector.js';
import { MunicipalConnector } from './municipalConnector.js';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';

class ConnectorRegistry {
  constructor() {
    this.instances = {
      Health: new HealthConnector(),
      Transport: new TransportConnector(),
      Municipal: new MunicipalConnector()
    };
  }

  getConnector(department) {
    return this.instances[department] || null;
  }

  getAllConnectors() {
    return Object.values(this.instances);
  }

  async getActiveConnectors() {
    let connectorRows = mockDb.connectors;
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('connectors').select('*');
      if (!error && data?.length) {
        connectorRows = data;
      }
    }

    return Object.values(this.instances).filter((connector) => {
      const dbRecord = connectorRows.find(
        (c) => c.department.toLowerCase() === connector.department.toLowerCase()
      );
      return dbRecord ? dbRecord.active : true;
    });
  }

  registerConnector(department, connectorInstance) {
    this.instances[department] = connectorInstance;
  }
}

export const connectorRegistry = new ConnectorRegistry();
