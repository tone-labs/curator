# @curatordev/mantine

React admin UI components for [Mantine v8](https://mantine.dev) and [Refine.js](https://refine.dev).

## Installation

```bash
pnpm add @curatordev/mantine @mantine/core @mantine/dates @mantine/hooks @mantine/modals @refinedev/core dayjs react-hook-form
```

## Features

- **Layout**: Page layouts (Create, Edit, List, Show views with breadcrumbs and actions)
- **Fields**: Display components (Text, Number, Boolean, Date, Email, URL, Image, File, Markdown, Reference, Tag, Array, Computed)
- **Inputs**: Form inputs (Text, Number, Boolean, Date, DateTime, Select, MultiSelect, Autocomplete, File, Image, ManyToMany editor)
- **Buttons**: Action buttons (Create, Edit, Delete, Show, List, Save, Refresh)
- **Filters**: Query filters (Text, Numeric, Boolean, Select, List, DateRange)
- **Actions**: Perform operations on multiple selected records with "select all" support
- **Forms**: Pre-built form layouts (EditForm)
- **Overlays**: Modal dialogs (Create, Edit overlays)
- **Context**: Data management (ManyToMany relationships)

## Quick Start

```tsx
import { Edit, EditForm, TextFieldInput, BooleanFieldInput } from '@curatordev/mantine';

function UserEdit({ id }: { id: string }) {
  return (
    <Edit resource="users" id={id}>
      {(user, { resource, id }) => (
        <EditForm data={user} resource={resource} id={id}>
          <TextFieldInput source="first_name" label="First Name" />
          <TextFieldInput source="last_name" label="Last Name" />
          <BooleanFieldInput source="is_active" label="Active" />
        </EditForm>
      )}
    </Edit>
  );
}
```


## Component Categories

### Layout
Page layout components:
- `Create` - Create page with breadcrumbs and back button
- `Edit` - Edit page with breadcrumbs and action buttons
- `List` - List page with breadcrumbs and create button
- `Show` - Show/detail page with breadcrumbs and action buttons

### Fields
Read-only display components for showing data:
- `TextField` - Display text values
- `NumberField` - Display numbers with formatting
- `BooleanField` - Display boolean as checkmark/x
- `DateField` - Display dates with formatting
- `EmailField` - Display email as mailto link
- `UrlField` - Display URL as link
- `ImageField` - Display image with lightbox
- `FileField` - Display file with download link
- `MarkdownField` - Render markdown content
- `ReferenceField` - Display related record
- `TagField` - Display value as tag/badge
- `ArrayField` - Display array items
- `ComputedField` - Display computed value
- `LabeledField` - Wrapper for label + field

### Inputs
Form input components that work with react-hook-form:
- `TextFieldInput` - Text/textarea input
- `NumberFieldInput` - Number input
- `BooleanFieldInput` - Checkbox/switch input
- `DateFieldInput` - Date picker
- `DateTimeFieldInput` - Date + time picker
- `SelectFieldInput` - Single select dropdown
- `MultiSelectFieldInput` - Multi-select dropdown
- `AutocompleteFieldInput` - Autocomplete with search
- `FileFieldInput` - File upload
- `ImageFieldInput` - Image upload with preview
- `ManyToManyTableEditor` - Edit many-to-many relationships in a table

### Buttons
Action buttons that integrate with Refine.js resource actions:
- `CreateButton` - Navigate to create page
- `EditButton` - Navigate to edit page
- `ShowButton` - Navigate to show/detail page
- `DeleteButton` - Delete a record with confirmation
- `ListButton` - Navigate back to list page
- `SaveButton` - Submit form
- `RefreshButton` - Refresh current data

### Filters
Query filter components for list pages:
- `TextFilter` - Text search filter
- `NumericFilter` - Number range filter
- `BooleanFilter` - Boolean toggle filter
- `SelectFilter` - Single/multi select filter
- `ListFilter` - Filter by IDs
- `DateRangeFilter` - Date range filter with presets

### Actions
Perform operations on multiple selected records:
- `BulkActions` - UI component for bulk operations with dropdown and "select all" functionality
- `useRecordSelection` - Hook to manage record selection state

### Forms
Pre-built form layouts:
- `EditForm` - Standard edit/create form layout with save button

### Overlays
Modal dialog components:
- `CreateOverlay` - Create form in a modal
- `EditOverlay` - Edit form in a modal

### Context
Data management:
- `ManyToManyProvider` - Provider for many-to-many relationship data
- `useManyToMany` - Hook to access many-to-many context

## Backend Integration

Curator components are designed to work with REST APIs that implement structured pagination, sorting, and filtering. For Go backends, check out [dewey](https://github.com/tone-labs/dewey), which provides utilities for building these capabilities into your API endpoints.

## License

MIT - see [LICENSE](../../LICENSE) for details.
