import { distance } from 'fastest-levenshtein';
import { supabase, isSupabaseConfigured, mockDb } from '../lib/supabase.js';

/**
 * Normalizes text: trims, lowercases, removes excess punctuation
 */
export const normalizeString = (str) => {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Calculates Levenshtein Similarity (0.0 to 1.0)
 */
export const calculateLevenshteinSimilarity = (s1, s2) => {
  const norm1 = normalizeString(s1);
  const norm2 = normalizeString(s2);
  if (!norm1 && !norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;
  if (norm1 === norm2) return 1.0;

  const maxLength = Math.max(norm1.length, norm2.length);
  const dist = distance(norm1, norm2);
  return Math.max(0, (maxLength - dist) / maxLength);
};

/**
 * Calculates token overlap for addresses
 */
export const calculateAddressTokenOverlap = (addr1, addr2) => {
  const norm1 = normalizeString(addr1);
  const norm2 = normalizeString(addr2);
  if (!norm1 || !norm2) return 0;
  if (norm1 === norm2) return 1.0;

  const tokens1 = new Set(norm1.split(' ').filter((t) => t.length > 2));
  const tokens2 = new Set(norm2.split(' ').filter((t) => t.length > 2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let commonCount = 0;
  tokens1.forEach((token) => {
    if (tokens2.has(token)) commonCount++;
  });

  const unionSize = new Set([...tokens1, ...tokens2]).size;
  return commonCount / unionSize;
};

/**
 * Deterministic Matching Engine
 * Compares incoming departmental record against a master citizen record
 *
 * Weighting:
 * - Name similarity: 40%
 * - DOB exact match: 40%
 * - Address token overlap: 20%
 */
export const evaluateMatch = (masterCitizen, deptRecord) => {
  if (!masterCitizen || !deptRecord) {
    return { score: 0, status: 'rejected', details: 'Missing comparison records' };
  }

  // Name similarity
  const nameSim = calculateLevenshteinSimilarity(masterCitizen.name, deptRecord.name);

  // DOB match
  let dobSim = 0;
  if (masterCitizen.dob && deptRecord.dob) {
    const dob1 = new Date(masterCitizen.dob).toISOString().split('T')[0];
    const dob2 = new Date(deptRecord.dob).toISOString().split('T')[0];
    dobSim = dob1 === dob2 ? 1.0 : 0.0;
  }

  // Address overlap
  const addrSim = calculateAddressTokenOverlap(masterCitizen.address, deptRecord.address);

  // Weighted score
  const totalScore = parseFloat((nameSim * 0.4 + dobSim * 0.4 + addrSim * 0.2).toFixed(2));

  let status = 'rejected';
  if (totalScore >= 0.9) {
    status = 'matched';
  } else if (totalScore >= 0.6) {
    status = 'needs_review';
  } else {
    status = 'rejected';
  }

  return {
    score: totalScore,
    status,
    breakdown: {
      nameSimilarity: nameSim,
      dobMatch: dobSim,
      addressOverlap: addrSim
    }
  };
};

/**
 * Records a conflict if records are partially matched and differ
 */
export const registerConflictIfMismatch = async (citizenId, department, deptRecord, masterRecord) => {
  const conflictingFields = {};

  if (normalizeString(deptRecord.name) !== normalizeString(masterRecord.name)) {
    conflictingFields.name = {
      master: masterRecord.name,
      department: deptRecord.name
    };
  }

  if (deptRecord.dob && masterRecord.dob && deptRecord.dob !== masterRecord.dob) {
    conflictingFields.dob = {
      master: masterRecord.dob,
      department: deptRecord.dob
    };
  }

  if (calculateAddressTokenOverlap(deptRecord.address, masterRecord.address) < 0.8) {
    conflictingFields.address = {
      master: masterRecord.address,
      department: deptRecord.address
    };
  }

  if (Object.keys(conflictingFields).length > 0) {
    for (const [field, valObj] of Object.entries(conflictingFields)) {
      const conflictEntry = {
        id: `conf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        citizen_id: citizenId,
        field,
        values: {
          [department]: valObj.department,
          Master: valObj.master
        },
        status: 'open',
        resolved_by: null,
        created_at: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        await supabase.from('conflicts').insert([conflictEntry]);
      } else {
        const existing = mockDb.conflicts.find(
          (c) => c.citizen_id === citizenId && c.field === field && c.status === 'open'
        );
        if (!existing) {
          mockDb.conflicts.unshift(conflictEntry);
        }
      }
    }
  }
};
