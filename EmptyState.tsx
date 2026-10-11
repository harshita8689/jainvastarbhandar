import React from 'react';
import { PackageX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  actionText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Unstitched Suits Found',
  description = 'We could not find any suit fabrics matching your selected criteria. Try adjusting your search or filters.',
  onReset,
  actionText = 'Reset All Filters',
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-jvb-pink-200 max-w-lg mx-auto shadow-sm my-8">
      <div className="w-16 h-16 rounded-full bg-jvb-pink-50 text-jvb-pink-600 flex items-center justify-center mx-auto mb-4">
        <PackageX className="w-8 h-8" />
      </div>
      <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-6">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-jvb-pink-600 hover:bg-jvb-pink-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
