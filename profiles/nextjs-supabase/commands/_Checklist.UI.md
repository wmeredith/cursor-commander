## UI Checklist (Tailwind + shadcn/ui)

### Tailwind
- Class usage consistent; avoid inline styles
- Responsive classes correct and minimal
- Dark mode classes if applicable

### shadcn/ui
- Components used as intended (composition patterns)
- `asChild` prop where appropriate
- Proper variant usage

### Accessibility
- Labels for all inputs (`<label>` or `aria-label`)
- Keyboard navigation preserved
- Focus management correct
- `Dialog`, `Popover`, `DropdownMenu` usage follows a11y patterns
- Color contrast sufficient
- Screen reader support (aria attributes)

### UX
- Loading states present where needed
- Empty states handled gracefully
- Error states with clear messaging
- Forms show validation feedback
- No layout shift / jank
- Responsive on mobile
