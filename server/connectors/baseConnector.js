/**
 * BaseConnector defines the standard lifecycle and interface
 * for all external departmental integrations in SetuLink.
 */
export class BaseConnector {
  constructor({ id, name, department, format, endpoint, fieldMap }) {
    this.id = id;
    this.name = name;
    this.department = department;
    this.format = format;
    this.endpoint = endpoint;
    this.fieldMap = fieldMap || {};
    this.active = true;
  }

  /**
   * Fetch raw records from the department endpoint or mock source
   * @param {Object} options
   */
  async fetchRecords(options = {}) {
    throw new Error(`fetchRecords() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Fetch a specific citizen record by query (e.g. name, citizen_id, or department record id)
   * @param {string} query
   * @param {Object} masterCitizen
   */
  async fetchCitizenRecord(query, masterCitizen = null) {
    throw new Error(`fetchCitizenRecord() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Translate raw departmental record format into SetuLink Common Schema
   * Common Schema: { citizen_id, name, dob, address, source, raw }
   * @param {Object} raw
   */
  toCommon(raw) {
    throw new Error(`toCommon() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Translate SetuLink Common Schema into departmental format
   * @param {Object} common
   */
  fromCommon(common) {
    throw new Error(`fromCommon() must be implemented by ${this.constructor.name}`);
  }
}
