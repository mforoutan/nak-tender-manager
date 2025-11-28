# Database Seeding Scripts

This directory contains SQL scripts to populate base/lookup tables in the NAK Tender Manager system.

## Scripts

### 1. insert-contractor-categories.sql
Populates the `CONTRACTOR_CATEGORY` table with hierarchical contractor categories.

**Schema:** `ID, CATEGORY_CODE (50), CATEGORY_NAME (200), DESCRIPTION, PARENT_CATEGORY_ID, IS_ACTIVE, DISPLAY_ORDER, CREATED_DATE`

**Structure:**
- **Level 1 (Main Categories):** 10 main categories
  - ساختمانی (BUILD) - Building/Construction
  - راهسازی (ROAD) - Road Construction
  - آب و فاضلاب (WATER) - Water & Wastewater
  - برق و انرژی (POWER) - Power & Energy
  - تاسیسات مکانیکی (MECH) - Mechanical Installations
  - صنعتی (INDUST) - Industrial
  - حمل و نقل (TRANSP) - Transportation
  - مخابرات و ارتباطات (TELECOM) - Telecommunications
  - مشاوره (CONSULT) - Consulting
  - خدماتی (SERVICE) - Services

- **Level 2 (Sub-categories):** 28 specialized sub-categories

**Total Records:** 38 categories

**API Endpoint:** `GET /api/contractor-categories`
- Query params:
  - `parentId`: Filter by parent category (use "null" for top-level categories)
  - `includeInactive`: Include inactive categories (default: false)

---

### 2. insert-contractor-types.sql
Populates the `BASE_CONTRACTOR_TYPE` table with Iranian company types.

**Schema:** `ID, TYPE_CODE (20), TYPE_NAME (100), DESCRIPTION (500), IS_ACTIVE, CREATED_DATE`

**Types Included:**
1. خصوصی (PRIVATE) - Private Company
2. دولتی (PUBLIC) - Government/Public Company
3. نیمه دولتی (SEMI-PUBLIC) - Semi-Public Company
4. تعاونی (COOPERATIVE) - Cooperative Company
5. سهامی خاص (LIMITED) - Private Limited Company
6. سهامی عام (PUBLIC-LIMITED) - Public Limited Company
7. با مسئولیت محدود (LLC) - Limited Liability Company
8. تضامنی (PARTNERSHIP) - General Partnership
9. کنسرسیوم (CONSORTIUM) - Consortium
10. شخص حقیقی (INDIVIDUAL) - Individual Contractor

**Total Records:** 10 types

**API Endpoint:** `GET /api/contractor-types`
- Query params:
  - `includeInactive`: Include inactive types (default: false)

---

### 3. insert-contractor-activities.sql
Populates the `BASE_CONTRACTOR_ACTIVITY` table with contractor activity types.

**Schema:** `ID, ACTIVITY_CODE (20), ACTIVITY_NAME (200), DESCRIPTION, IS_ACTIVE, CREATED_DATE`

**Activity Categories:**
- **Construction:** Residential, Commercial, Industrial, High-rise buildings
- **Road Construction:** Highways, Urban roads, Rural roads, Bridges, Asphalt
- **Water & Wastewater:** Water supply, Sewerage, Treatment plants, Dams, Pumping stations
- **Power & Energy:** Power plants, Transmission, Distribution, Solar, Wind, Street lighting
- **Mechanical:** HVAC, Plumbing, Elevators, Fire suppression, Gas piping
- **Industrial:** Oil & Gas, Petrochemical, Mining, Steel, Cement
- **Telecommunications:** Fiber optic, Mobile networks, Data networks, Security systems
- **Consulting:** Design, Supervision, Project management, Studies
- **Services:** Maintenance, Cleaning, Security, Transportation, Catering
- **Landscaping:** Green spaces, Parks
- **Environmental:** Waste management, Water treatment
- **Demolition:** Building demolition, Excavation
- **Other:** Specialized activities

**Total Records:** 50 activities

**API Endpoint:** `GET /api/contractor-activities`
- Query params:
  - `includeInactive`: Include inactive activities (default: false)
  - `search`: Search in activity name, code, or description

**Junction Table:** `CONTRACTOR_ACTIVITY` links contractors to their activities:
- `ID, CONTRACTOR_ID, ACTIVITY_ID, IS_PRIMARY, CREATED_DATE`
- `IS_PRIMARY` indicates the contractor's main activity
- Unique constraint on `(CONTRACTOR_ID, ACTIVITY_ID)`

---

### 4. insert-banks.sql
Populates the `BASE_BANK` table with major Iranian banks.

**Schema:** `ID, BANK_CODE (10), BANK_NAME (100), IS_ACTIVE, CREATED_DATE`

**Banks Included:**
Major banks such as:
- بانک ملی ایران (Bank Melli Iran)
- بانک سپه (Bank Sepah)
- بانک تجارت (Bank Tejarat)
- بانک صادرات (Bank Saderat)
- بانک ملت (Bank Mellat)
- بانک پارسیان (Parsian Bank)
- بانک پاسارگاد (Pasargad Bank)
- And 19 more...

**Total Records:** 26 banks

**API Endpoint:** `GET /api/banks`
- Query params:
  - `includeInactive`: Include inactive banks (default: false)

---

### 5. insert-company-statuses.sql
Populates the `COMPANY_STATUSES` table with contractor/company workflow statuses.

