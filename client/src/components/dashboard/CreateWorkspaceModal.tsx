import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { SearchInput } from '../common/SearchInput';
import { InfiniteScroll } from '../common/InfiniteScroll';
import { AlertCircleIcon, CloseIcon, PlusIcon, CheckIcon, CopyIcon } from '../common/Icons';

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
      onSelectorSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
      <div className="bg-[#0d1219] border border-[#222b38] rounded-xl w-full max-w-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-300 transform scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="border-b border-[#222b38] px-6 py-4 flex items-center justify-between">
          <h2 className="text-md font-semibold text-white flex items-center gap-2">
            <PlusIcon size={18} className="text-[#1ec8b5]" />
            {t('dashboard.create_modal_title')}
          </h2>
          <button onClick={onClose} className="text-[#5e6a7a] hover:text-white transition-colors cursor-pointer">
            <CloseIcon size={18} />
          </button>
        </div>

        {createdWorkspace ? (
          /* Success View */
          <div className="p-6 flex flex-col gap-6 items-center text-center overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-[#1ec8b5]/10 border border-[#1ec8b5]/30 flex items-center justify-center text-[#1ec8b5] animate-[scaleIn_0.3s_cubic-bezier(.16,.8,.3,1)]">
              <CheckIcon size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{t('dashboard.create_success')}</h3>
              <p className="text-xs text-[#5e6a7a] mt-1">{t('dashboard.no_workspaces_desc')}</p>
            </div>

            <div className="w-full bg-[#0a0e14] border border-[#222b38] rounded-lg p-3 flex items-center justify-between gap-4 font-mono text-xs text-[#9aa5b3] text-left">
              <span className="truncate select-all">{`${window.location.origin}/workspace/join?code=${createdWorkspace.inviteCode}`}</span>
              <button
                onClick={() => handleCopyLink(createdWorkspace.inviteCode)}
                className="flex-shrink-0 text-xs px-2.5 py-1.5 rounded bg-[#131a24] hover:bg-[#1ec8b5] text-[#1ec8b5] hover:text-[#0a0e14] transition-all font-semibold border border-[#1ec8b5]/20 hover:border-transparent flex items-center gap-1.5 cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <CheckIcon size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-3 w-full border-t border-[#222b38]/50 pt-4 mt-2">
              <Button variant="outline" className="flex-1 text-xs" onClick={onClose}>
                {t('dashboard.btn_close_search')}
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-xs bg-[#1ec8b5] hover:bg-[#1ec8b5]/90 text-[#0a0e14] border-none"
                onClick={() => {
                  onClose();
                  window.location.href = `/workspace/${createdWorkspace.id}`;
                }}
              >
                {t('dashboard.btn_go_to_workspace')}
              </Button>
            </div>
          </div>
        ) : (
          /* Create Form View */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              {createError && (
                <div className="bg-[#e0596b]/10 border border-[#e0596b]/20 text-[#e0596b] text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircleIcon size={16} className="flex-shrink-0" />
                  {createError}
                </div>
              )}

              <Input
                label={t('dashboard.create_modal_name_label')}
                placeholder={t('dashboard.create_modal_name_placeholder')}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Input
                    label={t('dashboard.create_modal_problem_label')}
                    placeholder={t('dashboard.create_modal_problem_placeholder')}
                    value={problemUrl}
                    onChange={handleUrlChange}
                  />
                </div>
                <div>
                  <div className="auth-form-field">
                    <label className="input-label">Platform</label>
                    <select
                      value={problemPlatform}
                      onChange={(e) => setProblemPlatform(e.target.value)}
                      className="w-full bg-[#0d131a] border border-[#222b38] hover:border-[#1ec8b5]/50 focus:border-[#1ec8b5] text-xs rounded-lg px-3 py-2.8 text-[#e1e6eb] placeholder-[#5e6a7a] transition-all outline-none"
                    >
                      <option value="LeetCode">LeetCode</option>
                      <option value="Codeforces">Codeforces</option>
                      <option value="HackerRank">HackerRank</option>
                      <option value="Custom">Custom / Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Friends Selection List with search and infinite scroll */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="input-label">{t('dashboard.create_modal_friends_label')}</label>
                <SearchInput
                  placeholder={t('dashboard.create_modal_friends_search_placeholder')}
                  onSearch={onSelectorSearch}
                  debounceMs={200}
                  className="mb-1"
                />
                
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

            {/* Footer */}
            <div className="border-t border-[#222b38] px-6 py-4 bg-[#131a24]/30 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isCreating}>
                {t('dashboard.cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isCreating}
                className="bg-[#1ec8b5] hover:bg-[#1ec8b5]/90 text-[#0a0e14] border-none shadow-[0_4px_12px_rgba(30,200,181,0.2)]"
              >
                {isCreating ? t('dashboard.creating') : t('dashboard.create')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
