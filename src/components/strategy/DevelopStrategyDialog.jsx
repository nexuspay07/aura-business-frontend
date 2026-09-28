import { useEffect, useRef, useState } from "react";
import { personal } from "../personal/PersonalUI";
import { createStrategyFromDecision } from "../../services/api";
import { createIdempotencyKey } from "../../services/idempotency";

function failureFor(error) {
  const status = error?.response?.status;
  const code = error?.response?.data?.detail?.code;
  const failures = {
    decision_canonical_snapshot_unavailable: ["This decision was saved before Strategy development was available. You can still review it, but it cannot be developed into a Strategy.", false],
    decision_choice_requires_reevaluation: ["Your recorded choice no longer matches the evaluated decision. Re-evaluate the decision before developing a Strategy.", false],
    strategy_creation_in_progress: ["Strategy development is already in progress. Wait a moment and try again.", true],
    strategy_conflict: ["This Strategy request conflicts with its current state. Refresh your Strategies and try again.", false],
  };
  if (failures[code]) return { message: failures[code][0], retryable: failures[code][1], terminal: !failures[code][1] };
  if (status === 422) return { message: "A reliable Strategy could not be produced from this Decision.", retryable: false, terminal: true };
  if (status === 502) return { message: "Aevric could not produce a valid Strategy. Try again.", retryable: true, terminal: false };
  if (status === 503) return { message: "Strategy development is temporarily unavailable. Try again shortly.", retryable: true, terminal: false };
  if (status === 504) return { message: "Strategy development needs more time. Try again.", retryable: true, terminal: false };
  if (status === 404) return { message: "This Decision or a required resource is not available.", retryable: false, terminal: true };
  return { message: "Strategy development could not be completed. Please try again.", retryable: true, terminal: false };
}

export default function DevelopStrategyDialog({ decision, onCancel, onCreated }) {
  const [title, setTitle] = useState(decision.title || "");
  const [failure, setFailure] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasLogicalSubmission, setHasLogicalSubmission] = useState(false);
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const logicalSubmission = useRef(null);
  const pending = useRef(false);

  useEffect(() => {
    titleRef.current?.focus();
    const handleKeyDown = event => {
      if (event.key === "Escape" && !pending.current) {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...dialogRef.current.querySelectorAll("input, button:not([disabled])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  function changeTitle(event) {
    const value = event.target.value;
    setTitle(value);
    if (failure?.terminal) return;
    if (logicalSubmission.current?.title !== value.trim()) {
      logicalSubmission.current = null;
      setHasLogicalSubmission(false);
    }
    setFailure(null);
  }

  async function submit(event) {
    event.preventDefault();
    if (pending.current) return;
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setFailure({ message: "Enter a Strategy title.", retryable: true, terminal: false });
      return;
    }
    if (normalizedTitle.length > 255) {
      setFailure({ message: "Strategy title must be 255 characters or fewer.", retryable: true, terminal: false });
      return;
    }
    if (!decision.public_id) {
      setFailure({ message: "This Decision cannot be developed into a Strategy.", retryable: false, terminal: true });
      return;
    }

    if (!logicalSubmission.current || logicalSubmission.current.title !== normalizedTitle) {
      logicalSubmission.current = { title: normalizedTitle, key: createIdempotencyKey() };
      setHasLogicalSubmission(true);
    }
    const submission = logicalSubmission.current;
    pending.current = true;
    setSubmitting(true);
    setFailure(null);
    try {
      const strategy = await createStrategyFromDecision(decision.public_id, submission.title, submission.key);
      logicalSubmission.current = null;
      setHasLogicalSubmission(false);
      onCreated(strategy);
    } catch (error) {
      setFailure(failureFor(error));
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  }

  function cancel() {
    if (pending.current) return;
    logicalSubmission.current = null;
    setHasLogicalSubmission(false);
    onCancel();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="develop-strategy-title"
        aria-describedby="develop-strategy-description"
        className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#10151f] p-6 shadow-2xl sm:p-8"
      >
        <h2 id="develop-strategy-title" className="text-2xl font-semibold text-white">Develop Strategy</h2>
        <p id="develop-strategy-description" className="mt-3 leading-7 text-slate-400">
          Aevric will develop a persistent Strategy from this saved Decision.
        </p>
        <form onSubmit={submit} className="mt-7">
          <label htmlFor="strategy-title" className="text-sm font-medium text-slate-200">Strategy title</label>
          <input
            ref={titleRef}
            id="strategy-title"
            value={title}
            onChange={changeTitle}
            maxLength={255}
            aria-invalid={Boolean(failure)}
            aria-describedby={failure ? "strategy-development-error" : undefined}
            disabled={submitting}
            className={`mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-blue-300/60 focus:ring-2 focus:ring-blue-300/10 disabled:opacity-60 ${personal.focus}`}
          />
          <p className="mt-2 text-xs text-slate-500">Maximum 255 characters</p>
          {failure && <p id="strategy-development-error" role="alert" className="mt-4 text-sm leading-6 text-red-200">{failure.message}</p>}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={cancel} disabled={submitting} className={`min-h-11 rounded-xl border border-white/10 px-5 font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-50 ${personal.focus}`}>Cancel</button>
            <button type="submit" disabled={submitting || Boolean(failure && !failure.retryable)} aria-busy={submitting} className={`min-h-11 rounded-xl bg-blue-500 px-5 font-semibold text-white hover:bg-blue-400 disabled:opacity-50 ${personal.focus}`}>
              {submitting ? "Developing Strategy…" : failure?.retryable && hasLogicalSubmission ? "Retry" : "Develop Strategy"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
