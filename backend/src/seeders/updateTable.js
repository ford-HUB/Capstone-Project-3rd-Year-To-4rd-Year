import { updateSchemaChanges } from "../config/db.js";

const attempt = async () => {
    await updateSchemaChanges()
}

attempt()