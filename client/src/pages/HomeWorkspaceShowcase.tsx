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
                <span className="text-[#cba135]">const</span> result <span className="text-[#5e6a7a]">=</span> <span className="text-[#7fb8e0]">solve</span>(input);<br />
                <span className="text-[#5e6a7a] italic">// Manan & Alex — editing</span>
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
                <span className="text-[#5e6a7a] italic">// Alex's sheet — brute force draft</span><br />
                <span className="text-[#cba135]">for</span> (i, j) &#123; ... &#125;
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
                <span className="text-[#5e6a7a] italic">Time: O(n) · Space: O(n)</span><br />
                <span className="text-[#5e6a7a] italic">Edge case: empty array, no pair found</span>
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
              <div className="panel-code-box">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                  <span className="editor-circle-btn" />
                </div>
                <span className="text-[#5e6a7a] italic">// Final — reviewed & locked</span><br />
                <span className="text-[#cba135]">export default</span> <span className="text-[#7fb8e0]">twoSum</span>;
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
