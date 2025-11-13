import { FileItem } from "./FileItem";

export const FileList = ({ files, onRemove }) => {
    if (files.length === 0) return null;
  
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          Your Files ({files.filter(f => !f.error).length} ready to upload)
        </h3>
        <div className="space-y-3">
          {files.map((file) => (
            <FileItem key={file.id} file={file} onRemove={onRemove} />
          ))}
        </div>
      </div>
    );
};