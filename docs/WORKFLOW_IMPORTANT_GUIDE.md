# WORKFLOW IMPORTANT GUIDE

## 🚨 CRITICAL PRINCIPLES - NO EXCEPTIONS

### 1. PROJECT INTEGRITY FIRST
- **Priority**: Project consistency > Individual task completion
- **Rule**: Always prioritize whole project integrity over completing a single task
- **Action**: If task conflicts with project standards, fix project-wide inconsistencies first

### 2. COMPONENT CONSISTENCY RULE
- **Rule**: ALL components of the same type MUST be identical in function and appearance
- **Difference**: Components should differ ONLY by passed props, never by implementation
- **Examples**:
  - All inputs = Same Input component with different props
  - All buttons = Same Button component with different variants
  - All checkboxes = Same Checkbox component with different props
  - All modals = Same Modal component with different content

### 3. NO NATIVE HTML ELEMENTS
- **Rule**: NEVER use native HTML elements directly (input, button, select, textarea, checkbox, etc.)
- **Action**: Always use or create corresponding UI components
- **Exception**: None - this rule has no exceptions

### 4. COMPONENT SCANNING REQUIREMENT
- **Rule**: ALWAYS scan ALL files for consistency issues before task completion
- **Tools**: Use grep_search and file_search to find ALL instances
- **Action**: Update ALL found instances, not just current file

### 5. WORKFLOW PROCESS
1. **Task Presentation** - Outline complete implementation plan
2. **Wait for Approval** - Get explicit user confirmation before starting
3. **Scan for Inconsistencies** - Find ALL instances of relevant components/patterns
4. **Fix Project-Wide** - Update ALL files to maintain consistency
5. **Complete Implementation** - Build/fix all components properly
6. **Final Scan** - Verify no inconsistencies remain

## 🔧 TECHNICAL STANDARDS

### Component Requirements
- **Vue 3 Composition API** - Use <script setup>
- **TypeScript/JavaScript** - Proper error handling
- **Theme Awareness** - All components must adapt to themes
- **Accessibility** - Built-in accessibility features
- **Mobile Responsive** - All components work on mobile
- **Props-Based Variants** - Use props for different appearances/behaviors

### Integration Requirements
- **Theme System** - Use themeManager for all text/colors
- **SEO Integration** - Meta tags and structured data
- **PWA Support** - Offline functionality where applicable
- **Supabase Integration** - Database operations
- **Error Handling** - Graceful error states

### Code Quality Standards
- **Consistent Naming** - Follow Vue/JS conventions
- **Documentation** - JSDoc comments for complex functions
- **Testing Readiness** - Write testable, modular code
- **Performance** - Optimize for bundle size and runtime

## 🎯 COMPONENT LIBRARY RULES

### UI Components Must Include
1. **Base Component** - Core functionality
2. **Variant Props** - For different appearances
3. **Size Props** - For different dimensions
4. **State Props** - disabled, loading, error states
5. **Theme Integration** - CSS variables and theme classes
6. **Accessibility** - ARIA labels, keyboard navigation

### Required UI Components
- Button (variants: primary, secondary, outline, ghost)
- Input (types: text, email, password, number, textarea)
- Checkbox (with label integration)
- Select (dropdown with options)
- Radio (radio button groups)
- Modal (with different sizes/purposes)
- Card (with header, body, footer variants)
- Typography (all text elements)

## 🔍 SCANNING CHECKLIST

Before completing any task, scan for:

1. **Native HTML Elements**
   ```bash
   grep -r "<input" src/
   grep -r "<button" src/
   grep -r "<select" src/
   grep -r "<textarea" src/
   grep -r "type=\"checkbox\"" src/
   ```

2. **Component Imports**
   ```bash
   grep -r "import.*Input" src/
   grep -r "import.*Button" src/
   ```

3. **Inconsistent Patterns**
   - Different component imports for same functionality
   - Mixed native and component usage
   - Inconsistent prop patterns

## 🚀 EXECUTION PRIORITY

1. **Identify All Inconsistencies** - Complete project scan first
2. **Fix Core Components** - Ensure base components are correct
3. **Update All Usage** - Replace ALL instances project-wide
4. **Verify Integration** - Test all components work with themes/systems
5. **Complete Task** - Only then complete the specific task

## ❌ COMMON MISTAKES TO AVOID

- Creating new components when existing ones should be used
- Leaving native HTML elements anywhere in the codebase
- Updating only current file instead of project-wide
- Completing task without scanning for inconsistencies
- Prioritizing task completion over project integrity

## ✅ SUCCESS CRITERIA

- Zero native HTML form elements in codebase
- All similar components use same base component
- Consistent prop patterns across all components
- Theme integration works on all components
- Mobile responsive design on all components
- Accessibility features on all interactive elements

---

**REMEMBER**: This is a whole project worked on in tasks, not individual isolated tasks. Every change must consider and maintain project-wide consistency.