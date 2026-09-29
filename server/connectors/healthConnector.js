import { BaseConnector } from './baseConnector.js';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';

export class HealthConnector extends BaseConnector {
  constructor() {
    super({
      id: 'conn-health',
      name: 'Health Services Gateway',
      department: 'Health',
      format: 'json',
      endpoint: '/api/mock/health',
      fieldMap: {
        id: 'patient_id',
        name: 'full_name',
        dob: 'dob',
        address: 'address'
      }
    });
  }

  async fetchRecords() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('mock_health').select('*');
      if (error) throw error;
      return data;
    }
    return mockDb.mock_health;
  }

  async fetchCitizenRecord(citizenId, masterCitizen = null) {
    const records = await this.fetchRecords();
    
    // Look up directly or by name / index similarity
    let match = null;
    if (masterCitizen) {
      match = records.find(
        (r) =>
          r.full_name.toLowerCase().includes(masterCitizen.name.toLowerCase().slice(0, 5)) ||
          masterCitizen.name.toLowerCase().includes(r.full_name.toLowerCase().slice(0, 5))
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
      department_record_id: raw.patient_id,
      citizen_id: fallbackCitizenId,
      name: raw.full_name,
      dob: raw.dob,
      address: raw.address,
      source: 'Health',
      format: 'JSON',
      metadata: {
        blood_group: raw.blood_group,
        last_visit: raw.last_visit,
        patient_id: raw.patient_id
      }
    };
  }

  fromCommon(common) {
    return {
      patient_id: common.department_record_id || `HLT-${Date.now().toString().slice(-4)}`,
      full_name: common.name,
      dob: common.dob,
      address: common.address,
      blood_group: common.metadata?.blood_group || 'O+',
      last_visit: new Date().toISOString().split('T')[0]
    };
  }
}
