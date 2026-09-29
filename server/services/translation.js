/**
 * Standard SetuLink Common Citizen Record Schema:
 * {
 *   citizen_id: string,
 *   name: string,
 *   dob: string,
 *   address: string,
 *   source: string,
 *   format: string,
 *   metadata: object
 * }
 */

export const mapToCommonSchema = (rawData, fieldMap, source, format) => {
  if (!rawData) return null;
  return {
    citizen_id: rawData[fieldMap.citizen_id] || null,
    department_record_id: rawData[fieldMap.id] || null,
    name: rawData[fieldMap.name] || '',
    dob: rawData[fieldMap.dob] || '',
    address: rawData[fieldMap.address] || '',
    source,
    format,
    metadata: { ...rawData }
  };
};

export const sanitizeCommonRecord = (record) => {
  return {
    citizen_id: record.citizen_id || null,
    department_record_id: record.department_record_id || null,
    name: (record.name || '').trim(),
    dob: record.dob || '',
    address: (record.address || '').trim(),
    source: record.source || 'Unknown',
    format: record.format || 'JSON',
    metadata: record.metadata || {}
  };
};
