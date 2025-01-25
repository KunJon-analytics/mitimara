import { CUTOFF_VERIFICATIONS, treeLogicConfig } from "@/config/site";

type Submission = boolean;

interface VerificationResult {
  status: "complete" | "incomplete";
  result?: boolean;
}

export function checkVerificationComplete(
  submissions: Submission[],
  newSubmission: Submission
): VerificationResult {
  // Add the new submission to the existing submissions
  submissions.push(newSubmission);

  // Count the number of 'real' and 'fake' submissions
  const realCount = submissions.filter(
    (submission) => submission === true
  ).length;
  const fakeCount = submissions.filter(
    (submission) => submission === false
  ).length;

  // Check if the cutoff is reached and majority is determined
  if (submissions.length >= CUTOFF_VERIFICATIONS) {
    if (realCount >= Math.ceil(CUTOFF_VERIFICATIONS / 2)) {
      return { status: "complete", result: true };
    } else if (fakeCount >= Math.ceil(CUTOFF_VERIFICATIONS / 2)) {
      return { status: "complete", result: false };
    }
  }

  // Check if the total verifiers is reached and majority is determined
  if (submissions.length >= treeLogicConfig.maxNoOfTreeVerifications) {
    if (realCount > fakeCount) {
      return { status: "complete", result: true };
    } else if (fakeCount > realCount) {
      return { status: "complete", result: false };
    } else {
      return { status: "incomplete", result: undefined };
    }
  }

  return { status: "incomplete", result: undefined };
}
