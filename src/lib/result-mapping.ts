// Guards the student ↔ result-token ↔ exam mapping before any result SMS is
// sent, so Student A's link can never go to Student B's parent even if a caller
// passes mismatched ids. Cheap, and called on every send (single + batch).

export function checkResultMapping(args: {
  resultToken: { studentId: number; examId: number };
  studentId: number;
  examId: number;
}): { ok: true } | { ok: false; reason: string } {
  if (args.resultToken.examId !== args.examId) {
    return { ok: false, reason: "Result token does not belong to this exam." };
  }
  if (args.resultToken.studentId !== args.studentId) {
    return { ok: false, reason: "Result token does not match this student." };
  }
  return { ok: true };
}
