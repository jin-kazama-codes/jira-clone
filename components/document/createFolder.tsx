"use Client"

import React, { useState } from 'react';

interface CreateFolderButtonProps {
  onFolderCreated?: () => void;
  selectedFolderId?: string | null;
}
const CreateFolderButton: React.FC<CreateFolderButtonProps> = ({ onFolderCreated, selectedFolderId = null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [chosenFolderId, setChosenFolderId] = useState<string | null>(selectedFolderId);

  const handleCreateFolder = async () => {
    // Validation
    if (!folderName.trim()) {
      setError('Folder name cannot be empty');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Simulated API call to create folder
      const response = await fetch('/api/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName.trim(), // Use the folder name from input
          type: 'folder',          // Hardcoded to 'folder' for folder creation
          parentId: chosenFolderId || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      if (onFolderCreated) {
        onFolderCreated();
      }

      // Reset state and close modal
      setFolderName('');
      setIsModalOpen(false);
      setChosenFolderId(selectedFolderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-button text-white px-4 py-2 rounded hover:bg-buttonHover"
      >
        + Create Folder
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className=" m-6  bg-header  rounded-lg shadow-xl w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <div className=' p-6 rounded-t-lg '>
              <h2 className="text-xl text-white font-bold mb-4">Create New Folder</h2>
            </div>

            <div className='bg-white p-6 rounded-lg'>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="w-full px-3 py-2  border rounded mb-2 placeholder:text-gray-600"
                disabled={isCreating}
              />

              {error && (
                <p className="text-red-500 text-sm pb-2">{error}</p>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="px-4 py-2 bg-button text-white rounded hover:bg-buttonHover"
                  disabled={isCreating || !folderName.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFolderButton;