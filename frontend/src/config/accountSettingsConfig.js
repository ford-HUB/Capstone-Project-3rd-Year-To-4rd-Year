import { useAuthStore as useDirectorAuthStore } from "../store/director/useAuthStore.js";
import { useProfileStore as useDirectorProfileStore } from "../store/director/useProfileStore.js";
import { updateEmailSchema as updateDirectorEmailSchema, updatePasswordSchema as updateDirectorPasswordSchema } from '../forms/DirectorSchema.js';

import { useAuthStore as useManagementAuthStore } from "../store/management/useAuthStore.js";
import { useProfileStore as useManagementProfileStore } from "../store/management/useProfileStore.js";
import { updateEmailSchema as updateManagementEmailSchema, updatePasswordSchema as updateManagementPasswordSchema } from "../forms/managementSchema.js";

export const accountSettingsConfig = {
    director: {
        useAuthStore: useDirectorAuthStore,
        useProfileStore: useDirectorProfileStore,
        emailSchema: updateDirectorEmailSchema,
        passwordSchema: updateDirectorPasswordSchema
    },

    staff: {
        useAuthStore: useManagementAuthStore,
        useProfileStore: useManagementProfileStore,
        emailSchema: updateManagementEmailSchema,
        passwordSchema: updateManagementPasswordSchema
    },

    coordinator: {
        useAuthStore: useManagementAuthStore,
        useProfileStore: useManagementProfileStore,
        emailSchema: updateManagementEmailSchema,
        passwordSchema: updateManagementPasswordSchema
    },

    assistant_coordinator: {
        useAuthStore: useManagementAuthStore,
        useProfileStore: useManagementProfileStore,
        emailSchema: updateManagementEmailSchema,
        passwordSchema: updateManagementPasswordSchema
    }
}