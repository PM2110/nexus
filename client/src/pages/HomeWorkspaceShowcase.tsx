import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

type TabType = 'shared' | 'personal' | 'notes' | 'final';

export const HomeWorkspaceShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('shared');

  return (
    <section className="py-24" id="workspaces">
      <div className="section-container">
        
        <div className="section-header rise-in">
          <div className="eyebrow-gold">
            {t('showcase.eyebrow')}
          </div>
          <h2 className="section-title">
            {t('showcase.title')}
          </h2>
          <p className="section-subtitle">
            {t('showcase.sub')}
          </p>
        </div>

        {/* Tab triggers */}
        <div className="tab-container">
          <button
            type="button"
            onClick={() => setActiveTab('shared')}
            className={`tab-button ${activeTab === 'shared' ? 'tab-button-active' : 'tab-button-inactive'}`}
          >
            {t('showcase.tab_shared')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`tab-button ${activeTab === 'personal' ? 'tab-button-active' : 'tab-button-inactive'}`}
          >
            {t('showcase.tab_personal')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`tab-button ${activeTab === 'notes' ? 'tab-button-active' : 'tab-button-inactive'}`}
          >
            {t('showcase.tab_notes')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('final')}
            className={`tab-button ${activeTab === 'final' ? 'tab-button-active' : 'tab-button-inactive'}`}
          >
            {t('showcase.tab_final')}
          </button>
        </div>

        {/* Tab Panels */}
        <div className="max-w-[980px] mx-auto relative z-10 rise-in">
          {activeTab === 'shared' && (
            <div className="panel-grid animate-[riseIn_0.5s_cubic-bezier(.16,.8,.3,1)]">
              <div className="text-left">
                <div className="eyebrow-teal">{t('showcase.tab_shared')}</div>
                <h3 className="panel-title">{t('showcase.shared_title')}</h3>
                <p className="panel-desc">{t('showcase.shared_desc')}</p>
              </div>
              <div className="panel-code-box">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                </div>
                <span className="text-[#5e6a7a] italic">// public-sheet.ts — visible to everyone connected (4 users)</span><br />
                <span className="text-[#cba135]">const</span> solve <span className="text-[#5e6a7a]">=</span> (nums: number[], target: number) <span className="text-[#cba135]">=&gt;</span> &#123;<br />
                &nbsp;&nbsp;<span className="text-[#5e6a7a] italic">// Everyone can see, type, and execute this code in real time</span><br />
                &#125;;
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="panel-grid animate-[riseIn_0.5s_cubic-bezier(.16,.8,.3,1)]">
              <div className="text-left">
                <div className="eyebrow-teal">{t('showcase.tab_personal')}</div>
                <h3 className="panel-title">{t('showcase.personal_title')}</h3>
                <p className="panel-desc">{t('showcase.personal_desc')}</p>
              </div>
              <div className="panel-code-box">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                </div>
                <span className="text-[#5e6a7a] italic">// restricted-draft-sheet.ts</span><br />
                <span className="text-[#5e6a7a] italic">// Visible only to: [ Manan Patel, Sarah Jenkins ]</span><br />
                <span className="text-[#cba135]">function</span> testTwoPointer(nums) &#123;<br />
                &nbsp;&nbsp;<span className="text-[#5e6a7a] italic">// Hidden from Alex and Dave during independent drafting</span><br />
                &#125;
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="panel-grid animate-[riseIn_0.5s_cubic-bezier(.16,.8,.3,1)]">
              <div className="text-left">
                <div className="eyebrow-teal">{t('showcase.tab_notes')}</div>
                <h3 className="panel-title">{t('showcase.notes_title')}</h3>
                <p className="panel-desc">{t('showcase.notes_desc')}</p>
              </div>
              <div className="panel-code-box">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                </div>
                <span className="text-[#5e6a7a] italic"># Session Brainstorming Notes (Public to Room)</span><br />
                <span className="text-[#5e6a7a] italic">- Time complexity goal: O(N) using Hash Map</span><br />
                <span className="text-[#5e6a7a] italic">- Handle duplicates: skip already processed indices</span>
              </div>
            </div>
          )}

          {activeTab === 'final' && (
            <div className="panel-grid animate-[riseIn_0.5s_cubic-bezier(.16,.8,.3,1)]">
              <div className="text-left">
                <div className="eyebrow-teal">{t('showcase.tab_final')}</div>
                <h3 className="panel-title">{t('showcase.final_title')}</h3>
                <p className="panel-desc">{t('showcase.final_desc')}</p>
              </div>
              <div className="panel-code-box flex flex-col justify-between">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                </div>
                <div className="border border-[#1a212c] bg-[#121620] p-4 rounded-md">
                  <div className="text-xs font-mono text-[#9aa5b3] mb-2 font-bold">CREATE NEW SHEET</div>
                  <div className="text-xs text-[#5e6a7a] mb-3">Sheet Name: <span className="text-[#1ec8b5]">binary-search-opt</span></div>
                  <div className="text-xs text-[#5e6a7a] mb-4">
                    Visibility:<br />
                    <span className="text-white">[✓] All Room Users</span><br />
                    <span className="text-[#9aa5b3]">[ ] Select Collaborators (Manan, Sarah...)</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#cba135] bg-[#cba135]/10 px-2.5 py-1 rounded inline-block">Create Sheet</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
