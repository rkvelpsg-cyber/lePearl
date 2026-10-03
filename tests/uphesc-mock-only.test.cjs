const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { createRequire } = require("node:module");
const ts = require("typescript");
const { PGlite } = require("@electric-sql/pglite");

const root = path.resolve(__dirname, "..");
const migration = fs.readFileSync(
  path.join(root, "supabase", "migrations", "20261003_add_uphesc_mock_only_batch.sql"),
  "utf8",
);

function loadTs(file, mocks = {}, env = {}) {
  const filename = path.resolve(root, file);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  const nativeRequire = createRequire(filename);
  const module = { exports: {} };
  const requireModule = (specifier) => {
    if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
    if (specifier.startsWith("@/lib/")) {
      return loadTs(`src/${specifier.slice(2)}.ts`, mocks, env);
    }
    if (specifier.startsWith(".")) {
      return loadTs(path.resolve(path.dirname(filename), `${specifier}.ts`), mocks, env);
    }
    return nativeRequire(specifier);
  };
  new Function("require", "module", "exports", "process", outputText)(
    requireModule, module, module.exports, { env },
  );
  return module.exports;
}

const mockOnly = loadTs("src/lib/mockOnlyBatch.ts");
const registration = loadTs("src/lib/studentRegistration.ts");
const mapping = loadTs("src/lib/paidEnrollmentBatchMapping.ts");
const course = mockOnly.UPHESC_MOCK_ONLY_COURSE;

test("mock-only price and canonical mapping are separate from full UPHESC", () => {
  assert.equal(mockOnly.UPHESC_MOCK_ONLY_FEE, 1);
  assert.equal(registration.isValidStudentRegistrationCourse(course), true);
  assert.deepEqual(registration.coursePaymentPlans[course], { fullAmount: 1 });
  assert.equal(registration.paidRegistrationCourseFees[course], 1);
  assert.equal(registration.coursePaymentPlans.UPHESC.fullAmount, 14995);
  assert.deepEqual(registration.coursePaymentPlans.UPHESC.instalments.map((item) => item.amount), [5495, 5495, 5495]);
  assert.deepEqual(mapping.getCanonicalPaidEnrollmentBatch(course), {
    courseName: course, batchName: course, facultyName: "Dr Prem Shankar Pandey",
  });
  assert.equal(mapping.getCanonicalPaidEnrollmentBatch("UPHESC").batchName, "UPHESC-Pandey-A");
  assert.equal(mapping.isCanonicalPaidEnrollmentBatch({ courseName: course, batchName: "UPHESC-Pandey-A" }), false);
  assert.equal(mapping.isCanonicalPaidEnrollmentBatch({ courseName: "UPHESC", batchName: course }), false);
  assert.equal(mapping.allowedCanonicalBatchNames.includes(course), true);
  assert.equal(mockOnly.isMockOnlyCourse("UPHESC"), false);
  assert.equal(mockOnly.isMockOnlyCourse(null), false);
  assert.equal(mockOnly.isMockOnlyBatch({ batchName: course }), true);
});

test("student and faculty capabilities restrict only mock-only scopes", () => {
  const studentSections = ["overview", "attendance", "tests", "classes", "lectures", "studyMaterials", "fees", "tasks"];
  const facultySections = ["dashboard", "attendance", "mcq", "evaluations", "classes", "lectures", "studyMaterial", "tasks", "students"];
  assert.deepEqual(studentSections.filter((section) => mockOnly.canAccessStudentSection(section, true)), ["overview", "tests", "fees"]);
  assert.deepEqual(facultySections.filter((section) => mockOnly.canAccessFacultySection(section, true)), ["dashboard", "mcq", "evaluations"]);
  assert.equal(studentSections.every((section) => mockOnly.canAccessStudentSection(section, false)), true);
  assert.equal(facultySections.every((section) => mockOnly.canAccessFacultySection(section, false)), true);
});

