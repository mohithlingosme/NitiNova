# NitiNova Frontend Refactor TODO

## Approved Plan Progress Tracker

### Phase 1: Setup & Core Layout ✅
- [x] ✅ Install react-router-dom
- [x] Create `src/layouts/MainLayout.tsx`
- [x] Create `src/components/Sidebar.tsx`
- [x] Create `src/components/Topbar.tsx`
- [x] Create `src/components/Card.tsx`
- [x] Create `src/components/Loader.tsx`
- [x] Update `src/App.tsx` with Router + MainLayout

### Phase 2: Core Pages ✅
- [x] `src/pages/Home.tsx` (Hero + AI input + trending)
- [x] `src/pages/Dashboard.tsx` (Cards grid)
- [x] `src/pages/Research.tsx` (3-col layout)
- [x] `src/pages/Drafting.tsx` (Editor + suggestions)
- [x] `src/pages/Cases.tsx` (List + detail)
- [x] `src/pages/Documents.tsx` (Files + upload)

### Phase 3: Polish & Test
- [ ] Add loading states/transitions everywhere
- [ ] Integrate existing auth (/login, /register)
- [ ] Auth guard for protected routes
- [ ] Responsive sidebar (mobile)
- [ ] Run `npm run dev` + test all routes
- [ ] ✅ Complete refactor

**Next: Layout files after deps.**

**Commands to verify:**
```
npm i react-router-dom@^6.26.2
npm run dev
```

