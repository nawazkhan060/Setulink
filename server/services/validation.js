import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';

export const validateCitizenPayload = async (payload, isUpdate = false) => {
  const errors = [];

  // Required Fields
  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    errors.push('Field "name" is required and must contain at least 2 characters.');
  }

  if (!payload.dob) {
    errors.push('Field "dob" (Date of Birth) is required in YYYY-MM-DD format.');
  } else {
    const dobDate = new Date(payload.dob);
    if (isNaN(dobDate.getTime())) {
      errors.push('Field "dob" must be a valid date.');
    } else if (dobDate > new Date()) {
      errors.push('Date of Birth cannot be in the future.');
    }
  }

  if (!payload.address || typeof payload.address !== 'string' || payload.address.trim().length < 5) {
    errors.push('Field "address" is required and must contain at least 5 characters.');
  }

  // Citizen ID validation (e.g. CIT-100000000001 or 12 digits)
  if (payload.citizen_id) {
    const idPattern = /^(CIT-)?\d{12}$/;
    if (!idPattern.test(payload.citizen_id)) {
      errors.push('Citizen ID must be formatted as 12 digits (e.g. CIT-100000000001 or 100000000001).');
    }
  }

  // Exact-duplicate rejection
  if (!isUpdate && payload.citizen_id) {
    let duplicate = null;
    if (isSupabaseConfigured()) {
      const { data } = await supabase
        .from('citizens_master')
        .select('citizen_id')
        .eq('citizen_id', payload.citizen_id)
        .maybeSingle();
      duplicate = data;
    } else {
      duplicate = mockDb.citizens_master.find((c) => c.citizen_id === payload.citizen_id);
    }

    if (duplicate) {
      errors.push(`Citizen with ID "${payload.citizen_id}" already exists in Master Registry.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
