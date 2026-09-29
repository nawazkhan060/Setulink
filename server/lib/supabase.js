import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';

export const isSupabaseConfigured = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return (
    url &&
    url !== 'https://your-project.supabase.co' &&
    url !== 'https://placeholder.supabase.co' &&
    key &&
    key !== 'your-supabase-service-role-key-here' &&
    key !== 'placeholder-key'
  );
};

// Real Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// In-Memory Fallback Store if Supabase credentials are not yet configured
// This ensures the application works immediately out-of-the-box for demo / preview.
export const mockDb = {
  profiles: [
    { id: '11111111-1111-1111-1111-111111111111', email: 'citizen@setulink.gov.in', full_name: 'Rahul Sharma (Citizen)', role: 'citizen', department: null, citizen_id: 'CIT-100000000001' },
    { id: '22222222-2222-2222-2222-222222222222', email: 'clerk@setulink.gov.in', full_name: 'Sunita Rao (Verification Clerk)', role: 'clerk', department: 'Inter-Departmental', citizen_id: null },
    { id: '33333333-3333-3333-3333-333333333333', email: 'officer@setulink.gov.in', full_name: 'Rajesh K. Varma (Approving Officer)', role: 'officer', department: 'Inter-Departmental', citizen_id: null },
    { id: '44444444-4444-4444-4444-444444444444', email: 'admin@setulink.gov.in', full_name: 'System Administrator', role: 'admin', department: 'NIC / SetuLink Central', citizen_id: null },
  ],
  citizens_master: [
    { citizen_id: 'CIT-100000000001', name: 'Rahul Sharma', dob: '1990-05-15', address: 'Flat 402, Lotus Tower, Civil Lines, New Delhi 110054', phone: '9811002233', email: 'rahul.sharma@example.com' },
    { citizen_id: 'CIT-100000000002', name: 'Priya Patel', dob: '1992-11-20', address: '12 Galaxy Apts, Vastrapur, Ahmedabad 380015', phone: '9822003344', email: 'priya.patel@example.com' },
    { citizen_id: 'CIT-100000000003', name: 'Amit Kumar Verma', dob: '1988-03-10', address: 'Plot 45, Indira Nagar, Lucknow 226016', phone: '9833004455', email: 'amit.verma@example.com' },
    { citizen_id: 'CIT-100000000004', name: 'Ananya Sen', dob: '1995-07-25', address: '88 Park Street, 3rd Floor, Kolkata 700016', phone: '9844005566', email: 'ananya.sen@example.com' },
    { citizen_id: 'CIT-100000000005', name: 'Vikram Singh Chauhan', dob: '1985-09-30', address: '14 Rajpur Road, Dehradun 248001', phone: '9855006677', email: 'vikram.singh@example.com' },
    { citizen_id: 'CIT-100000000006', name: 'Sneha Kulkarni', dob: '1994-01-18', address: '24 Karve Road, Deccan Gymkhana, Pune 411004', phone: '9866007788', email: 'sneha.k@example.com' },
    { citizen_id: 'CIT-100000000007', name: 'Mohammed Rizwan', dob: '1989-12-05', address: 'B-19 Banjara Hills, Hyderabad 500034', phone: '9877008899', email: 'm.rizwan@example.com' },
    { citizen_id: 'CIT-100000000008', name: 'Kavita Nair', dob: '1993-04-22', address: 'Pattom Palace Road, Trivandrum 695004', phone: '9888009900', email: 'kavita.nair@example.com' },
    { citizen_id: 'CIT-100000000009', name: 'Deepak Joshi', dob: '1991-08-14', address: '7 Mohan Nagar, Ajmer Road, Jaipur 302006', phone: '9899010011', email: 'deepak.j@example.com' },
    { citizen_id: 'CIT-100000000010', name: 'Pooja Reddy', dob: '1996-06-08', address: '502 Green Acres, Whitefield, Bengaluru 560066', phone: '9800011122', email: 'pooja.r@example.com' },
    { citizen_id: 'CIT-100000000011', name: 'Sunil Deshmukh', dob: '1987-10-12', address: '10 Shivaji Chowk, Nashik 422002', phone: '9811122233', email: 'sunil.d@example.com' },
    { citizen_id: 'CIT-100000000012', name: 'Meera Bhatt', dob: '1995-02-28', address: 'Block C-104, SG Highway, Gandhinagar 382010', phone: '9822233344', email: 'meera.b@example.com' },
    { citizen_id: 'CIT-100000000013', name: 'Arjun Kapoor', dob: '1986-11-04', address: '9 Sector 15, Chandigarh 160015', phone: '9833344455', email: 'arjun.k@example.com' },
    { citizen_id: 'CIT-100000000014', name: 'Divya Sundaram', dob: '1993-09-17', address: '15 TTK Road, Alwarpet, Chennai 600018', phone: '9844455566', email: 'divya.s@example.com' },
    { citizen_id: 'CIT-100000000015', name: 'Rajesh Gupta', dob: '1982-12-25', address: '33 Malviya Nagar, Bhopal 462003', phone: '9855566677', email: 'rajesh.g@example.com' },
    { citizen_id: 'CIT-100000000016', name: 'Shreya Banerjee', dob: '1997-03-31', address: '12 Salt Lake Sector 1, Kolkata 700064', phone: '9866677788', email: 'shreya.b@example.com' },
    { citizen_id: 'CIT-100000000017', name: 'Manoj Tiwari', dob: '1984-07-09', address: '44 Kankarbagh Main Road, Patna 800020', phone: '9877788899', email: 'manoj.t@example.com' },
    { citizen_id: 'CIT-100000000018', name: 'Preeti Mishra', dob: '1992-05-19', address: '21 Sigra Cross, Varanasi 221002', phone: '9888899900', email: 'preeti.m@example.com' },
    { citizen_id: 'CIT-100000000019', name: 'Gaurav Singhania', dob: '1989-08-03', address: '108 Civil Lines, Kanpur 208001', phone: '9899900011', email: 'gaurav.s@example.com' },
    { citizen_id: 'CIT-100000000020', name: 'Tara Narayanan', dob: '1994-10-15', address: 'MG Road, Ernakulam, Kochi 682011', phone: '9800099988', email: 'tara.n@example.com' }
  ],
  mock_health: [
    { patient_id: 'HLT-9001', full_name: 'Rahul Sharma', dob: '1990-05-15', address: 'Flat 402, Lotus Tower, Civil Lines, New Delhi 110054', blood_group: 'B+', last_visit: '2026-02-14' },
    { patient_id: 'HLT-9002', full_name: 'Priya K Patel', dob: '1992-11-20', address: '12 Galaxy Apartments, Vastrapur, Ahmedabad', blood_group: 'O+', last_visit: '2026-01-10' },
    { patient_id: 'HLT-9003', full_name: 'Amit K. Verma', dob: '1988-03-10', address: 'Plot 45, Indira Nagar, Lucknow', blood_group: 'A+', last_visit: '2025-11-20' },
    { patient_id: 'HLT-9004', full_name: 'Ananya Sen', dob: '1995-07-25', address: '88 Park Street, Kolkata', blood_group: 'AB+', last_visit: '2026-03-01' },
    { patient_id: 'HLT-9005', full_name: 'Vikram S Chauhan', dob: '1985-09-30', address: '14 Rajpur Rd, Dehradun 248001', blood_group: 'O-', last_visit: '2026-01-05' },
    { patient_id: 'HLT-9006', full_name: 'Sneha Kulkarni', dob: '1994-01-18', address: '24 Karve Road, Pune 411004', blood_group: 'B+', last_visit: '2025-12-19' },
    { patient_id: 'HLT-9007', full_name: 'Mohammed Rizwan', dob: '1989-12-05', address: 'B-19 Banjara Hills, Hyderabad', blood_group: 'A-', last_visit: '2026-02-28' },
    { patient_id: 'HLT-9008', full_name: 'Kavita Nair', dob: '1993-04-22', address: 'Pattom Palace Road, Trivandrum', blood_group: 'B-', last_visit: '2026-01-18' },
    { patient_id: 'HLT-9009', full_name: 'Deepak Joshi', dob: '1991-08-14', address: '7 Mohan Nagar, Jaipur', blood_group: 'O+', last_visit: '2026-02-05' },
    { patient_id: 'HLT-9010', full_name: 'Pooja Reddy', dob: '1996-06-08', address: '502 Green Acres, Whitefield, Bengaluru', blood_group: 'A+', last_visit: '2026-03-12' },
  ],
  mock_transport: [
    { vehicle_owner_id: 'TRN-8001', owner_name: 'Rahul Sharma.', date_of_birth: '1990-05-15', residential_address: '402 Lotus Towers, Civil Lines, Delhi', license_number: 'DL-01-2015-88219', vehicle_reg: 'DL-01-CA-1029' },
    { vehicle_owner_id: 'TRN-8002', owner_name: 'Priya Patel', date_of_birth: '1992-11-20', residential_address: '12 Galaxy Apts, Vastrapur, Ahmedabad 380015', license_number: 'GJ-01-2018-99201', vehicle_reg: 'GJ-01-EF-4412' },
    { vehicle_owner_id: 'TRN-8003', owner_name: 'Amit Kumar Verma', date_of_birth: '1988-03-12', residential_address: 'Plot 45 Indira Nagar, Lucknow 226016', license_number: 'UP-32-2012-77112', vehicle_reg: 'UP-32-AB-9011' },
    { vehicle_owner_id: 'TRN-8004', owner_name: 'Ananya Sen', date_of_birth: '1995-07-25', residential_address: '88 Park St, 3rd Flr, Kolkata 700016', license_number: 'WB-02-2020-55441', vehicle_reg: 'WB-02-KL-3301' },
    { vehicle_owner_id: 'TRN-8005', owner_name: 'Vikram Singh', date_of_birth: '1985-09-30', residential_address: '14 Rajpur Road, Dehradun', license_number: 'UK-07-2010-33211', vehicle_reg: 'UK-07-CD-5544' },
    { vehicle_owner_id: 'TRN-8011', owner_name: 'Sunil Deshmukh', date_of_birth: '1987-10-12', residential_address: '10 Shivaji Chowk, Nashik 422002', license_number: 'MH-15-2014-44123', vehicle_reg: 'MH-15-XY-8812' },
    { vehicle_owner_id: 'TRN-8012', owner_name: 'Meera Bhatt', date_of_birth: '1995-02-28', residential_address: 'Block C-104, SG Highway, Gandhinagar', license_number: 'GJ-18-2021-12345', vehicle_reg: 'GJ-18-JK-7788' },
    { vehicle_owner_id: 'TRN-8013', owner_name: 'Arjun Kapoor', date_of_birth: '1986-11-04', residential_address: '9 Sector 15, Chandigarh 160015', license_number: 'CH-01-2011-98765', vehicle_reg: 'CH-01-MN-1122' },
    { vehicle_owner_id: 'TRN-8014', owner_name: 'Divya Sundaram', date_of_birth: '1993-09-17', residential_address: '15 TTK Road, Alwarpet, Chennai', license_number: 'TN-01-2019-34567', vehicle_reg: 'TN-01-BC-6677' },
    { vehicle_owner_id: 'TRN-8015', owner_name: 'Rajesh Gupta', date_of_birth: '1982-12-25', residential_address: '33 Malviya Nagar, Bhopal', license_number: 'MP-04-2008-89012', vehicle_reg: 'MP-04-PQ-9900' }
  ],
  mock_municipal: [
    { citizen_ref: 'MUN-7001', name: 'R. Sharma', birth_date: '1990-05-15', addr_line: 'F-402 Lotus Tower, Civil Lines, Delhi', property_id: 'PROP-DEL-9812', tax_status: 'PAID' },
    { citizen_ref: 'MUN-7002', name: 'Priya Patel', birth_date: '1992-11-20', addr_line: '12 Galaxy Apartments, Vastrapur, Ahmedabad', property_id: 'PROP-AHM-4410', tax_status: 'PAID' },
    { citizen_ref: 'MUN-7003', name: 'Amit Verma', birth_date: '1988-03-10', addr_line: 'Plot 45, Sector B, Indira Nagar, Lucknow', property_id: 'PROP-LKO-3301', tax_status: 'DUE' },
    { citizen_ref: 'MUN-7004', name: 'Ananya Sen', birth_date: '1995-07-25', addr_line: '88 Park Street, Kolkata 700016', property_id: 'PROP-KOL-8891', tax_status: 'PAID' },
    { citizen_ref: 'MUN-7005', name: 'Vikram Singh Chauhan', birth_date: '1985-09-30', addr_line: 'House 14, Rajpur Road, Dehradun', property_id: 'PROP-DDN-1120', tax_status: 'PAID' },
    { citizen_ref: 'MUN-7016', name: 'Shreya Banerjee', birth_date: '1997-03-31', addr_line: '12 Salt Lake Sector 1, Kolkata', property_id: 'PROP-KOL-5561', tax_status: 'PAID' },
    { citizen_ref: 'MUN-7017', name: 'Manoj Tiwari', birth_date: '1984-07-09', addr_line: '44 Kankarbagh Main Rd, Patna 800020', property_id: 'PROP-PAT-4402', tax_status: 'PAID' },
    { citizen_ref: 'MUN-7018', name: 'Preeti Mishra', birth_date: '1992-05-19', addr_line: '21 Sigra Cross, Varanasi', property_id: 'PROP-VNS-7711', tax_status: 'DUE' },
    { citizen_ref: 'MUN-7019', name: 'Gaurav Singhania', birth_date: '1989-08-03', addr_line: '108 Civil Lines, Kanpur 208001', property_id: 'PROP-KNP-2219', tax_status: 'PAID' },
    { citizen_ref: 'MUN-7020', name: 'Tara Narayanan', birth_date: '1994-10-15', addr_line: 'MG Road, Ernakulam, Kochi', property_id: 'PROP-KOC-9981', tax_status: 'PAID' }
  ],
  connectors: [
    { id: 'conn-health', name: 'Health Services Gateway', department: 'Health', format: 'json', endpoint: '/api/mock/health', field_map: { id: 'patient_id', name: 'full_name', dob: 'dob', address: 'address' }, active: true },
    { id: 'conn-transport', name: 'Transport Authority Gateway', department: 'Transport', format: 'xml', endpoint: '/api/mock/transport', field_map: { id: 'vehicle_owner_id', name: 'owner_name', dob: 'date_of_birth', address: 'residential_address' }, active: true },
    { id: 'conn-municipal', name: 'Municipal Corporation Gateway', department: 'Municipal', format: 'csv', endpoint: '/api/mock/municipal', field_map: { id: 'citizen_ref', name: 'name', dob: 'birth_date', address: 'addr_line' }, active: true }
  ],
  conflicts: [
    {
      id: 'conf-1',
      citizen_id: 'CIT-100000000001',
      field: 'name',
      values: { Health: 'Rahul Sharma', Transport: 'Rahul Sharma.', Municipal: 'R. Sharma' },
      status: 'open',
      resolved_by: null,
      created_at: new Date().toISOString()
    },
    {
      id: 'conf-2',
      citizen_id: 'CIT-100000000001',
      field: 'address',
      values: { Health: 'Flat 402, Lotus Tower, Civil Lines, New Delhi 110054', Transport: '402 Lotus Towers, Civil Lines, Delhi', Municipal: 'F-402 Lotus Tower, Civil Lines, Delhi' },
      status: 'open',
      resolved_by: null,
      created_at: new Date().toISOString()
    },
    {
      id: 'conf-3',
      citizen_id: 'CIT-100000000003',
      field: 'dob',
      values: { Health: '1988-03-10', Transport: '1988-03-12', Municipal: '1988-03-10' },
      status: 'open',
      resolved_by: null,
      created_at: new Date().toISOString()
    },
    {
      id: 'conf-4',
      citizen_id: 'CIT-100000000005',
      field: 'name',
      values: { Health: 'Vikram S Chauhan', Transport: 'Vikram Singh', Municipal: 'Vikram Singh Chauhan' },
      status: 'open',
      resolved_by: null,
      created_at: new Date().toISOString()
    }
  ],
  workflows: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Address Update',
      department: 'Inter-Departmental',
      description: 'Unified address synchronization across Municipal, Transport, and Health databases',
      active: true,
      steps: [
        { id: 's-1', step_order: 1, name: 'Citizen Application', role_required: 'citizen' },
        { id: 's-2', step_order: 2, name: 'Clerk Document Verification', role_required: 'clerk' },
        { id: 's-3', step_order: 3, name: 'Officer Final Approval', role_required: 'officer' }
      ]
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      name: 'Senior Citizen Subsidy',
      department: 'Social Welfare',
      description: 'Verification and grant approval for senior welfare benefits',
      active: true,
      steps: [
        { id: 's-21', step_order: 1, name: 'Application Intake', role_required: 'citizen' },
        { id: 's-22', step_order: 2, name: 'Departmental Verification', role_required: 'clerk' },
        { id: 's-23', step_order: 3, name: 'Disbursement Sanction', role_required: 'officer' }
      ]
    }
  ],
  applications: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      citizen_id: 'CIT-100000000001',
      workflow_id: 'a0000000-0000-0000-0000-000000000001',
      current_step: 2,
      status: 'under_review',
      data: {
        old_address: 'Flat 402, Lotus Tower, Civil Lines, New Delhi 110054',
        new_address: 'Penthouse 1201, Imperial Heights, Vasant Kunj, New Delhi 110070',
        proof_type: 'Electricity Bill #DEL-2026-901',
        reason: 'Relocation'
      },
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  application_history: [
    {
      id: 'h-1',
      application_id: 'b0000000-0000-0000-0000-000000000001',
      step_name: 'Citizen Application',
      action: 'submitted',
      actor_id: 'CIT-100000000001',
      note: 'Application submitted with updated residential proof document.',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ],
  consents: [
    { id: 'c-1', citizen_id: 'CIT-100000000001', department: 'Health', purpose: 'Healthcare service integration and medical record continuity', granted: true },
    { id: 'c-2', citizen_id: 'CIT-100000000001', department: 'Transport', purpose: 'Vehicle registration verification and automated license renewals', granted: true },
    { id: 'c-3', citizen_id: 'CIT-100000000001', department: 'Municipal', purpose: 'Property taxation assessment and civic grievance routing', granted: false },
    { id: 'c-4', citizen_id: 'CIT-100000000002', department: 'Health', purpose: 'Medical records sharing', granted: true },
    { id: 'c-5', citizen_id: 'CIT-100000000002', department: 'Transport', purpose: 'Driving licence identity proof', granted: true },
    { id: 'c-6', citizen_id: 'CIT-100000000002', department: 'Municipal', purpose: 'Property tax linkage', granted: true }
  ],
  access_logs: [
    { id: 'al-1', citizen_id: 'CIT-100000000001', accessed_by: 'clerk@setulink.gov.in', department: 'Health', purpose: 'Application Address Verification', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'al-2', citizen_id: 'CIT-100000000001', accessed_by: 'clerk@setulink.gov.in', department: 'Transport', purpose: 'Application Address Verification', created_at: new Date(Date.now() - 7200000).toISOString() }
  ],
  events: [
    { id: 'e-1', type: 'APPLICATION_SUBMITTED', payload: { applicationId: 'b0000000-0000-0000-0000-000000000001', citizenId: 'CIT-100000000001' }, processed: true, created_at: new Date(Date.now() - 18000000).toISOString() }
  ],
  notifications: [
    { id: 'n-1', user_id: 'CIT-100000000001', message: 'Your Address Update application #b0000000 is currently under review by Document Verification Clerk.', read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'n-2', user_id: 'CIT-100000000001', message: 'SetuLink Gateway sync: Your Transport Authority record was cross-verified successfully.', read: true, created_at: new Date(Date.now() - 14400000).toISOString() }
  ],
  audit_logs: [
    { id: 'aud-1', actor_id: 'CIT-100000000001', action: 'SUBMIT_APPLICATION', resource: 'applications/b0000000-0000-0000-0000-000000000001', meta: { workflow: 'Address Update' }, ip: '127.0.0.1', created_at: new Date(Date.now() - 18000000).toISOString() },
    { id: 'aud-2', actor_id: 'admin@setulink.gov.in', action: 'CONNECTOR_SYNC', resource: 'connectors/conn-transport', meta: { status: 'active' }, ip: '127.0.0.1', created_at: new Date(Date.now() - 3600000).toISOString() }
  ],
  exceptions: [
    { id: 'ex-1', source: 'conn-municipal', message: 'CSV parsing warning: Column header "addr_line" trailing whitespace detected', context: { line: 14 }, resolved: true, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'ex-2', source: 'conn-transport', message: 'Temporary timeout reading XML feed endpoint (retried successfully)', context: { attempt: 2 }, resolved: true, created_at: new Date(Date.now() - 43200000).toISOString() }
  ]
};
