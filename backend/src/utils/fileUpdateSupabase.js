import supabase from "../config/supabase.js";

export const updateFileInSupabase = async (filePath, documentContent, contentType = 'application/octet-stream') => {
    try {
        const { data, error } = await supabase.storage
            .from('documents')
            .upload(filePath, documentContent, {
                upsert: true,
                cacheControl: '3600',
                contentType: contentType || 'application/octet-stream'
            });

        if (error) {
            console.error('Supabase upload error:', error.message);
            return null;
        }

        if (!data) {
            console.error('Supabase upload returned no data');
            return null;
        }

        return data;
    } catch (error) {
        console.error("File update failed:", error.message);
        return null;
    }
}


export const testPolicies = async () => {
    try {
        // Test if we can list files (SELECT policy)
        const { data: files, error: listError } = await supabase.storage
            .from('documents')
            .list();
        
        if (listError) {
            console.log('SELECT policy error:', listError);
        } else {
            console.log('SELECT policy works - files:', files.length);
        }

        // Test upload with a small file
        const testContent = Buffer.from('test file content');
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload('test-file.txt', testContent);
        
        if (uploadError) {
            console.log('INSERT policy error:', uploadError);
        } else {
            console.log('INSERT policy works');
        }

    } catch (error) {
        console.log('Policy test error:', error);
    }
};