<!-- 
CGI Design System Guidelines
Use this file to provide the AI with rules and guidelines for the CGI design system.
This ensures consistent implementation of colors, typography, components, and interactions.
-->

# General Guidelines

## Code Quality
* Use semantic HTML5 elements
* Prefer flexbox and grid for layouts over absolute positioning
* Keep components modular and reusable
* Use CSS custom properties for colors and spacing
* Write accessible code with proper ARIA labels
* Optimize for performance - minimize reflows and repaints

## Responsive Design
* Mobile-first approach by default
* Breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)
* Touch targets should be minimum 44x44px on mobile
* Text should be readable without zooming

# Design System Guidelines

## Colors

### Primary Colors
* **CGI Purple** `#5236ab` - Primary brand color, use for main CTAs and brand elements
* **CGI Red** `#e31937` - Primary accent color, use for important actions and highlights
* **CGI Gray** `#333333` - Primary gray for text and UI elements
* **White** `#ffffff` - Base background color

### Color Scales
Use the appropriate shade based on context:

**Purple Scale:**
* 900 `#200a58` - Darkest, use for high contrast on light backgrounds
* 800 `#2d1e5e`
* 700 `#3a2679`
* 600 (base) `#5236ab` - Primary brand color
* 500 `#755ebc`
* 400 `#9e83f5`
* 300 `#afa3d8`
* 200 `#cbc3e6`
* 100 `#e6e3f3`
* 50 `#f2f1f9` - Lightest, use for subtle backgrounds

**Gray Scale:**
* 900 `#151515` - Icons and darkest elements
* 800 `#1c1c1c`
* 700 `#242424`
* 600 `#2e2e2e`
* 500 (base) `#333333` - Default text color
* 400 `#5c5c5c`
* 300 `#767676`
* 200 `#a8a8a8`
* 100 `#c0c0c0`
* 50 `#efefef` - Light backgrounds and dividers

**Red Scale:**
* 900 `#600a17` through 50 `#fce8eb`
* Base (600) `#e31937` - Primary red

### Semantic Colors
* **Success** `#1ab977` - Confirmations, successful actions
  * Scale: 900 `#0b4e32` through 50 `#e8f8f1`
* **Warning** `#f1a425` - Cautions, alerts that need attention
  * Scale: 900 `#654510` through 50 `#fef6e9`
* **Error** `#b00020` - Errors, destructive actions, validation failures
  * Scale: 900 `#4a000d` through 50 `#f7e6e9`
* **Magenta** `#a82465` - Secondary brand accent
  * Shades: 600 `#7e1b4c`, 300 `#a82465`, 200 `#cb7ca3`

### Text Colors
* Default text: `#333333` (CGI Gray)
* Links: `#5236ab` (CGI Purple)
* Disabled text: `rgba(21, 21, 21, 0.45)`
* Icons: `#151515` (CGI Gray 900)

### Usage Rules
* Use Success colors for positive feedback, completed states, and confirmation messages
* Use Warning colors for alerts that require attention but aren't critical
* Use Error colors for form validation errors, failed operations, and destructive action confirmations
* Never use red and green together without additional visual indicators (accessibility)
* Maintain WCAG AA contrast ratios: 4.5:1 for normal text, 3:1 for large text

### Data Visualization Colors
Use this specific sequence for charts and graphs:
1. `#200a58` 2. `#2d156d` 3. `#392082` 4. `#462b96` 5. `#5236ab`
6. `#6f3094` 7. `#822c84` 8. `#8c2a7d` 9. `#a92565` 10. `#b3235e`
11. `#c61f4e` 12. `#e31937` 13. `#e93248` 14. `#ee4b58` 15. `#f46569`
16. `#f15861` 17. `#f97e79` 18. `#ff978a` 19. `#feb194` 20. `#fecb9d` 21. `#fde5a7`

### Gradients
* **Gradient A Vertical**: `linear-gradient(90deg, #e31937 0%, #a82465 60%, #5236ab 100%)`
  * Use for hero sections, feature cards
* **Gradient A Horizontal**: `linear-gradient(180deg, #e31937 0%, #a82465 60%, #5236ab 100%)`
  * Use for vertical banners, sidebars
* **Gradient B Vertical**: `linear-gradient(90deg, #991f3d 0%, #e31937 33%, #ff6a00 66%, #ffcdd2 100%)`
  * Use for promotional content, special events

## Typography

### Font Family
* **Primary**: Source Sans Pro, sans-serif
* **Fallback**: system-ui, -apple-system, sans-serif

### Type Scale

