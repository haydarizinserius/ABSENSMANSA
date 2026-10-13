import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveAttendanceStatus,
  getAsiaJakartaDate,
} from "./server/attendanceService.js";
import { fetchOne } from "./server/db.js";

const iso = "2026-10-13T06:29:00+07:00";
const onTime = "2026-10-13T06:30:00+07:00";
const late = "2026-10-13T06:31:00+07:00";

test("absensi sebelum 06.30 WIB dianggap tepat waktu", () => {
  assert.equal(resolveAttendanceStatus(iso, "06:30"), "Tepat Waktu");
});

test("absensi tepat 06.30 WIB dianggap tepat waktu", () => {
  assert.equal(resolveAttendanceStatus(onTime, "06:30"), "Tepat Waktu");
});

test("absensi setelah 06.30 WIB dianggap terlambat", () => {
  assert.equal(resolveAttendanceStatus(late, "06:30"), "Terlambat");
});

test("zona waktu server dipastikan Asia/Jakarta", () => {
  const data = getAsiaJakartaDate(new Date("2026-10-13T06:30:00+07:00"));
  assert.match(data.date, /^2026-10-13$/);
});

test("admin default harus aktif dan konsisten dengan konfigurasi", () => {
  const row = fetchOne(
    "SELECT username, email, is_active, role FROM users WHERE username = ?",
    ["admin"],
  );

  assert.ok(row, "Akun admin harus dibuat saat inisialisasi database");
  assert.equal(row.is_active, 1);
  assert.equal(row.role, "admin");
  assert.equal(row.email, "admin@school.local");
});
