# Points (XP) Spec for AI Agents

Use this spec to implement or extend how points (XP) are gained and updated in the app.

---

## Where points live

- **State:** User progress, including total XP, lives in React state in `UserContext`: `progress.xp`.
- **Updates:** The only function that should add XP is `addXp(amount)` from `useUser()` in `src/app/context/UserContext.tsx`. It performs: `setProgress(prev => ({ ...prev, xp: prev.xp + amount }))`.
- **Persistence:** Progress (and thus XP) is kept in memory. Persist `progress` to localStorage (or your backend) wherever you already persist user/progress so XP survives refresh.

---

## When to award points (and how much)

### 1. Challenges

- **When:** When the user submits a challenge (e.g. from the challenge submit flow).
- **Where:** `src/app/pages/app/ChallengeSubmitPage.tsx` (or the component that handles challenge submit).
- **Amount:** Use the challenge’s point value: `challenge.points` (from `src/app/data/learnData.ts` or your challenge model). Call `addXp(challenge.points)` once per submit, and only when the submit is successful if you have validation.
- **UI:** Show “Points awarded” (and any streak bonus) on the results screen, e.g. `src/app/pages/app/ChallengeResultsPage.tsx`.

### 2. Trainings

- **When:** When the user marks a training as complete (e.g. after viewing or finishing the training).
- **Where:** `src/app/pages/app/TrainingStartPage.tsx` (or the component that handles “Mark complete”).
- **Amount:** A fixed constant (e.g. `TRAINING_XP`). Call `addXp(TRAINING_XP)` once when the user completes the training.
- **UI:** Optionally show a short message that they earned XP.

### 3. Micro-Learnings

- **When:** When the user marks a micro-learning as complete.
- **Where:** `src/app/pages/app/MicroLearningViewerPage.tsx` (or equivalent).
- **Amount:** Use the micro-learning’s point value: `micro.points` (from learn data). Call `addXp(micro.points)` once when they mark it complete.
- **UI:** Optionally show that they earned points.

---

## Rules for the agent

- Do not add XP anywhere except via `addXp(amount)` from `UserContext`.
- For challenges and micro-learnings, use the point value from the data (challenge or micro object). For trainings, use the defined constant.
- Award points only once per completion (e.g. guard by “already completed” or success of the action).
- Where the UI shows “Points awarded” or total XP, read from `progress.xp` (or the same source that `addXp` updates).

---

## Optional: Persistence

If you want XP to survive refresh, add: “Persist `progress` to localStorage whenever `setProgress` is called (e.g. in a `useEffect` that runs when `progress` changes), and restore it on app load in `UserContext`.”