**Headings:**
* **H1**: 38px - Page titles, hero headlines
* **H2**: 28px / 400 weight - Major section headers
* **H3**: 24px - Subsection headers
* **H4**: 20px / 400 weight - Card titles, smaller headers
* **H5**: 18px - Minor headers
* **H6**: 16px - Smallest headers

**Body Text:**
* **Body 2 Default**: 16px / 400 weight / 20px line-height - Standard body text, paragraphs
* **Body 2 Bold**: 16px / 700 weight / 20px line-height - Emphasized body text
* **Body 1 Default**: 14px / 400 weight / 20px line-height - Smaller body text, table content
* **Body 1 Bold**: 14px / 700 weight / 17px line-height - Emphasized smaller text

**Links:**
* **Link Body 2**: 16px / 400 weight / 20px line-height - Standard links
* **Link Body 2 Underline**: Add underline on hover
* **Link Body 2 Active**: 16px / 700 weight - Currently active/selected links
* **Link Body 1**: 14px / 400 weight / 17px line-height - Smaller links
* **Link Body 1 Active**: 14px / 700 weight

**Specialty Text:**
* **Intro**: 18px / 400 weight / 22px line-height - Lead paragraphs, introductory text
* **Caption**: 14px / 400 weight / 17px line-height - Image captions, metadata
* **Caption Bold**: 14px / 700 weight / 17px line-height
* **Label**: 14px / 16px line-height - Form labels, UI labels
* **Assistive Text**: 12px / 400 weight / 16px line-height - Helper text, hints, secondary info
* **Legal**: 14px / 400 weight / 16px line-height - Terms, disclaimers, fine print

### Typography Rules
* Use maximum 2-3 font sizes per component
* Maintain consistent line-height: body text 1.4-1.6, headings 1.2-1.3
* Paragraph max-width should be 75ch for readability
* Use bold weight (700) for emphasis, not uppercase or underline
* Links should be underlined on hover, not by default
* Active/selected links should use bold weight, not just color
* Never use font sizes smaller than 12px

## Components

### Buttons

#### Variants

**Primary Button:**
* **Font**: 16px / 24px line-height (Regular) or 12px / 14px line-height (Small)
* **Background**: CGI Purple `#5236ab` or CGI Red `#e31937`
* **Text Color**: White `#ffffff`
* **Shadow**: `0px 1px 5px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)`
* **Hover Shadow**: `0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)`
* **Usage**: Main call-to-action, form submissions, primary actions
* **Rule**: Maximum one primary button per section

**Secondary Button:**
* **Font**: Same as Primary
* **Background**: Transparent or White
* **Border**: 1-2px solid CGI Purple or CGI Gray
* **Text Color**: CGI Purple `#5236ab` or CGI Gray `#333333`
* **Shadow**: `0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)`
* **Usage**: Secondary actions, cancel actions, alternative options
* **Rule**: Can appear alongside primary button

**Button Sizes:**
* **Regular**: 16px font, 24px line-height, minimum 44px height, 16px horizontal padding
* **Small**: 12px font, 14px line-height, minimum 32px height, 12px horizontal padding

#### Button Rules
* Button labels should be action-oriented verbs (Submit, Cancel, Save, Delete)
* Maximum 2-3 words per button label
* Disabled buttons should use `rgba(21, 21, 21, 0.45)` color
* Destructive actions (Delete, Remove) should use CGI Red
* Loading state should show spinner and "Processing..." or similar text
* Minimum touch target: 44x44px on mobile, 32x32px on desktop

### Badges

**Badge Regular:**
* **Font**: 16px / 24px line-height
* **Padding**: 4px 8px
* **Border Radius**: 4px
* **Usage**: Status indicators, notification counts, labels

**Badge Small:**
* **Font**: 12px / 18px line-height
* **Padding**: 2px 6px
* **Border Radius**: 3px
* **Usage**: Inline labels, compact status indicators

**Badge Colors:**
* Info: Background `#dedaec` (Label Info), Text: CGI Purple 800
* Success: Background `#d6eee4` (Label Success), Text: Success 800
* Warning: Background `#f8ecd8` (Label Warning), Text: Warning 800
* Error: Background `#ecd2d7` (Label Error), Text: Error 800

### Forms

**Form Labels:**
* **Default State**: 16px / 400 weight - Positioned above input
* **Filled State**: 12px / 400 weight - Positioned above input content or floating
* **Color**: CGI Gray `#333333`
* **Required Indicator**: Red asterisk or "(Required)" text

