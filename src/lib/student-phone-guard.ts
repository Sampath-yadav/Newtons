import { Prisma } from "@prisma/client";
import { normalizePhone } from "./phone";

// Prisma client extension: normalise & validate `parentPhone` on EVERY write to
// the Student table (create / createMany / update / updateMany / upsert). This
// makes "validate the number when saving a student record" impossible to bypass
// — the seed today and any future admin/import route inherit it automatically.
// An invalid number throws (from normalizePhone), surfacing a clear error at
// save time instead of a silent SMS failure later.
export const studentPhoneGuard = Prisma.defineExtension({
  name: "studentPhoneGuard",
  query: {
    student: {
      create({ args, query }) {
        if (typeof args.data?.parentPhone === "string") {
          args.data.parentPhone = normalizePhone(args.data.parentPhone);
        }
        return query(args);
      },
      createMany({ args, query }) {
        const rows = Array.isArray(args.data) ? args.data : [args.data];
        for (const r of rows) {
          if (typeof r.parentPhone === "string") r.parentPhone = normalizePhone(r.parentPhone);
        }
        return query(args);
      },
      update({ args, query }) {
        if (typeof args.data?.parentPhone === "string") {
          args.data.parentPhone = normalizePhone(args.data.parentPhone);
        }
        return query(args);
      },
      updateMany({ args, query }) {
        if (typeof args.data?.parentPhone === "string") {
          args.data.parentPhone = normalizePhone(args.data.parentPhone);
        }
        return query(args);
      },
      upsert({ args, query }) {
        if (typeof args.create?.parentPhone === "string") {
          args.create.parentPhone = normalizePhone(args.create.parentPhone);
        }
        if (typeof args.update?.parentPhone === "string") {
          args.update.parentPhone = normalizePhone(args.update.parentPhone);
        }
        return query(args);
      },
    },
  },
});
