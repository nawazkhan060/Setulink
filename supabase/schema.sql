-- ============================================================================
-- SETULINK: INTEROPERABILITY MIDDLEWARE PLATFORM (SIH26129)
-- Database Schema, Constraints, Row Level Security (RLS) & Seed Data
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";

-- Clean existing tables if re-running
DROP TABLE IF EXISTS exceptions CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS access_logs CASCADE;
DROP TABLE IF EXISTS consents CASCADE;
DROP TABLE IF EXISTS application_history CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS workflow_steps CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS conflicts CASCADE;
DROP TABLE IF EXISTS connectors CASCADE;
DROP TABLE IF EXISTS mock_municipal CASCADE;
DROP TABLE IF EXISTS mock_transport CASCADE;
DROP TABLE IF EXISTS mock_health CASCADE;
DROP TABLE IF EXISTS department_links CASCADE;
DROP TABLE IF EXISTS citizens_master CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. CORE MASTER REGISTRY & USER PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('citizen', 'clerk', 'officer', 'admin')),
    department TEXT DEFAULT NULL,
    citizen_id TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE citizens_master (
    citizen_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INTEROPERABILITY DEPARTMENT LINKS & STATUS
CREATE TABLE department_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id TEXT NOT NULL REFERENCES citizens_master(citizen_id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    dept_record_id TEXT NOT NULL,
    match_status TEXT NOT NULL DEFAULT 'matched' CHECK (match_status IN ('matched', 'needs_review', 'rejected')),
    match_score NUMERIC(4,2) DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(citizen_id, department, dept_record_id)
);

-- 4. SILOED MOCK DEPARTMENT TABLES (Deliberately Disparate Schemas)
-- Health Dept (Schema: patient_id, full_name, dob, address, blood_group, last_visit)
CREATE TABLE mock_health (
    patient_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    blood_group TEXT,
    last_visit DATE DEFAULT CURRENT_DATE
);

-- Transport Dept (Schema: vehicle_owner_id, owner_name, date_of_birth, residential_address, license_number, vehicle_reg)
CREATE TABLE mock_transport (
    vehicle_owner_id TEXT PRIMARY KEY,
    owner_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    residential_address TEXT NOT NULL,
    license_number TEXT NOT NULL,
    vehicle_reg TEXT NOT NULL
);

-- Municipal Dept (Schema: citizen_ref, name, birth_date, addr_line, property_id, tax_status)
CREATE TABLE mock_municipal (
    citizen_ref TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    addr_line TEXT NOT NULL,
    property_id TEXT NOT NULL,
    tax_status TEXT DEFAULT 'PAID'
);

-- 5. CONNECTOR REGISTRY
CREATE TABLE connectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL UNIQUE,
    format TEXT NOT NULL CHECK (format IN ('json', 'xml', 'csv')),
    endpoint TEXT NOT NULL,
    field_map JSONB NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CONFLICT DETECTION & RESOLUTION
CREATE TABLE conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id TEXT NOT NULL REFERENCES citizens_master(citizen_id) ON DELETE CASCADE,
    field TEXT NOT NULL,
    values JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    resolved_by TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 7. WORKFLOW ENGINE TABLES
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    name TEXT NOT NULL,
    role_required TEXT NOT NULL CHECK (role_required IN ('citizen', 'clerk', 'officer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id TEXT NOT NULL REFERENCES citizens_master(citizen_id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    current_step INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE application_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'escalated')),
    actor_id TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CONSENT MANAGEMENT & ACCESS AUDIT LOGS
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id TEXT NOT NULL REFERENCES citizens_master(citizen_id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    purpose TEXT NOT NULL,
    granted BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(citizen_id, department)
);

CREATE TABLE access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id TEXT NOT NULL REFERENCES citizens_master(citizen_id) ON DELETE CASCADE,
    accessed_by TEXT NOT NULL,
    department TEXT NOT NULL,
    purpose TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. EVENT STREAM, REALTIME NOTIFICATIONS & SYSTEM AUDITING
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    meta JSONB,
    ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    context JSONB,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizens_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo backend & service role (or user token matching)
CREATE POLICY "Public full access on profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Public full access on citizens_master" ON citizens_master FOR ALL USING (true);
CREATE POLICY "Public full access on department_links" ON department_links FOR ALL USING (true);
CREATE POLICY "Public full access on consents" ON consents FOR ALL USING (true);
CREATE POLICY "Public full access on applications" ON applications FOR ALL USING (true);
CREATE POLICY "Public full access on application_history" ON application_history FOR ALL USING (true);
CREATE POLICY "Public full access on notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Public full access on audit_logs" ON audit_logs FOR ALL USING (true);
CREATE POLICY "Public full access on conflicts" ON conflicts FOR ALL USING (true);
CREATE POLICY "Public full access on mock_health" ON mock_health FOR ALL USING (true);
CREATE POLICY "Public full access on mock_transport" ON mock_transport FOR ALL USING (true);
CREATE POLICY "Public full access on mock_municipal" ON mock_municipal FOR ALL USING (true);
CREATE POLICY "Public full access on connectors" ON connectors FOR ALL USING (true);
CREATE TABLE IF NOT EXISTS dummy_rls_check (); DROP TABLE IF EXISTS dummy_rls_check;

-- ============================================================================
-- 11. SEED DATA
-- ============================================================================

-- Connectors
INSERT INTO connectors (id, name, department, format, endpoint, field_map, active) VALUES
('conn-health', 'Health Services Gateway', 'Health', 'json', '/api/mock/health', '{"id":"patient_id","name":"full_name","dob":"dob","address":"address"}', true),
('conn-transport', 'Transport Authority Gateway', 'Transport', 'xml', '/api/mock/transport', '{"id":"vehicle_owner_id","name":"owner_name","dob":"date_of_birth","address":"residential_address"}', true),
('conn-municipal', 'Municipal Corporation Gateway', 'Municipal', 'csv', '/api/mock/municipal', '{"id":"citizen_ref","name":"name","dob":"birth_date","address":"addr_line"}', true);

-- Seed Master Citizens
INSERT INTO citizens_master (citizen_id, name, dob, address, phone, email) VALUES
('CIT-100000000001', 'Rahul Sharma', '1990-05-15', 'Flat 402, Lotus Tower, Civil Lines, New Delhi 110054', '9811002233', 'rahul.sharma@example.com'),
('CIT-100000000002', 'Priya Patel', '1992-11-20', '12 Galaxy Apts, Vastrapur, Ahmedabad 380015', '9822003344', 'priya.patel@example.com'),
('CIT-100000000003', 'Amit Kumar Verma', '1988-03-10', 'Plot 45, Indira Nagar, Lucknow 226016', '9833004455', 'amit.verma@example.com'),
('CIT-100000000004', 'Ananya Sen', '1995-07-25', '88 Park Street, 3rd Floor, Kolkata 700016', '9844005566', 'ananya.sen@example.com'),
('CIT-100000000005', 'Vikram Singh Chauhan', '1985-09-30', '14 Rajpur Road, Dehradun 248001', '9855006677', 'vikram.singh@example.com'),
('CIT-100000000006', 'Sneha Kulkarni', '1994-01-18', '24 Karve Road, Deccan Gymkhana, Pune 411004', '9866007788', 'sneha.k@example.com'),
('CIT-100000000007', 'Mohammed Rizwan', '1989-12-05', 'B-19 Banjara Hills, Road 12, Hyderabad 500034', '9877008899', 'm.rizwan@example.com'),
('CIT-100000000008', 'Kavita Nair', '1993-04-22', 'Pattom Palace Road, Trivandrum 695004', '9888009900', 'kavita.nair@example.com'),
('CIT-100000000009', 'Deepak Joshi', '1991-08-14', '7 Mohan Nagar, Ajmer Road, Jaipur 302006', '9899010011', 'deepak.j@example.com'),
('CIT-100000000010', 'Pooja Reddy', '1996-06-08', '502 Green Acres, Whitefield, Bengaluru 560066', '9800011122', 'pooja.r@example.com'),
('CIT-100000000011', 'Sunil Deshmukh', '1987-10-12', '10 Shivaji Chowk, Nashik 422002', '9811122233', 'sunil.d@example.com'),
('CIT-100000000012', 'Meera Bhatt', '1995-02-28', 'Block C-104, SG Highway, Gandhinagar 382010', '9822233344', 'meera.b@example.com'),
('CIT-100000000013', 'Arjun Kapoor', '1986-11-04', '9 Sector 15, Chandigarh 160015', '9833344455', 'arjun.k@example.com'),
('CIT-100000000014', 'Divya Sundaram', '1993-09-17', '15 TTK Road, Alwarpet, Chennai 600018', '9844455566', 'divya.s@example.com'),
('CIT-100000000015', 'Rajesh Gupta', '1982-12-25', '33 Malviya Nagar, Bhopal 462003', '9855566677', 'rajesh.g@example.com'),
('CIT-100000000016', 'Shreya Banerjee', '1997-03-31', '12 Salt Lake Sector 1, Kolkata 700064', '9866677788', 'shreya.b@example.com'),
('CIT-100000000017', 'Manoj Tiwari', '1984-07-09', '44 Kankarbagh Main Road, Patna 800020', '9877788899', 'manoj.t@example.com'),
('CIT-100000000018', 'Preeti Mishra', '1992-05-19', '21 Sigra Cross, Varanasi 221002', '9888899900', 'preeti.m@example.com'),
('CIT-100000000019', 'Gaurav Singhania', '1989-08-03', '108 Civil Lines, Kanpur 208001', '9899900011', 'gaurav.s@example.com'),
('CIT-100000000020', 'Tara Narayanan', '1994-10-15', 'MG Road, Ernakulam, Kochi 682011', '9800099988', 'tara.n@example.com');

-- Seed Mock Health Data (JSON department)
-- With intentional variations on records 1, 2, 3, 4, 5 for conflict & dedup testing
INSERT INTO mock_health (patient_id, full_name, dob, address, blood_group, last_visit) VALUES
('HLT-9001', 'Rahul Sharma', '1990-05-15', 'Flat 402, Lotus Tower, Civil Lines, New Delhi 110054', 'B+', '2026-02-14'),
('HLT-9002', 'Priya K Patel', '1992-11-20', '12 Galaxy Apartments, Vastrapur, Ahmedabad', 'O+', '2026-01-10'),
('HLT-9003', 'Amit K. Verma', '1988-03-10', 'Plot 45, Indira Nagar, Lucknow', 'A+', '2025-11-20'),
('HLT-9004', 'Ananya Sen', '1995-07-25', '88 Park Street, Kolkata', 'AB+', '2026-03-01'),
('HLT-9005', 'Vikram S Chauhan', '1985-09-30', '14 Rajpur Rd, Dehradun 248001', 'O-', '2026-01-05'),
('HLT-9006', 'Sneha Kulkarni', '1994-01-18', '24 Karve Road, Pune 411004', 'B+', '2025-12-19'),
('HLT-9007', 'Mohammed Rizwan', '1989-12-05', 'B-19 Banjara Hills, Hyderabad', 'A-', '2026-02-28'),
('HLT-9008', 'Kavita Nair', '1993-04-22', 'Pattom Palace Road, Trivandrum', 'B-', '2026-01-18'),
('HLT-9009', 'Deepak Joshi', '1991-08-14', '7 Mohan Nagar, Jaipur', 'O+', '2026-02-05'),
('HLT-9010', 'Pooja Reddy', '1996-06-08', '502 Green Acres, Whitefield, Bengaluru', 'A+', '2026-03-12');

-- Seed Mock Transport Data (XML department)
-- With slight name or typo discrepancies on overlapping citizens
INSERT INTO mock_transport (vehicle_owner_id, owner_name, date_of_birth, residential_address, license_number, vehicle_reg) VALUES
('TRN-8001', 'Rahul Sharma.', '1990-05-15', '402 Lotus Towers, Civil Lines, Delhi', 'DL-01-2015-88219', 'DL-01-CA-1029'),
('TRN-8002', 'Priya Patel', '1992-11-20', '12 Galaxy Apts, Vastrapur, Ahmedabad 380015', 'GJ-01-2018-99201', 'GJ-01-EF-4412'),
('TRN-8003', 'Amit Kumar Verma', '1988-03-12', 'Plot 45 Indira Nagar, Lucknow 226016', 'UP-32-2012-77112', 'UP-32-AB-9011'), -- Notice DOB typo 03-12 vs 03-10
('TRN-8004', 'Ananya Sen', '1995-07-25', '88 Park St, 3rd Flr, Kolkata 700016', 'WB-02-2020-55441', 'WB-02-KL-3301'),
('TRN-8005', 'Vikram Singh', '1985-09-30', '14 Rajpur Road, Dehradun', 'UK-07-2010-33211', 'UK-07-CD-5544'), -- Name truncated
('TRN-8011', 'Sunil Deshmukh', '1987-10-12', '10 Shivaji Chowk, Nashik 422002', 'MH-15-2014-44123', 'MH-15-XY-8812'),
('TRN-8012', 'Meera Bhatt', '1995-02-28', 'Block C-104, SG Highway, Gandhinagar', 'GJ-18-2021-12345', 'GJ-18-JK-7788'),
('TRN-8013', 'Arjun Kapoor', '1986-11-04', '9 Sector 15, Chandigarh 160015', 'CH-01-2011-98765', 'CH-01-MN-1122'),
('TRN-8014', 'Divya Sundaram', '1993-09-17', '15 TTK Road, Alwarpet, Chennai', 'TN-01-2019-34567', 'TN-01-BC-6677'),
('TRN-8015', 'Rajesh Gupta', '1982-12-25', '33 Malviya Nagar, Bhopal', 'MP-04-2008-89012', 'MP-04-PQ-9900');

-- Seed Mock Municipal Data (CSV department)
-- With address & abbreviation variations for conflict demo
INSERT INTO mock_municipal (citizen_ref, name, birth_date, addr_line, property_id, tax_status) VALUES
('MUN-7001', 'R. Sharma', '1990-05-15', 'F-402 Lotus Tower, Civil Lines, Delhi', 'PROP-DEL-9812', 'PAID'),
('MUN-7002', 'Priya Patel', '1992-11-20', '12 Galaxy Apartments, Vastrapur, Ahmedabad', 'PROP-AHM-4410', 'PAID'),
('MUN-7003', 'Amit Verma', '1988-03-10', 'Plot 45, Sector B, Indira Nagar, Lucknow', 'PROP-LKO-3301', 'DUE'),
('MUN-7004', 'Ananya Sen', '1995-07-25', '88 Park Street, Kolkata 700016', 'PROP-KOL-8891', 'PAID'),
('MUN-7005', 'Vikram Singh Chauhan', '1985-09-30', 'House 14, Rajpur Road, Dehradun', 'PROP-DDN-1120', 'PAID'),
('MUN-7016', 'Shreya Banerjee', '1997-03-31', '12 Salt Lake Sector 1, Kolkata', 'PROP-KOL-5561', 'PAID'),
('MUN-7017', 'Manoj Tiwari', '1984-07-09', '44 Kankarbagh Main Rd, Patna 800020', 'PROP-PAT-4402', 'PAID'),
('MUN-7018', 'Preeti Mishra', '1992-05-19', '21 Sigra Cross, Varanasi', 'PROP-VNS-7711', 'DUE'),
('MUN-7019', 'Gaurav Singhania', '1989-08-03', '108 Civil Lines, Kanpur 208001', 'PROP-KNP-2219', 'PAID'),
('MUN-7020', 'Tara Narayanan', '1994-10-15', 'MG Road, Ernakulam, Kochi', 'PROP-KOC-9981', 'PAID');

-- Department Links (Pre-computed matching links)
INSERT INTO department_links (citizen_id, department, dept_record_id, match_status, match_score) VALUES
('CIT-100000000001', 'Health', 'HLT-9001', 'matched', 1.00),
('CIT-100000000001', 'Transport', 'TRN-8001', 'needs_review', 0.88),
('CIT-100000000001', 'Municipal', 'MUN-7001', 'needs_review', 0.82),
('CIT-100000000002', 'Health', 'HLT-9002', 'matched', 0.95),
('CIT-100000000002', 'Transport', 'TRN-8002', 'matched', 1.00),
('CIT-100000000002', 'Municipal', 'MUN-7002', 'matched', 0.96),
('CIT-100000000003', 'Health', 'HLT-9003', 'needs_review', 0.84),
('CIT-100000000003', 'Transport', 'TRN-8003', 'needs_review', 0.76),
('CIT-100000000004', 'Health', 'HLT-9004', 'matched', 0.98),
('CIT-100000000004', 'Transport', 'TRN-8004', 'matched', 0.97),
('CIT-100000000004', 'Municipal', 'MUN-7004', 'matched', 0.99),
('CIT-100000000005', 'Health', 'HLT-9005', 'matched', 0.91),
('CIT-100000000005', 'Transport', 'TRN-8005', 'needs_review', 0.79),
('CIT-100000000005', 'Municipal', 'MUN-7005', 'matched', 1.00);

-- Seed Conflicting records for Admin Conflict Resolution Queue
INSERT INTO conflicts (citizen_id, field, values, status, resolution_notes) VALUES
('CIT-100000000001', 'name', '{"Health": "Rahul Sharma", "Transport": "Rahul Sharma.", "Municipal": "R. Sharma"}', 'open', NULL),
('CIT-100000000001', 'address', '{"Health": "Flat 402, Lotus Tower, Civil Lines, New Delhi 110054", "Transport": "402 Lotus Towers, Civil Lines, Delhi", "Municipal": "F-402 Lotus Tower, Civil Lines, Delhi"}', 'open', NULL),
('CIT-100000000003', 'dob', '{"Health": "1988-03-10", "Transport": "1988-03-12", "Municipal": "1988-03-10"}', 'open', NULL),
('CIT-100000000005', 'name', '{"Health": "Vikram S Chauhan", "Transport": "Vikram Singh", "Municipal": "Vikram Singh Chauhan"}', 'open', NULL);

-- Seed Workflows
INSERT INTO workflows (id, name, department, description, active) VALUES
('a0000000-0000-0000-0000-000000000001', 'Address Update', 'Inter-Departmental', 'Unified address synchronization across Municipal, Transport, and Health databases', true),
('a0000000-0000-0000-0000-000000000002', 'Senior Citizen Subsidy', 'Social Welfare', 'Verification and grant approval for senior welfare benefits', true);

-- Workflow Steps
INSERT INTO workflow_steps (workflow_id, step_order, name, role_required) VALUES
('a0000000-0000-0000-0000-000000000001', 1, 'Citizen Application', 'citizen'),
('a0000000-0000-0000-0000-000000000001', 2, 'Clerk Document Verification', 'clerk'),
('a0000000-0000-0000-0000-000000000001', 3, 'Officer Final Approval', 'officer');

-- Seed Demo Application
INSERT INTO applications (id, citizen_id, workflow_id, current_step, status, data) VALUES
('b0000000-0000-0000-0000-000000000001', 'CIT-100000000001', 'a0000000-0000-0000-0000-000000000001', 2, 'under_review', '{"old_address":"Flat 402, Lotus Tower, Civil Lines, New Delhi 110054","new_address":"Penthouse 1201, Imperial Heights, Vasant Kunj, New Delhi 110070","proof_type":"Electricity Bill #DEL-2026-901","reason":"Relocation"}');

INSERT INTO application_history (application_id, step_name, action, actor_id, note) VALUES
('b0000000-0000-0000-0000-000000000001', 'Citizen Application', 'submitted', 'CIT-100000000001', 'Application submitted with updated residential proof document.');

-- Consents (Citizen 1 grants Health and Transport, revokes Municipal)
INSERT INTO consents (citizen_id, department, purpose, granted) VALUES
('CIT-100000000001', 'Health', 'Healthcare service integration and medical record continuity', true),
('CIT-100000000001', 'Transport', 'Vehicle registration verification and automated license renewals', true),
('CIT-100000000001', 'Municipal', 'Property taxation assessment and civic grievance routing', false),
('CIT-100000000002', 'Health', 'Medical records sharing', true),
('CIT-100000000002', 'Transport', 'Driving licence identity proof', true),
('CIT-100000000002', 'Municipal', 'Property tax linkage', true);

-- Seed Profiles (Pre-seeded role accounts for instant demo login)
INSERT INTO profiles (id, email, full_name, role, department, citizen_id) VALUES
('11111111-1111-1111-1111-111111111111', 'citizen@setulink.gov.in', 'Rahul Sharma (Citizen)', 'citizen', NULL, 'CIT-100000000001'),
('22222222-2222-2222-2222-222222222222', 'clerk@setulink.gov.in', 'Sunita Rao (Verification Clerk)', 'clerk', 'Inter-Departmental', NULL),
('33333333-3333-3333-3333-333333333333', 'officer@setulink.gov.in', 'Rajesh K. Varma (Approving Officer)', 'officer', 'Inter-Departmental', NULL),
('44444444-4444-4444-4444-444444444444', 'admin@setulink.gov.in', 'System Administrator', 'admin', 'NIC / SetuLink Central', NULL);

-- Seed Notifications
INSERT INTO notifications (user_id, message, read) VALUES
('CIT-100000000001', 'Your Address Update application #b0000000 is currently under review by Document Verification Clerk.', false),
('CIT-100000000001', 'SetuLink Gateway sync: Your Transport Authority record was cross-verified successfully.', true);

-- Seed Access Logs
INSERT INTO access_logs (citizen_id, accessed_by, department, purpose) VALUES
('CIT-100000000001', 'clerk@setulink.gov.in', 'Health', 'Application Address Verification'),
('CIT-100000000001', 'clerk@setulink.gov.in', 'Transport', 'Application Address Verification');

-- Seed Audit Logs
INSERT INTO audit_logs (actor_id, action, resource, meta, ip) VALUES
('CIT-100000000001', 'SUBMIT_APPLICATION', 'applications/b0000000-0000-0000-0000-000000000001', '{"workflow":"Address Update"}', '127.0.0.1'),
('admin@setulink.gov.in', 'CONNECTOR_SYNC', 'connectors/conn-transport', '{"status":"active"}', '127.0.0.1');

-- Seed System Exceptions (for Demo of deliberate exception capture)
INSERT INTO exceptions (source, message, context, resolved) VALUES
('conn-municipal', 'CSV parsing warning: Column header "addr_line" trailing whitespace detected', '{"line": 14}', true),
('conn-transport', 'Temporary timeout reading XML feed endpoint (retried successfully)', '{"attempt": 2}', true);

-- End of schema.sql