**Form Inputs:**
* **Font**: 16px / 400 weight
* **Height**: Minimum 44px
* **Border**: 1px solid CGI Gray 200 `#a8a8a8`
* **Border Radius**: 4px
* **Padding**: 12px 16px
* **Focus State**: Border CGI Purple `#5236ab`, 2px width
* **Error State**: Border Error `#b00020`, 2px width
* **Disabled State**: Background CGI Gray 50 `#efefef`, text color disabled

**Assistive Text:**
* **Font**: 12px / 400 weight / 16px line-height
* **Color**: CGI Gray 400 `#5c5c5c`
* **Usage**: Helper text below inputs, character counts, validation hints
* **Error Text**: Use Error color `#b00020`

**Form Rules:**
* All inputs must have associated labels (visible or aria-label)
* Error messages should be specific and actionable
* Show validation on blur, not on every keystroke
* Group related fields with fieldset/legend
* Placeholder text should never replace labels
* Use 16px font size to prevent iOS zoom on focus

### Data Tables

**Table Typography:**
* **Headers**: Body 1 Bold (14px / 700 weight)
* **Cell Values**: Body 1 Default (14px / 400 weight / 17px line-height)
* **Caption/Description**: Assistive Text (12px)

**Table Styling:**
* **Border**: 1px solid CGI Gray 200 `#a8a8a8`
* **Header Background**: CGI Gray 50 `#efefef`
* **Row Hover**: CGI Purple 50 `#f2f1f9`
* **Zebra Striping**: Alternate rows with White 200 `#f9fafb`
* **Cell Padding**: 12px 16px

**Table Rules:**
* Always include sortable headers for large datasets
* Show loading state for async data
* Pagination for tables with 25+ rows
* Responsive: Stack or horizontal scroll on mobile
* Align numbers right, text left

### Lists

**List Typography:**
* **List Items**: Body 2 Default (16px)
* **Assistive Text**: 12px / 400 weight

**List Styling:**
* **Bullet/Number Color**: CGI Purple `#5236ab`
* **Line Height**: 1.5-1.6 for readability
* **Spacing**: 8px between items

### Modals

**Modal Container:**
* **Background**: White `#ffffff`
* **Shadow**: `0px 4px 4px rgba(0, 0, 0, 0.25)`
* **Border Radius**: 8px
* **Max Width**: 600px (small), 900px (large)
* **Padding**: 24px

**Modal Overlay:**
* **Background**: `rgba(0, 0, 25, 0.25)`
* **Backdrop Filter**: Optional blur

**Modal Rules:**
* Include close button (X) in top-right corner
* Trap focus within modal when open
* Close on ESC key or overlay click
* Disable body scroll when modal is open
* Modal header should use H3 or H4

### Alerts & Notifications

**Alert Container:**
* **Shadow**: `0px 0px 4px rgba(0, 0, 0, 0.25)`
* **Border Radius**: 4px
* **Padding**: 12px 16px
* **Border Left**: 4px solid (color based on type)

**Alert Types:**
* **Info**: Background Purple 50, Border Purple 600, Icon Purple 600
* **Success**: Background Success 50, Border Success 600, Icon Success 600
* **Warning**: Background Warning 50, Border Warning 600, Icon Warning 600
* **Error**: Background Error 50, Border Error 600, Icon Error 600

**Alert Rules:**
* Include icon matching alert type
* Allow dismissal with X button (optional)
* Auto-dismiss after 5-7 seconds for non-critical alerts
* Keep messages concise (1-2 sentences)

### Dropdowns & Menus

**Dropdown Container:**
* **Background**: White `#ffffff`
* **Shadow**: `0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)`
* **Border Radius**: 4px
* **Min Width**: Match trigger element

**Dropdown Items:**
* **Font**: Body 1 Default (14px)
* **Padding**: 8px 16px
* **Hover**: Background CGI Purple 50 `#f2f1f9`
* **Selected**: Background CGI Purple 100, Text Bold

**Dropdown Rules:**
* If 2 or fewer options, use radio buttons instead
* Position dropdown to stay within viewport
* Highlight matching characters during keyboard navigation
* Close on outside click or ESC key

### Upload Components

**Upload Box:**
* **Shadow**: `0px 1px 2px rgba(21, 21, 21, 0.25)`
* **Border**: 2px dashed CGI Gray 300 `#767676`
* **Border Radius**: 4px
* **Padding**: 24px
* **Hover**: Border CGI Purple, Background Purple 50

**Loading Bar:**
* **Shadow**: `-1px 1px 2px rgba(0, 0, 0, 0.13)`
* **Height**: 4px
* **Background**: CGI Gray 100
* **Progress Bar**: CGI Purple `#5236ab`

### Chart Cards