test("fixed fee rejects altered amounts, instalments, and add-ons", () => {
  const purchase = { paymentTenure: "full", paymentAmount: 1, finalPayable: 1 };
  assert.equal(mockOnly.isValidMockOnlyPurchase(purchase), true);
  for (const alteration of [
    { paymentAmount: 0 }, { paymentAmount: 0.99 }, { finalPayable: 2 },
    { paymentTenure: "instalment" }, { includeBooksAddon: true },
    { discountAmount: 1 }, { booksFee: 1 },
  ]) {
    assert.equal(mockOnly.isValidMockOnlyPurchase({ ...purchase, ...alteration }), false);
  }
});

function fakeService(resolveQuery) {
  const calls = [];
  return {
    calls,
    auth: { admin: {
      createUser: async (payload) => {
        calls.push({ table: "auth", operation: "createUser", payload });
        return { data: { user: { id: "student-new" } }, error: null };
      },
      updateUserById: async () => ({ data: {}, error: null }),
      deleteUser: async () => ({ error: null }),
    } },
    from(table) {
      const query = { table, operation: "select", filters: [] };
      const chain = new Proxy({}, {
        get(_target, method) {
          if (method === "then") {
            return (resolve, reject) => {
              calls.push(query);
              return Promise.resolve(resolveQuery(query)).then(resolve, reject);
            };
          }
          return (...args) => {
            if (["insert", "upsert", "update"].includes(method)) {
              query.operation = method;
              query.payload = args[0];
            } else if (["eq", "ilike", "neq"].includes(method)) {
              query.filters.push([method, ...args]);
            }
            return chain;
          };
        },
      });
      return chain;
    },
  };
}

function makePaymentHarness(overrides = {}) {
  const emails = [];
  const orders = [];
  const captures = [];
  const env = {
    RAZORPAY_KEY_ID: "rzp_test_local",
    RAZORPAY_KEY_SECRET: "local-test-secret",
    NEXT_PUBLIC_SUPABASE_URL: "http://supabase.test",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "local-anon",
    GMAIL_USER: "admin@example.test",
    GMAIL_APP_PASSWORD: "test-password",
    REGISTRATION_ADMIN_EMAIL: "admin@example.test",
  };
  const body = {
    mode: "paid", fullName: "Mock Student", qualification: "Paid Enrolment",
    course, phone: "9876543210", email: "student@example.test",
    username: "mockstudent", password: "LocalTest@123", registrationNo: "LP-TEST-0001",
    paymentTenure: "full", paymentMode: "razorpay", paymentAmount: 1, finalPayable: 1,
    baseCourseFee: 1, discountAmount: 0, booksFee: 0,
    acceptedTerms: true, acceptedPrivacy: true, acceptedRefund: true,
    razorpayOrderId: "order_local", razorpayPaymentId: "pay_local",
    razorpaySignature: crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET).update("order_local|pay_local").digest("hex"),
  };
  const service = fakeService((query) => {
    const result = { data: null, error: null };
    if (query.table === "profiles" && query.filters.some(([, field, value]) => field === "role" && value === "faculty")) {
      result.data = [{ user_id: "faculty-pandey", full_name: "Dr. Prem Shankar Pandey" }];
    }
    if (query.table === "courses") {
      result.data = [{ id: 1, title: "UPHESC", code: "UPHESC" }];
      if (!overrides.missingMockCourse) result.data.push({ id: 2, title: course, code: "UPHESC-MOCK-ONLY" });
      if (query.operation === "insert") result.data = { id: 2, title: query.payload.title };
    }
    if (query.table === "batches") {
      result.data = { id: 20, faculty_user_id: "faculty-pandey" };
    }
    if (query.table === "student_registrations" && overrides.reusedPayment &&
        query.filters.some(([, field]) => field === "razorpay_payment_id")) {
      result.data = { id: "previous-registration" };
    }
    if (query.table === "profiles" && query.filters.some(([, field]) => field === "user_id")) {
      result.data = { full_name: "Dr. Prem Shankar Pandey" };
    }
    if (overrides.batchNotReady && query.table === "batches") result.data = null;
    return result;
  });
  class FakeRazorpay {
    orders = {
      create: async (payload) => {
        orders.push(payload);
        return { id: "order_local", amount: payload.amount, currency: payload.currency };
      },
      fetch: async () => ({
        amount: 100, currency: "INR",
        notes: { course, registration_no: body.registrationNo, student_email: body.email },
        ...overrides.order,
      }),
    };
    payments = {
      fetch: async () => ({
        amount: 100, currency: "INR", status: "captured", order_id: "order_local",
        ...overrides.payment,
        ...(captures.length && overrides.captureRace ? { status: "captured" } : {}),
      }),
      capture: async (...args) => {
        captures.push(args);
        if (overrides.captureRace) throw new Error("Payment already captured");
        return {
          amount: 100, currency: "INR", status: "captured", order_id: "order_local",
          ...overrides.capture,
        };
      },
    };
  }
  const mocks = {
    razorpay: FakeRazorpay,
    "@/lib/supabase/server": { createServerClient: () => service },
    "@supabase/supabase-js": { createClient: () => service },
    nodemailer: { createTransport: () => ({
      sendMail: async (email) => { emails.push(email); },
      close() {},
    }) },
    "@/lib/whatsapp": {
      sendStudentPaymentWhatsAppNotification: async () => ({ sent: true }),
      sendWhatsAppTextNotification: async () => ({ sent: true }),
    },
  };
  const request = (payload) => ({ json: async () => payload });
  return { body, service, emails, orders, captures, env, mocks, request };
}

test("mock-only order uses 100 paise and checks batch readiness; existing orders unchanged", async () => {
  const h = makePaymentHarness();
  const route = loadTs("src/app/api/student-registration/create-payment-order/route.ts", h.mocks, h.env);
  const response = await route.POST(h.request({ amount: 1, course, email: h.body.email, registrationNo: h.body.registrationNo }));
  assert.equal(response.status, 200);
  assert.equal(h.orders[0].amount, 100);
  assert.equal(h.orders[0].notes.course, course);
  const tampered = await route.POST(h.request({ amount: 2, course }));
  assert.equal(tampered.status, 400);
  assert.equal(h.orders.length, 1);
  const legacy = await route.POST(h.request({ amount: 14995, course: "UPHESC" }));
  assert.equal(legacy.status, 200);
  assert.equal(h.orders[1].amount, 1499500);
  const notReady = makePaymentHarness({ batchNotReady: true });
  const unreadyRoute = loadTs("src/app/api/student-registration/create-payment-order/route.ts", notReady.mocks, notReady.env);
  const unready = await unreadyRoute.POST(notReady.request({ amount: 1, course, email: h.body.email, registrationNo: h.body.registrationNo }));
  assert.equal(unready.status, 503);
  assert.equal(notReady.orders.length, 0);
});

test("verified registration provisions separate batch, default faculty, and both credential emails", async () => {
  const h = makePaymentHarness();
  const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
  const response = await route.POST(h.request(h.body));
  assert.equal(response.status, 200, JSON.stringify(await response.json()));
  const row = h.service.calls.find((query) => query.table === "student_registrations" && query.operation === "insert").payload[0];
  assert.equal(row.course, course);
  assert.equal(row.payment_status, "successful");
  assert.equal(row.payment_amount, 1);
  assert.equal(row.status, "completed");
  const studentProfile = h.service.calls.find((query) => query.table === "student_profiles" && query.operation === "upsert");
  assert.equal(studentProfile.payload.target_exam, course);
  const batchLookup = h.service.calls.find((query) => query.table === "batches");
  assert.equal(batchLookup.filters.some(([, field, value]) => field === "course_id" && value === 2), true);
  assert.equal(batchLookup.filters.some(([, field, value]) => field === "faculty_user_id" && value === "faculty-pandey"), true);
  assert.equal(batchLookup.filters.some(([, field, value]) => field === "batch_name" && value === course), true);
  assert.equal(h.service.calls.find((query) => query.table === "enrollments").payload.batch_id, 20);
  assert.equal(h.emails.length, 2);
  for (const email of h.emails) {
    assert.match(email.text, /mockstudent/);
    assert.match(email.text, /LocalTest@123/);
    assert.match(email.text, /UPHESC-Mock Only/);
  }
  assert.deepEqual(h.emails.map((email) => email.to), ["admin@example.test", "student@example.test"]);
});

test("missing mock-only course never falls back to full UPHESC", async () => {
  const h = makePaymentHarness({ missingMockCourse: true });
  const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
  const response = await route.POST(h.request(h.body));
  assert.equal(response.status, 200);
  assert.equal(h.service.calls.find((query) => query.table === "courses" && query.operation === "insert").payload.title, course);
  const batchLookup = h.service.calls.find((query) => query.table === "batches");
  assert.equal(batchLookup.filters.some(([, field, value]) => field === "course_id" && value === 2), true);
});

test("mock-only registration rejects manual payment, missing consents, bad signature and tampered records", async () => {
  for (const alteration of [
    { paymentMode: "upi_qr" }, { mode: "free" }, { acceptedTerms: false },
    { acceptedPrivacy: false }, { acceptedRefund: false },
    { razorpaySignature: "invalid" }, { paymentAmount: 2 },
    { finalPayable: 2 }, { paymentTenure: "instalment" }, { includeBooksAddon: true },
  ]) {
    const h = makePaymentHarness();
    const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
    const response = await route.POST(h.request({ ...h.body, ...alteration }));
    assert.equal(response.status, 400, JSON.stringify(alteration));
    assert.equal(h.service.calls.some((query) => query.operation === "insert" || query.operation === "createUser"), false);
  }
  for (const overrides of [
    { payment: { amount: 200 } }, { payment: { status: "failed" } },
    { payment: { order_id: "other_order" } }, { payment: { currency: "USD" } },
    { order: { notes: { course: "UPHESC" } } }, { order: { amount: 200 } },
    { order: { notes: { course, registration_no: "OTHER", student_email: "student@example.test" } } },
  ]) {
    const h = makePaymentHarness(overrides);
    const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
    const response = await route.POST(h.request(h.body));
    assert.equal(response.status, 400, JSON.stringify(overrides));
    assert.equal(h.service.calls.some((query) => query.operation === "insert" || query.operation === "createUser"), false);
  }
  const h = makePaymentHarness({ reusedPayment: true });
  const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
  assert.equal((await route.POST(h.request(h.body))).status, 409);
});

test("authorized mock payments are captured at the fixed fee, including automatic-capture races", async () => {
  for (const captureRace of [false, true]) {
    const h = makePaymentHarness({ payment: { status: "authorized" }, captureRace });
    const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
    assert.equal((await route.POST(h.request(h.body))).status, 200);
    assert.deepEqual(h.captures, [["pay_local", 100, "INR"]]);
  }
  const h = makePaymentHarness({ payment: { status: "authorized" }, capture: { status: "authorized" } });
  const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
  assert.equal((await route.POST(h.request(h.body))).status, 400);
  assert.equal(h.service.calls.some((query) => query.operation === "insert"), false);
});

test("a mock-only Razorpay order cannot be relabelled as full UPHESC", async () => {
  const h = makePaymentHarness();
  const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
  const response = await route.POST(h.request({
    ...h.body, course: "UPHESC", baseCourseFee: 14995, finalPayable: 14995, paymentAmount: 14995,
  }));
  assert.equal(response.status, 400);
  assert.equal(h.service.calls.some((query) => query.operation === "insert"), false);
});

test("existing full-course Razorpay and manual enrolments retain their normal flows", async () => {
  for (const paymentMode of ["razorpay", "upi_qr"]) {
    const h = makePaymentHarness({ order: { notes: { course: "UPHESC" }, amount: 1499500 } });
    const route = loadTs("src/app/api/student-registration/route.ts", h.mocks, h.env);
    const response = await route.POST(h.request({
      ...h.body, course: "UPHESC", paymentMode, paymentAmount: 14995, finalPayable: 14995, baseCourseFee: 14995,
    }));
    assert.equal(response.status, 200);
    const registration = h.service.calls.find((query) => query.table === "student_registrations" && query.operation === "insert").payload[0];
    assert.equal(registration.course, "UPHESC");
    assert.equal(registration.status, paymentMode === "razorpay" ? "completed" : "pending");
    const batch = h.service.calls.find((query) => query.table === "batches");
    if (paymentMode === "razorpay") {
      assert.equal(batch.filters.some(([, field, value]) => field === "course_id" && value === 1), true);
      assert.equal(batch.filters.some(([, field, value]) => field === "batch_name" && value === "UPHESC-Pandey-A"), true);
    } else {
      assert.equal(batch, undefined);
    }
  }
});

const ids = {
  faculty: "00000000-0000-0000-0000-000000000001",
  fullStudent: "00000000-0000-0000-0000-000000000002",
  mockStudent: "00000000-0000-0000-0000-000000000003",
  mixedStudent: "00000000-0000-0000-0000-000000000004",
  admin: "00000000-0000-0000-0000-000000000005",
};

async function createDatabase() {
  const db = new PGlite();
  await db.exec(`
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create table profiles (user_id uuid primary key, role text, full_name text, is_active boolean default true);
    create table courses (id bigserial primary key, code text unique, title text, is_active boolean default true);
    create table batches (id bigserial primary key, course_id bigint, batch_name text, faculty_user_id uuid, start_date date);
    create table student_profiles (user_id uuid primary key, target_exam text);
    create table enrollments (student_user_id uuid, batch_id bigint);
    create table class_sessions (id bigserial primary key, batch_id bigint, title text);
    create table recorded_lectures (id bigserial primary key, batch_id bigint, title text);
    create table study_materials (id bigserial primary key, batch_id bigint, title text);
    create table faculty_tasks (id bigserial primary key, batch_id bigint, student_user_id uuid, title text);
    create table student_attendance (id bigserial primary key, student_user_id uuid);
    create table student_course_progress (id bigserial primary key, student_user_id uuid, course_id bigint);
    create table mock_tests (id bigserial primary key, batch_id bigint, course_id bigint, exam_type text, test_type text, is_published boolean);
    create table mcq_questions (id bigserial primary key, mock_test_id bigint, question_text text);
    create table student_registrations (id bigserial primary key, course text, mode text, razorpay_payment_id text);
    create table payments (id bigserial primary key, student_user_id uuid, amount numeric);
    create table student_fee_plans (id bigserial primary key, student_user_id uuid, total_fee numeric);
    insert into profiles (user_id, role, full_name) values
      ('${ids.faculty}', 'faculty', 'Dr. Prem Shankar Pandey'),
      ('${ids.fullStudent}', 'student', 'Full Student'),
      ('${ids.mockStudent}', 'student', 'Mock Student'),
      ('${ids.mixedStudent}', 'student', 'Mixed Student'),
      ('${ids.admin}', 'admin', 'Admin');
    insert into courses (code, title) values ('UPHESC', 'UPHESC');
    insert into batches (course_id, batch_name, faculty_user_id) values (1, 'UPHESC-Pandey-A', '${ids.faculty}');
    insert into student_profiles values
      ('${ids.fullStudent}', 'UPHESC'), ('${ids.mockStudent}', 'UPHESC-Mock Only'), ('${ids.mixedStudent}', null);
    insert into enrollments values ('${ids.fullStudent}', 1), ('${ids.mixedStudent}', 1);
    insert into class_sessions (batch_id, title) values (1, 'Full course class');
    insert into recorded_lectures (batch_id, title) values (1, 'Full course lecture');
    insert into study_materials (batch_id, title) values (1, 'Full course material');
    insert into faculty_tasks (batch_id, student_user_id, title) values (1, '${ids.fullStudent}', 'Full course task');
    insert into student_attendance (student_user_id) values ('${ids.fullStudent}');
    insert into student_course_progress (student_user_id, course_id) values ('${ids.fullStudent}', 1);
    insert into payments (student_user_id, amount) values ('${ids.mockStudent}', 1);
    insert into student_fee_plans (student_user_id, total_fee) values ('${ids.mockStudent}', 1);
    insert into mock_tests (batch_id, course_id, exam_type, test_type, is_published)
      values (1, 1, 'original', 'mcq', true);
    insert into mcq_questions (mock_test_id, question_text) values (1, 'Full course question');
    grant usage on schema public, auth to authenticated;
    grant all on all tables in schema public to authenticated;
    grant usage, select on all sequences in schema public to authenticated;
  `);
  for (const table of [
    "class_sessions", "recorded_lectures", "study_materials", "faculty_tasks",
    "student_attendance", "student_course_progress", "mock_tests", "mcq_questions", "payments", "student_fee_plans",
  ]) {
    // Deliberately permissive baseline proves the new restrictive policies
    // independently block bypasses rather than relying on an existing UI.
    await db.exec(`alter table ${table} enable row level security;
      create policy baseline on ${table} for all to authenticated using (true) with check (true);`);
  }
  return db;
}

async function asUser(db, id, query) {
  await db.exec(`set role authenticated; set request.jwt.claim.sub = '${id}';`);
  try {
    return await db.query(query);
  } finally {
    await db.exec("reset role");
  }
}

test("migration is transactional/idempotent and keeps the existing batch/enrollments untouched", async () => {
  const db = await createDatabase();
  try {
    const before = (await db.query("select * from batches where id = 1")).rows;
    const enrollmentsBefore = (await db.query("select * from enrollments order by student_user_id")).rows;
    await db.exec(migration);
    await db.exec(migration);
    assert.deepEqual((await db.query("select * from batches where id = 1")).rows, before);
    assert.deepEqual((await db.query("select * from enrollments order by student_user_id")).rows, enrollmentsBefore);
    const batches = (await db.query("select * from batches where batch_name = 'UPHESC-Mock Only'")).rows;
    assert.equal(batches.length, 1);
    assert.equal(batches[0].faculty_user_id, ids.faculty);
    assert.notEqual(batches[0].course_id, 1);
  } finally {
    await db.close();
  }
});

test("migration fails safely when the default faculty is unavailable", async () => {
  const db = await createDatabase();
  try {
    await db.exec(`update profiles set is_active = false where user_id = '${ids.faculty}'`);
    await assert.rejects(db.exec(migration), /no rows|returned no rows/);
    await db.exec("rollback");
    assert.equal((await db.query("select count(*)::int as count from courses")).rows[0].count, 1);
    assert.equal((await db.query("select count(*)::int as count from batches")).rows[0].count, 1);
  } finally {
    await db.close();
  }
});

