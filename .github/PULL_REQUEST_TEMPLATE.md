## What does this PR do?
<!-- Brief description of changes -->

## Type of change
- [ ] feat: new feature
- [ ] fix: bug fix
- [ ] chore: maintenance
- [ ] docs: documentation
- [ ] refactor: code refactor

## Checklist
- [ ] Code builds without errors
- [ ] No console errors
- [ ] Tested locally
- [ ] .env.example updated if new env vars added
```

---

### 4. Add GitHub secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:
```
NEXT_PUBLIC_API_URL          → http://localhost:8000 (update when deployed)
NEXT_PUBLIC_SUPABASE_URL     → your supabase url
NEXT_PUBLIC_SUPABASE_ANON_KEY → your anon key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY → your clerk publishable key