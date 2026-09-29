import { BaseConnector } from './baseConnector.js';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';
import Papa from 'papaparse';

export class MunicipalConnector extends BaseConnector {
  constructor() {
    super({
      id: 'conn-municipal',
      name: 'Municipal Corporation Gateway',
      department: 'Municipal',
      format: 'csv',
      endpoint: '/api/mock/municipal',
      fieldMap: {
        id: 'citizen_ref',
        name: 'name',
        dob: 'birth_date',
        address: 'addr_line'
      }
    });
  }

  async fetchRecords() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('mock_municipal').select('*');
      if (error) throw error;
      return data;
    }
    return mockDb.mock_municipal;
  }

  /**
   * Simulates parsing CSV payload from municipal file feed
   */
  parseCsvPayload(csvString) {
    const parsed = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim()
    });
    return parsed.data;
  }

  /**
   * Converts records into CSV text
   */
  toCsvPayload(records) {
    return Papa.unparse(records);
  }

  async fetchCitizenRecord(citizenId, masterCitizen = null) {
    const records = await this.fetchRecords();

    let match = null;
    if (masterCitizen) {
      match = records.find(
        (r) =>
          r.name.toLowerCase().replace(/[^a-z]/g, '').includes(masterCitizen.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4)) ||
          masterCitizen.name.toLowerCase().replace(/[^a-z]/g, '').includes(r.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4))
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
      department_record_id: raw.citizen_ref,
      citizen_id: fallbackCitizenId,
      name: raw.name,
      dob: raw.birth_date,
      address: raw.addr_line,
      source: 'Municipal',
      format: 'CSV',
      metadata: {
        property_id: raw.property_id,
        tax_status: raw.tax_status,
        citizen_ref: raw.citizen_ref
      }
    };
  }

  fromCommon(common) {
    return {
      citizen_ref: common.department_record_id || `MUN-${Date.now().toString().slice(-4)}`,
      name: common.name,
      birth_date: common.dob,
      addr_line: common.address,
      property_id: common.metadata?.property_id || 'PROP-NEW-01',
      tax_status: common.metadata?.tax_status || 'PAID'
    };
  }
}