test("RLS blocks non-test features for mock-only students but keeps fees and existing students accessible", async () => {
  const db = await createDatabase();
  try {
    await db.exec(migration);
    await db.exec(`
      insert into enrollments values ('${ids.mockStudent}', 2), ('${ids.mixedStudent}', 2);
      insert into mock_tests (batch_id, course_id, exam_type, test_type, is_published) values (2, 2, 'mock', 'mcq', true);
      insert into mcq_questions (mock_test_id, question_text) values (2, 'Mock-only question');
    `);
    for (const table of ["class_sessions", "recorded_lectures", "study_materials", "faculty_tasks", "student_attendance", "student_course_progress"]) {
      assert.equal((await asUser(db, ids.mockStudent, `select * from ${table}`)).rows.length, 0, table);
      assert.equal((await asUser(db, ids.fullStudent, `select * from ${table}`)).rows.length, 1, table);
      assert.equal((await asUser(db, ids.admin, `select * from ${table}`)).rows.length, 1, table);
    }
    assert.equal((await asUser(db, ids.mockStudent, "select * from payments")).rows.length, 1);
    assert.equal((await asUser(db, ids.mockStudent, "select * from student_fee_plans")).rows.length, 1);
    assert.equal((await asUser(db, ids.mockStudent, "select * from mcq_questions")).rows[0].question_text, "Mock-only question");
    assert.equal((await asUser(db, ids.fullStudent, "select * from mcq_questions")).rows.length, 2);
    assert.equal((await asUser(db, ids.mixedStudent, "select * from recorded_lectures")).rows.length, 1);
  } finally {
    await db.close();
  }
});

test("faculty can assign MCQ/descriptive mock tests, but not original exams, classes, content, tasks or progress to new batch", async () => {
  const db = await createDatabase();
  try {
    await db.exec(migration);
    await db.exec(`insert into enrollments values ('${ids.mockStudent}', 2);`);
    for (const table of ["class_sessions", "recorded_lectures", "study_materials"]) {
      await assert.rejects(asUser(db, ids.faculty, `insert into ${table} (batch_id, title) values (2, 'Blocked')`), /row-level security/);
      await asUser(db, ids.faculty, `insert into ${table} (batch_id, title) values (1, 'Allowed')`);
      await assert.rejects(asUser(db, ids.faculty, `update ${table} set batch_id = 2 where title = 'Allowed'`), /row-level security/);
    }
    await assert.rejects(asUser(db, ids.faculty, `insert into faculty_tasks (batch_id, title) values (2, 'Blocked')`), /row-level security/);
    await assert.rejects(asUser(db, ids.faculty, `insert into faculty_tasks (student_user_id, title) values ('${ids.mockStudent}', 'Blocked')`), /row-level security/);
    await assert.rejects(asUser(db, ids.faculty, `insert into student_course_progress (student_user_id, course_id) values ('${ids.mockStudent}', 2)`), /row-level security/);
    for (const type of ["mcq", "descriptive"]) {
      await asUser(db, ids.faculty, `insert into mock_tests (batch_id, course_id, exam_type, test_type, is_published) values (2, 2, 'mock', '${type}', true)`);
    }
    await assert.rejects(asUser(db, ids.faculty, "insert into mock_tests (batch_id, course_id, exam_type) values (2, 2, 'original')"), /row-level security/);
    await assert.rejects(asUser(db, ids.faculty, "insert into mock_tests (batch_id, course_id, exam_type) values (1, 2, 'mock')"), /row-level security/);
    await assert.rejects(asUser(db, ids.faculty, "insert into mock_tests (course_id, exam_type) values (2, 'mock')"), /row-level security/);
    await asUser(db, ids.faculty, "insert into mock_tests (batch_id, course_id, exam_type) values (1, 1, 'original')");
  } finally {
    await db.close();
  }
});

test("mock-only registration payment cannot be reused; existing registration indexing is unchanged", async () => {
  const db = await createDatabase();
  try {
    await db.exec(migration);
    await db.exec(`insert into student_registrations (course, mode, razorpay_payment_id) values ('UPHESC-Mock Only', 'paid', 'pay_once')`);
    await assert.rejects(db.exec(`insert into student_registrations (course, mode, razorpay_payment_id) values ('UPHESC-Mock Only', 'paid', 'pay_once')`), /duplicate key/);
    await db.exec(`insert into student_registrations (course, mode, razorpay_payment_id) values ('UPHESC', 'paid', 'legacy'), ('UPHESC', 'paid', 'legacy')`);
  } finally {
    await db.close();
  }
});
