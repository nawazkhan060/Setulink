import { BaseConnector } from './baseConnector.js';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';
import xml2js from 'xml2js';

export class TransportConnector extends BaseConnector {
  constructor() {
    super({
      id: 'conn-transport',
      name: 'Transport Authority Gateway',
      department: 'Transport',
      format: 'xml',
      endpoint: '/api/mock/transport',
      fieldMap: {
        id: 'vehicle_owner_id',
        name: 'owner_name',
        dob: 'date_of_birth',
        address: 'residential_address'
      }
    });
  }

  async fetchRecords() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('mock_transport').select('*');
      if (error) throw error;
      return data;
    }
    return mockDb.mock_transport;
  }

  /**
   * Simulates parsing XML payload from external transport service
   */
  async parseXmlPayload(xmlString) {
    const parser = new xml2js.Parser({ explicitArray: false, trim: true });
    const result = await parser.parseStringPromise(xmlString);
    const records = result.records?.record || [];
    return Array.isArray(records) ? records : [records];
  }

  /**
   * Generates XML payload from records
   */
  toXmlPayload(records) {
    const builder = new xml2js.Builder({ rootName: 'records', headless: true });
    return builder.buildObject({ record: records });
  }

  async fetchCitizenRecord(citizenId, masterCitizen = null) {
    const records = await this.fetchRecords();

    let match = null;
    if (masterCitizen) {
      match = records.find(
        (r) =>
          r.owner_name.toLowerCase().replace(/[^a-z]/g, '').includes(masterCitizen.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 5)) ||
          masterCitizen.name.toLowerCase().replace(/[^a-z]/g, '').includes(r.owner_name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 5))
      );
    }
    if (!match && citizenId) {
      const idx = parseInt(citizenId.replace(/\D/g, '').slice(-2), 10) || 1;
      match = records[(idx - 1) % records.length];
    }

    if (!match) return null;
    return this.toCommon(match, citizenId);
  }

  toCommon(raw, fallbackCitizenId = null) {
    if (!raw) return null;
    return {
      department_record_id: raw.vehicle_owner_id,
      citizen_id: fallbackCitizenId,
      name: raw.owner_name,
      dob: raw.date_of_birth,
      address: raw.residential_address,
      source: 'Transport',
      format: 'XML',
      metadata: {
        license_number: raw.license_number,
        vehicle_reg: raw.vehicle_reg,
        vehicle_owner_id: raw.vehicle_owner_id
      }
    };
  }

  fromCommon(common) {
    return {
      vehicle_owner_id: common.department_record_id || `TRN-${Date.now().toString().slice(-4)}`,
      owner_name: common.name,
      date_of_birth: common.dob,
      residential_address: common.address,
      license_number: common.metadata?.license_number || 'DL-XX-0000',
      vehicle_reg: common.metadata?.vehicle_reg || 'IN-00-XX-0000'
    };
  }
}