**Chart Container:**
* **Background**: White `#ffffff`
* **Shadow**: `0px 1px 4px rgba(0, 0, 0, 0.2)`
* **Border Radius**: 8px
* **Padding**: 16px 20px

**Chart Rules:**
* Use data visualization color sequence for consistency
* Include legend for multi-series charts
* Label axes clearly with units
* Show tooltips on hover with exact values
* Responsive: Adjust chart height/width on mobile

### Filters

**Filter Container:**
* **Shadow**: `0px 1px 2px rgba(21, 21, 21, 0.25)`
* **Background**: White or CGI Gray 50

**Filter Rules:**
* Show active filter count as badge
* Include "Clear All" option when filters are applied
* Group related filters together
* Use chips to display active filters

### Floating Action Bar

**FAB Container:**
* **Shadow**: `0px -2px 7px rgba(0, 0, 0, 0.25)`
* **Background**: White `#ffffff`
* **Position**: Fixed bottom of viewport
* **Height**: 64px

**FAB Rules:**
* Maximum 4 items in floating action bar
* Use for persistent, primary actions
* Never combine with standard FAB (floating action button)
* Ensure enough padding from screen edges (16px minimum)

## Spacing & Layout

### Spacing Scale
Use consistent spacing multiples of 4px:
* **4px** (0.25rem) - Minimal spacing, tight layouts
* **8px** (0.5rem) - Small spacing, form elements
* **12px** (0.75rem) - Default spacing between related elements
* **16px** (1rem) - Standard spacing, component padding
* **24px** (1.5rem) - Section spacing
* **32px** (2rem) - Large spacing between sections
* **48px** (3rem) - Extra large spacing
* **64px** (4rem) - Maximum spacing

### Grid System
* **Columns**: 12-column grid
* **Gutter**: 24px (desktop), 16px (mobile)
* **Container Max Width**: 1280px
* **Margins**: 24px (desktop), 16px (mobile)

## Interactions & Animations

### Transition Timing
* **Fast**: 150ms - Hover states, simple transitions
* **Normal**: 250ms - Most UI transitions
* **Slow**: 350ms - Complex animations, page transitions

### Easing Functions
* **Ease-out**: Use for enter animations
* **Ease-in**: Use for exit animations
* **Ease-in-out**: Use for emphasis animations

### Animation Rules
* Reduce motion for users with prefers-reduced-motion
* Avoid animations longer than 500ms
* Animate opacity and transform (not width/height)
* Provide visual feedback within 100ms of user action

## Accessibility

### WCAG Standards
* Maintain AA compliance minimum (AAA preferred)
* Color contrast ratios: 4.5:1 for normal text, 3:1 for large text (18px+)
* Focus indicators must be visible and have 3:1 contrast
* Touch targets minimum 44x44px

### Keyboard Navigation
* All interactive elements must be keyboard accessible
* Logical tab order (left-to-right, top-to-bottom)
* Skip navigation links for long pages
* Keyboard shortcuts should not conflict with browser/screen reader

### Screen Readers
* Use semantic HTML (nav, main, aside, article, section)
* Provide alt text for images
* Use aria-labels for icon-only buttons
* Announce dynamic content changes with aria-live

## Date & Time Formatting

* **Short Date**: "Jun 10" - For lists, compact views
* **Long Date**: "June 10, 2026" - For detailed views
* **Date with Year**: "Jun 10, 2026" - When year context needed
* **Time**: "2:30 PM" - 12-hour format with AM/PM
* **Date + Time**: "Jun 10, 2:30 PM" - Combined format
* **Relative Time**: "2 hours ago", "Yesterday" - For recent activity

## Error Handling

### Error Messages
* Be specific about what went wrong
* Provide actionable next steps
* Use friendly, human language
* Don't blame the user ("Invalid entry" not "You entered invalid data")

### Error States
* Show inline validation errors below relevant field
* Use Error color `#b00020` for text and borders
* Include error icon (warning/alert symbol)
* Preserve user input when showing errors
* Don't clear form on submission error

## Loading States

### Loading Indicators
* **Spinner**: For indeterminate operations
* **Progress Bar**: For determinate operations (show percentage)
* **Skeleton Screens**: For initial page loads

### Loading Rules
* Show loading state if operation takes >500ms
* Disable interactive elements during loading
* Provide cancel option for long operations
* Update user every 5-10 seconds on progress

## Empty States

* Include illustration or icon
* Explain why content is missing
* Provide call-to-action to resolve (if applicable)
* Use encouraging, helpful language
* Examples: "No results found. Try different filters" or "Start by creating your first project"