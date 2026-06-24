import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { InfiniteScroll } from '../common/InfiniteScroll';
import { AlertCircleIcon, CloseIcon, PlusIcon, CheckIcon, CopyIcon, LinkIcon } from '../common/Icons';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, problemUrl: string, problemPlatform: string, friendIds: string[]) => Promise<any>;
  isCreating: boolean;
  createError: string | null;
  selectorFriends: any[];
  selectorLoading: boolean;
  selectorHasMore: boolean;
  onSelectorSearch: (query: string) => void;
  onLoadMoreSelector: () => void;
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
  createError,
  selectorFriends,
  selectorLoading,
  selectorHasMore,
  onSelectorSearch,
  onLoadMoreSelector
}) => {
  const { t } = useTranslation();

  const [workspaceName, setWorkspaceName] = useState('');
  const [problemUrl, setProblemUrl] = useState('');
  const [problemPlatform, setProblemPlatform] = useState('LeetCode');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [createdWorkspace, setCreatedWorkspace] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto detect platform based on URL
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProblemUrl(url);
    if (url.toLowerCase().includes('leetcode.com')) {
      setProblemPlatform('LeetCode');
    } else if (url.toLowerCase().includes('codeforces.com')) {
      setProblemPlatform('Codeforces');
    } else if (url.toLowerCase().includes('hackerrank.com')) {
      setProblemPlatform('HackerRank');
    }
  };

  const handleCopyLink = async (code: string) => {
    try {
      const inviteLink = `${window.location.origin}/workspace/join?code=${code}`;
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Ignored
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaceName.trim()) {
      const result = await onCreate(
        workspaceName.trim(),
        problemUrl.trim(),
        problemPlatform,
        selectedFriends
      );
      if (result && result.id) {
        setCreatedWorkspace(result);
      }
    }
  };

  // Reset local state on open/close
  useEffect(() => {
    if (isOpen) {
      setWorkspaceName('');
      setProblemUrl('');
      setProblemPlatform('LeetCode');
      setSelectedFriends([]);
      setCreatedWorkspace(null);
      setIsCopied(false);
      setSearchQuery('');
      onSelectorSearch('');
    }
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSelectorSearch(val);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-head">
          <h2>
            <PlusIcon size={17} />
            {t('dashboard.create_modal_title')}
          </h2>
          <button onClick={onClose} className="modal-close">
            <CloseIcon size={17} />
          </button>
        </div>

        {createdWorkspace ? (
          /* Success View */
          <div className="success-block">
            <div className="success-icon">
              <CheckIcon size={26} />
            </div>
            <div>
              <h3>{t('dashboard.create_success')}</h3>
              <p>{t('dashboard.no_workspaces_desc')}</p>
            </div>

            <div className="link-box">
              <span>{`${window.location.origin}/workspace/join?code=${createdWorkspace.inviteCode}`}</span>
              <button
                onClick={() => handleCopyLink(createdWorkspace.inviteCode)}
                className="link-copy-btn"
              >
                {isCopied ? (
                  <>
                    <CheckIcon size={12} />
                    {t('dashboard.copied', { defaultValue: 'Copied' })}
                  </>
                ) : (
                  <>
                    <CopyIcon size={12} />
                    {t('dashboard.copy', { defaultValue: 'Copy' })}
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-3 w-full border-t border-[#222b38]/50 pt-4 mt-2">
              <button className="btn btn-outline btn-sm flex-1 justify-center" onClick={onClose}>
                {t('dashboard.btn_close_search')}
              </button>
              <button
                className="btn btn-primary btn-sm flex-1 justify-center"
                onClick={() => {
                  onClose();
                  window.location.href = `/workspace/${createdWorkspace.id}`;
                }}
              >
                {t('dashboard.btn_go_to_workspace')}
              </button>
            </div>
          </div>
        ) : (
          /* Create Form View */
          <form onSubmit={handleSubmit}>
            <div className="modal-body max-h-[60vh] overflow-y-auto">
              {createError && (
                <div className="bg-[#e0596b]/10 border border-[#e0596b]/20 text-[#e0596b] text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircleIcon size={16} className="flex-shrink-0" />
                  {createError}
                </div>
              )}

              <div>
                <label className="field-label">{t('dashboard.create_modal_name_label')}</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder={t('dashboard.create_modal_name_placeholder')}
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  required
                  disabled={isCreating}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="field-label">{t('dashboard.create_modal_problem_label')}</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder={t('dashboard.create_modal_problem_placeholder')}
                    value={problemUrl}
                    onChange={handleUrlChange}
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <label className="field-label">Platform</label>
                  <select
                    value={problemPlatform}
                    onChange={(e) => setProblemPlatform(e.target.value)}
                    className="field-input"
                    disabled={isCreating}
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Custom">Custom / Other</option>
                  </select>
                </div>
              </div>

              {/* Friends Selection List with search and infinite scroll */}
              <div className="flex flex-col gap-2">
                <label className="field-label">{t('dashboard.create_modal_friends_label')}</label>
                <div className="search-field">
                  <input
                    type="text"
                    placeholder={t('dashboard.create_modal_friends_search_placeholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    disabled={isCreating}
                  />
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>

                <div className="border border-[#222b38] bg-[#0a0e14] rounded-lg p-2 max-h-40 overflow-y-auto">
                  <InfiniteScroll
                    loadMore={onLoadMoreSelector}
                    hasMore={selectorHasMore}
                    isLoading={selectorLoading}
                  >
                    {selectorFriends.length === 0 ? (
                      <p className="text-[11px] text-[#5e6a7a] text-center py-4 italic">
                        {t('dashboard.create_modal_no_friends')}
                      </p>
                    ) : (
                      selectorFriends.map((f) => {
                        const isChecked = selectedFriends.includes(f.id);
                        return (
                          <label key={f.id} className="flex items-center gap-3 p-1.5 rounded hover:bg-[#131a24]/50 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedFriends(selectedFriends.filter((id) => id !== f.id));
                                } else {
                                  setSelectedFriends([...selectedFriends, f.id]);
                                }
                              }}
                              className="rounded bg-[#0d1219] border-[#222b38] text-[#1ec8b5] focus:ring-[#1ec8b5]/30 focus:ring-1 cursor-pointer"
                              disabled={isCreating}
                            />
                            {f.avatar ? (
                              <img src={f.avatar} alt={f.name} className="w-5.5 h-5.5 rounded-full object-cover" />
                            ) : (
                              <div className="w-5.5 h-5.5 rounded-full bg-[#131a24] flex items-center justify-center font-mono text-[8px] text-[#1ec8b5] font-semibold">
                                {f.name.substring(0, 1).toUpperCase()}
                              </div>
                            )}
                            <span className="text-xs text-[#9aa5b3]">{f.name}</span>
                          </label>
                        );
                      })
                    )}
                  </InfiniteScroll>
                </div>
                {selectedFriends.length > 0 && (
                  <p className="text-[10px] text-[#1ec8b5] font-mono">
                    {selectedFriends.length} friend(s) selected
                  </p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onClose}
                disabled={isCreating}
              >
                {t('dashboard.cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isCreating}
              >
                {isCreating ? t('dashboard.creating') : t('dashboard.create')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

