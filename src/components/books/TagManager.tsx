import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export type Tag = {
  id: string;
  name: string;
  color: string;
};

const TAG_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
];

type Props = {
  tags: Tag[];
  onAddTag: (name: string, color: string) => void;
  onDeleteTag: (tagId: string) => void;
};

export default function TagManager({ tags, onAddTag, onDeleteTag }: Props) {
  const [showTagForm, setShowTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    onAddTag(newTagName, newTagColor);
    setNewTagName('');
    setShowTagForm(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-700">タグ</h2>
        <button
          onClick={() => setShowTagForm(!showTagForm)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          <Plus size={12} />
          タグを追加
        </button>
      </div>

      {showTagForm && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タグ名"
          />
          <div className="flex gap-1">
            {TAG_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setNewTagColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${newTagColor === color ? 'border-gray-800' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleAddTag}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700"
          >
            追加
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs"
            style={{ backgroundColor: tag.color }}
          >
            <span>{tag.name}</span>
            <button
              onClick={() => onDeleteTag(tag.id)}
              className="hover:opacity-70"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
