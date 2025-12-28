# Data Model: UI Theme - Dark with Gold Accents

## Theme Configuration Entity

**Entity Name**: ThemeConfiguration
**Description**: The core configuration that defines the dark theme with gold accents
**Fields**:
- `id`: Unique identifier for the theme configuration
- `name`: Theme name (e.g., "Dark Gold Theme")
- `colors`: Object containing all color definitions
  - `backgroundPrimary`: #0F111A
  - `backgroundSurface`: #151826
  - `textPrimary`: #E0DACC
  - `textMuted`: #9CA3AF
  - `accentPrimary`: #FFD700
  - `accentHover`: #FFC107
  - `borderColor`: rgba(255, 215, 0, 0.15)
- `typography`: Object containing font definitions
  - `headings`: 'Inter', 'Poppins', sans-serif
  - `body`: 'Inter', system-ui, sans-serif
  - `code`: 'JetBrains Mono', 'Fira Code', monospace
- `spacing`: Object containing spacing definitions
  - `xs`: 0.25rem
  - `sm`: 0.5rem
  - `md`: 1rem
  - `lg`: 1.5rem
  - `xl`: 2rem
- `borderRadius`: Object containing border radius definitions
  - `sm`: 4px
  - `md`: 8px
  - `lg`: 12px
- `shadows`: Object containing shadow definitions
  - `sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  - `md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
  - `lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## UI Component Entity

**Entity Name**: UIComponent
**Description**: Represents a themed UI component that implements the dark theme
**Fields**:
- `id`: Unique identifier for the component
- `name`: Component name (e.g., "Navbar", "ChatBubble", "CodeBlock")
- `type`: Component type (e.g., "layout", "interactive", "content")
- `themeConfigurationId`: Reference to the ThemeConfiguration
- `styles`: Object containing component-specific styles
- `validationRules`: Set of rules to ensure accessibility compliance
- `stateTransitions`: Definition of how the component changes with different states
- `createdAt`: Timestamp of creation

## Layout Component Entity

**Entity Name**: LayoutComponent
**Description**: Structural UI elements that implement the theme
**Fields**:
- `id`: Unique identifier for the layout component
- `name`: Component name (e.g., "Navbar", "Sidebar", "Footer")
- `themeConfigurationId`: Reference to the ThemeConfiguration
- `backgroundColor`: Background color from theme
- `textColor`: Text color from theme
- `accentColor`: Accent color from theme
- `spacing`: Spacing configuration from theme
- `responsiveBehavior`: How the component adapts to different screen sizes
- `validationRules`: Accessibility compliance rules
- `createdAt`: Timestamp of creation

## Chat Interface Entity

**Entity Name**: ChatInterface
**Description**: The chatbot interface that implements the theme
**Fields**:
- `id`: Unique identifier for the chat interface
- `themeConfigurationId`: Reference to the ThemeConfiguration
- `userBubbleColor`: Dark bubble color for user messages
- `botBubbleColor`: Gold-highlighted bubble color for bot responses
- `borderRadius`: Rounded corner configuration
- `shadow`: Subtle shadow configuration
- `typography`: Typography settings from theme
- `animation`: Open/close animation properties
- `responsiveBehavior`: Mobile/desktop behavior
- `validationRules`: Accessibility compliance rules
- `createdAt`: Timestamp of creation

## Validation Rules Entity

**Entity Name**: ValidationRules
**Description**: Set of rules to ensure theme compliance and accessibility
**Fields**:
- `id`: Unique identifier for the validation rules set
- `contrastRatioMin`: Minimum contrast ratio (4.5:1 for normal text)
- `fontSizeMin`: Minimum font size for readability
- `touchTargetMin`: Minimum touch target size (44px)
- `focusIndicator`: Whether focus indicators are required
- `ariaLabelsRequired`: Whether ARIA labels are required
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## State Transitions Entity

**Entity Name**: StateTransitions
**Description**: Defines how components change appearance based on state
**Fields**:
- `id`: Unique identifier for the state transition
- `componentId`: Reference to the UIComponent
- `normalState`: Styles for normal state
- `hoverState`: Styles for hover state
- `focusState`: Styles for focus state
- `activeState`: Styles for active state
- `disabledState`: Styles for disabled state
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update