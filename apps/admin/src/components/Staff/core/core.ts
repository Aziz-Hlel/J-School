import capitalize from '@/utils/capitalize';

export const MODULE_NAME = 'staff';

export const MODULE_NAME_PLURAL = 'staff';

export const ModuleName = {
  singular: MODULE_NAME,
  plural: MODULE_NAME_PLURAL,
} as const;

export const TableData = {
  MODULE_NAME,
  ModuleName: capitalize(ModuleName.singular),

  ModuleNamePlural: capitalize(ModuleName.plural),

  href: '/staff',

  MainCard: {
    title: capitalize(ModuleName.plural),
    description: `Manage your ${capitalize(ModuleName.plural)} and their details here.`,
    addButton: {
      label: `Add New ${capitalize(ModuleName.singular)}`,
    },
  },

  AddDialog: {
    title: `Add New ${capitalize(ModuleName.singular)}`,
    description: `Fill the form below to create a new ${capitalize(ModuleName.singular)}.`,
    buttons: {
      submit: `Add ${capitalize(ModuleName.singular)}`,
      cancel: 'Cancel',
    },
  },

  EditDialog: {
    title: `Edit ${capitalize(ModuleName.singular)}`,
    description: `Fill the form below to edit the ${capitalize(ModuleName.singular)}.`,
    buttons: {
      submit: `Save changes`,
      cancel: 'Cancel',
    },
  },

  DeleteDialog: {
    title: `Delete ${capitalize(ModuleName.singular)}`,
    description: `Are you sure you want to delete this ${capitalize(ModuleName.singular)}?`,
    buttons: {
      submit: `Delete ${capitalize(ModuleName.singular)}`,
      cancel: 'Cancel',
    },
  },
};
