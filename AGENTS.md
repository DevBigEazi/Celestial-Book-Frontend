# AGENTS.md — AI Agent Operating Directive

## 1. Primary Rule & Source of Truth
- **Single Source of Truth**: All architectural decisions, screens, mock data, and visual requirements are detailed in [`agent.md`](./agent.md) and the project PRD ([`Celestial_Book_PRD.pdf`](./Celestial_Book_PRD.pdf)). Do not omit anything from the PRD.
- **Product Flow**: DISCOVER → PERSONALIZE → READ → CONNECT.

## 2. Expo SDK 57 Constraints
- Expo HAS CHANGED. This project runs on **Expo SDK 57** (`~57.0.19`), React 19.2, and React Native 0.86.
- Read the exact versioned documentation at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## 3. Strict Development Standards
1. **TypeScript Strictness**:
   - `"strict": true`. Zero `any` types.
   - Run `npx tsc --noEmit` before finishing any task.
2. **Linting**:
   - Zero ESLint warnings or errors. No `// eslint-disable` comments.
   - Run `npx expo lint` before finishing any task.
3. **Styling**:
   - Pure React Native `StyleSheet.create` only. No Tailwind, NativeWind, or inline styles.
   - Colors from `colors.ts` / `useTheme()`. Spacing & typography from `theme.ts`.
4. **No Placeholders**:
   - Real atmospheric mock data from `/src/mock/`. No "TODO", "Coming soon", or lorem ipsum.
5. **Git Workflow & Push Gate**:
   - **Always commit and push the verified implementation of each step before proceeding to the next step.**
   - Never push scratch files, extracted PRD text, PRD pdf, ROADMAP.md, or unnecessary temporary artifacts (all excluded in `.gitignore`).
