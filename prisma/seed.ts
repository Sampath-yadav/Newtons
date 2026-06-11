/**
 * Seed script — creates one admin, one teacher, and sample students.
 * Run: npx ts-node prisma/seed.ts
 * (or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" })
 */

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const teacherPassword = await bcrypt.hash("teacher123", 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@newtons.edu.in" },
    update: {},
    create: {
      name: "School Admin",
      email: "admin@newtons.edu.in",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Teacher
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@newtons.edu.in" },
    update: {},
    create: {
      name: "Class Teacher",
      email: "teacher@newtons.edu.in",
      password: teacherPassword,
      role: "teacher",
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
  console.log("\n📋 Login credentials:");
  console.log("   Admin   → admin@newtons.edu.in   / admin123");
  console.log("   Teacher → teacher@newtons.edu.in / teacher123");
  console.log("   Admin portal: http://localhost:3000/admin/marks");
  console.log("   Teacher portal: http://localhost:3000/teacher");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
