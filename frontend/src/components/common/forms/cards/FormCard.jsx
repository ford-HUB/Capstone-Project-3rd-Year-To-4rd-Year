import React, { useState } from 'react';
import { 
  MoreVertical, 
  Edit, 
  Eye, 
  Copy, 
  Download, 
  Trash2, 
  FileText, 
  Users, 
  Calendar, 
  BarChart3,
  Archive,
  ArchiveRestore,
  Star,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Dropdown from '../ui/Dropdown';
import DropdownItem from '../ui/DropdownItem';

const FormCard = ({ 
  form, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onViewResponses, 
  onDownload,
  onArchive 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      feedback: 'bg-blue-100 text-blue-800',
      hr: 'bg-purple-100 text-purple-800',
      events: 'bg-green-100 text-green-800',
      sales: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
              {form.is_default_evaluation && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  Default
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">{form.description}</p>
            
            {form.is_default_evaluation && (
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
                <AlertCircle className="w-3 h-3" />
                <span>No custom form configured - showing default evaluation</span>
              </div>
            )}
          </div>
          <Dropdown
            trigger={<MoreVertical size={20} className="text-gray-400" />}
            isOpen={dropdownOpen}
            onToggle={() => setDropdownOpen(!dropdownOpen)}
          >
            {!form.is_default_evaluation && (
              <DropdownItem icon={Edit} onClick={() => { onEdit(form); setDropdownOpen(false); }}>
                Edit Form
              </DropdownItem>
            )}
            <DropdownItem icon={Eye} onClick={() => { onViewResponses(form); setDropdownOpen(false); }}>
              View {form.is_default_evaluation ? 'Evaluations' : 'Responses'}
            </DropdownItem>
            {!form.is_default_evaluation && (
              <>
                <DropdownItem 
                  icon={form.is_active ? Archive : ArchiveRestore} 
                  onClick={() => { onArchive(form); setDropdownOpen(false); }}
                >
                  {form.is_active ? 'Archive' : 'Unarchive'}
                </DropdownItem>
                <DropdownItem icon={Copy} onClick={() => { onDuplicate(form); setDropdownOpen(false); }}>
                  Duplicate
                </DropdownItem>
                <DropdownItem icon={Download} onClick={() => { onDownload(form); setDropdownOpen(false); }}>
                  Download JSON
                </DropdownItem>
                <DropdownItem icon={Trash2} onClick={() => { onDelete(form); setDropdownOpen(false); }} variant="danger">
                  Delete
                </DropdownItem>
              </>
            )}
          </Dropdown>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={form.is_active ? 'published' : 'archived'}>
            {form.is_active ? 'Published' : 'Archived'}
          </Badge>
          <Badge className={getCategoryColor(form.Category?.name?.toLowerCase() || 'default')}>
            {form.Category?.name || 'Uncategorized'}
          </Badge>
        </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <FileText size={16} className="mr-1" />
                {form.is_default_evaluation ? 'Default Form' : `${form.form_schema?.fields?.length || 0} fields`}
              </div>
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                {form.is_default_evaluation ? `${form.evaluation_count || 0} evaluations` : '0 responses'}
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {form.is_default_evaluation ? 'Always Available' : formatDate(form.updatedAt)}
              </div>
            </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!form.is_default_evaluation && (
            <Button size="sm" onClick={() => onEdit(form)}>
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onViewResponses(form)}>
            <BarChart3 size={16} className="mr-2" />
            {form.is_default_evaluation ? 'Evaluations' : 'Responses'}
          </Button>
          {!form.is_default_evaluation && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onArchive(form)}
              className={form.is_active ? "text-orange-600 border-orange-300 hover:bg-orange-50" : "text-green-600 border-green-300 hover:bg-green-50"}
            >
              {form.is_active ? (
                <>
                  <Archive size={16} className="mr-2" />
                  Archive
                </>
              ) : (
                <>
                  <ArchiveRestore size={16} className="mr-2" />
                  Unarchive
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormCard;
