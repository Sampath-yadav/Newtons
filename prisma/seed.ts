/**
 * Seed script — creates one admin, one teacher, and sample students.
 * Run: npx ts-node prisma/seed.ts
 * (or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" })
 */

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import path from "node:path";
import { studentPhoneGuard } from "../src/lib/student-phone-guard";

config({ path: path.resolve(process.cwd(), ".env.local") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
// Same parent-phone guard as the app: seeded numbers are stored as +91 E.164.
const prisma = new PrismaClient({ adapter }).$extends(studentPhoneGuard);

async function main() {
  // Admin — Google-authenticated, so no local password is stored. Set
  // ADMIN_EMAIL (and optionally ADMIN_NAME) in .env.local to bootstrap your real
  // Google admin: that email is what authorizes admin access at sign-in.
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@newtons.edu.in").toLowerCase();
  const adminName = process.env.ADMIN_NAME ?? "School Admin";
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    // Re-seeding repairs an existing row: ensure it is an ACTIVE admin and clear
    // any stale password so the account is Google-only.
    update: { name: adminName, role: "ADMIN", status: "ACTIVE", password: null },
    create: {
      name: adminName,
      email: adminEmail,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("✅ Admin (Google login):", admin.email);

  // Teacher — Google-authenticated like admins (no password). For a real teacher
  // to sign in, this email must be their actual Google account; otherwise add
  // teachers through the admin Teacher Management module.
  const teacherEmail = (process.env.TEACHER_EMAIL ?? "teacher@newtons.edu.in").toLowerCase();
  const teacher = await prisma.user.upsert({
    where: { email: teacherEmail },
    update: { role: "TEACHER", status: "ACTIVE", password: null },
    create: {
      name: "Class Teacher",
      email: teacherEmail,
      role: "TEACHER",
      status: "ACTIVE",
    },
  });
  console.log("✅ Teacher created:", teacher.email);

  // Sample students for Class 8A
  const students = [
    { admissionNumber: "NH-2024-001", name: "Arjun Reddy",       class: "8", section: "A", parentPhone: "9876543210" },
    { admissionNumber: "NH-2024-002", name: "Priya Sharma",      class: "8", section: "A", parentPhone: "9876543211" },
    { admissionNumber: "NH-2024-003", name: "Sai Kumar",         class: "8", section: "A", parentPhone: "9876543212" },
    { admissionNumber: "NH-2024-004", name: "Divya Lakshmi",     class: "8", section: "A", parentPhone: "9876543213" },
    { admissionNumber: "NH-2024-005", name: "Ravi Teja",         class: "8", section: "A", parentPhone: "9876543214" },
    { admissionNumber: "NH-2024-006", name: "Anusha Rao",        class: "9", section: "A", parentPhone: "9876543215" },
    { admissionNumber: "NH-2024-007", name: "Karthik Naidu",     class: "9", section: "A", parentPhone: "9876543216" },
    { admissionNumber: "NH-2024-008", name: "Lakshmi Prasad",    class: "9", section: "A", parentPhone: "9876543217" },
    { admissionNumber: "NH-2024-009", name: "Venkat Suresh",     class: "10", section: "A", parentPhone: "9876543218" },
    { admissionNumber: "NH-2024-010", name: "Sirisha Devi",      class: "10", section: "A", parentPhone: "9876543219" },
  ];

  for (const s of students) {
    await prisma.student.upsert({
      where: { admissionNumber: s.admissionNumber },
      update: {},
      create: s,
    });
  }
  console.log(`✅ ${students.length} sample students created.`);
  console.log("\n📋 Access:");
  console.log(`   Admin   → ${adminEmail} (sign in with Google at /admin)`);
  console.log(`   Teacher → ${teacherEmail} (sign in with Google at /teacher)`);
  console.log("   Admin portal: http://localhost:3000/admin");
  console.log("   Teacher portal: http://localhost:3000/teacher");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
