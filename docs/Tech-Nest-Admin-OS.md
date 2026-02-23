# Tech Nest Admin Operating System

## Architecture Overview
The system is the internal control center that lets one person run a platform competing with large tech websites.
A fast, safe, scalable tool.

### Modules
1. **Admin Dashboard**: System overview (devices added, pending reports, queues).
2. **Device Manager**: Daily workspace. Left panel for list/filters, Right for editor (General, Specs, Media, Variants, AI Summary, SEO).
3. **Spec Management**: Manage definitions, categories, highlights.
4. **Media Manager**: Drag & drop upload, auto-optimize, assign tags.
5. **Comparison Control**: Pin comparisons, regenerate summaries.
6. **Review Moderation**: Queue for pending, reported, verified reviews.
7. **Spec Reports**: User reports -> Mod review -> Apply Fix.
8. **User Management**: Roles (user, editor, moderator, admin, super_admin).
9. **Settings Panel**: Feature flags, category management, AI config.

### Tech Stack Choices
- **Frontend**: React, Tailwind CSS, shadcn/ui (enterprise components), TanStack Table (data tables), React Hook Form, Zod.
- **Backend/Roles**: Supabase RLS, Python backend role enforcement.

### UX Principles
1. **Keyboard First**: Fast actions (N for new, S for save, / for search).
2. **Inline Editing**: No opening new pages unnecessarily.
3. **Prevent Data Loss**: Auto-save.
4. **Safe Deletes**: Soft delete only.

### AI Future Expansion
- Auto-fill specs, detect missing data, write summaries, flag incorrect info, suggest trending devices.