**Schema:** `ID, STATUS_NAME (100), STATUS_DESCRIPTION (500), CONDITIONS (1000)`

**Statuses Included:**
1. **در انتظار تایید** (Pending Approval) - New registration awaiting admin review
2. **تایید شده** (Approved) - Approved and can participate in tenders
3. **رد شده** (Rejected) - Rejected, needs correction and re-registration
4. **معلق** (Suspended) - Temporarily suspended from new tenders
5. **غیرفعال** (Inactive) - Deactivated, cannot operate in system
6. **در حال بررسی مدارک** (Under Document Review) - Documents being reviewed by experts

**Total Records:** 6 statuses

**Default Status:** New contractors are assigned status `1` (در انتظار تایید) during signup

---

## Usage

### Running the Scripts

Execute these scripts in your Oracle database in the following order:

```sql
-- 1. Banks (no dependencies)
@insert-banks.sql

-- 2. Contractor Types (no dependencies)
@insert-contractor-types.sql

-- 3. Contractor Categories (has parent-child relationships)
@insert-contractor-categories.sql

-- 4. Contractor Activities (no dependencies)
@insert-contractor-activities.sql

-- 5. Company Statuses (no dependencies)
@insert-company-statuses.sql
```

Or using SQLcl:
```bash
sql username/password@database
@scripts/insert-banks.sql
@scripts/insert-contractor-types.sql
@scripts/insert-contractor-categories.sql
@scripts/insert-contractor-activities.sql
@scripts/insert-company-statuses.sql
```

---

## API Endpoints

All endpoints return JSON arrays and support filtering.

### Fetch All Contractor Categories
```javascript
const response = await fetch('/api/contractor-categories');
const categories = await response.json();
// Returns: [{ id, code, name, description, parentId, isActive, displayOrder }, ...]
```

### Fetch Top-Level Categories Only
```javascript
const response = await fetch('/api/contractor-categories?parentId=null');
const mainCategories = await response.json();
```

### Fetch Sub-Categories for a Parent
```javascript
const response = await fetch('/api/contractor-categories?parentId=1');
const buildingSubCategories = await response.json();
```

### Fetch All Contractor Types
```javascript
const response = await fetch('/api/contractor-types');
const types = await response.json();
// Returns: [{ id, code, name, description, isActive }, ...]
```

### Fetch All Contractor Activities
```javascript
const response = await fetch('/api/contractor-activities');
const activities = await response.json();
// Returns: [{ id, code, name, description, isActive }, ...]
```

### Search Contractor Activities
```javascript
const response = await fetch('/api/contractor-activities?search=ساختمان');
const buildingActivities = await response.json();
```

### Fetch All Banks
```javascript
const response = await fetch('/api/banks');
const banks = await response.json();
// Returns: [{ id, code, name, isActive }, ...]
```

---

## Response Format

### Contractor Categories
```json
{
  "id": 1,
  "code": "BUILD",
  "name": "ساختمانی",
  "description": "پیمانکاران ساختمانی و عمرانی",
  "parentId": null,
  "isActive": true,
  "displayOrder": 1
}
```

### Contractor Types
```json
{
  "id": 1,
  "code": "PRIVATE",
  "name": "خصوصی",
  "description": "شرکت خصوصی",
  "isActive": true
}
```

### Contractor Activities
```json
{
  "id": 1,
  "code": "BUILD-RES",
  "name": "ساختمان مسکونی",
  "description": "احداث و بازسازی ساختمان‌های مسکونی",
  "isActive": true
}
```

### Banks
```json
{
  "id": 1,
  "code": "BMI",
  "name": "بانک ملی ایران",
  "isActive": true
}
```

---

## Notes

- All scripts include `COMMIT` at the end
- `IS_ACTIVE` is set to 1 (active) for all records by default
- `DISPLAY_ORDER` controls the sort order in dropdowns (categories only)
- Categories support hierarchical structure via `PARENT_CATEGORY_ID`
- Contractor activities can be linked to contractors via `CONTRACTOR_ACTIVITY` junction table
- All tables use simple sequential IDs

---

## Contractor Activities Junction Table

When a contractor registers or updates their profile, link their activities using:

```sql
-- Link activity to contractor (example)
INSERT INTO CONTRACTOR_ACTIVITY (ID, CONTRACTOR_ID, ACTIVITY_ID, IS_PRIMARY, CREATED_DATE)
VALUES (CONTRACTOR_ACTIVITY_SEQ.NEXTVAL, :contractorId, :activityId, :isPrimary, SYSDATE);
```

**Usage:**
- A contractor can have multiple activities
- Mark one activity as `IS_PRIMARY = 1` (main activity)
- Unique constraint prevents duplicate contractor-activity pairs

---

## Integration with Signup Form

These endpoints should be called to populate dropdowns in the contractor registration form:

```typescript
// In your form component
useEffect(() => {
  // Load contractor types
  fetch('/api/contractor-types')
    .then(res => res.json())
    .then(setContractorTypes);
    
  // Load main categories
  fetch('/api/contractor-categories?parentId=null')
    .then(res => res.json())
    .then(setCategories);
    
  // Load banks
  fetch('/api/banks')
    .then(res => res.json())
    .then(setBanks);
    
  // Load activities (for multi-select)
  fetch('/api/contractor-activities')
    .then(res => res.json())
    .then(setActivities);
}, []);
```

**Storing Selected Activities:**
After contractor signup, insert selected activities into `CONTRACTOR_ACTIVITY` table with the new contractor ID.

