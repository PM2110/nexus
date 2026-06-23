import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

type TabType = 'shared' | 'personal' | 'notes' | 'final';

export const HomeWorkspaceShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('shared');

  return (
    <section className="py-24" id="workspaces">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="text-center max-w-[640px] mx-auto mb-16 rise-in">
          <div className="font-mono text-[11.8px] tracking-widest text-[#cba135] uppercase mb-3.5">
            {t('showcase.eyebrow')}
          </div>
          <h2 className="font-serif font-normal text-3xl md:text-[42px] leading-[1.18] tracking-tight mb-4">
            {t('showcase.title')}
          </h2>
          <p className="text-[#9aa5b3] text-[16.3px] leading-relaxed">
            {t('showcase.sub')}
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex justify-center gap-2.5 mb-12 flex-wrap rise-in">
          <button
            type="button"
            onClick={() => setActiveTab('shared')}
            className={`font-mono text-[12.8px] px-4.5 py-2.2 rounded-lg border transition-all ${
              activeTab === 'shared'
                ? 'bg-[#1ec8b5] text-[#0a0e14] border-[#1ec8b5] font-semibold'
                : 'bg-[#0d1219] text-[#9aa5b3] border-[#222b38] hover:border-[#5e6a7a] hover:text-[#e7e9ec]'
            }`}
          >
            {t('showcase.tab_shared')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`font-mono text-[12.8px] px-4.5 py-2.2 rounded-lg border transition-all ${
              activeTab === 'personal'
                ? 'bg-[#1ec8b5] text-[#0a0e14] border-[#1ec8b5] font-semibold'
                : 'bg-[#0d1219] text-[#9aa5b3] border-[#222b38] hover:border-[#5e6a7a] hover:text-[#e7e9ec]'
            }`}
          >
            {t('showcase.tab_personal')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`font-mono text-[12.8px] px-4.5 py-2.2 rounded-lg border transition-all ${
              activeTab === 'notes'
                ? 'bg-[#1ec8b5] text-[#0a0e14] border-[#1ec8b5] font-semibold'
                : 'bg-[#0d1219] text-[#9aa5b3] border-[#222b38] hover:border-[#5e6a7a] hover:text-[#e7e9ec]'
            }`}
          >
            {t('showcase.tab_notes')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('final')}
            className={`font-mono text-[12.8px] px-4.5 py-2.2 rounded-lg border transition-all ${
              activeTab === 'final'
                ? 'bg-[#1ec8b5] text-[#0a0e14] border-[#1ec8b5] font-semibold'
                : 'bg-[#0d1219] text-[#9aa5b3] border-[#222b38] hover:border-[#5e6a7a] hover:text-[#e7e9ec]'
            }`}
          >
            {t('showcase.tab_final')}
          </button>
        </div>

        {/* Tab Panels */}
        <div className="max-w-[980px] mx-auto relative z-10 rise-in">
          {activeTab === 'shared' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10 bg-[#0d1219] border border-[#222b38] rounded-2xl transition-all duration-500 animate-[riseIn_0.5s_cubic-bezier(.16,.8,.3,1)]">
              <div className="text-left">
                <div className="font-mono text-[11.5px] uppercase tracking-wider text-[#1ec8b5] mb-3.5">{t('showcase.tab_shared')}</div>
                <h3 className="font-serif font-normal text-[27px] leading-[1.25] mb-3.5">{t('showcase.shared_title')}</h3>
                <p className="text-[#9aa5b3] text-[15.3px] leading-[1.65]">{t('showcase.shared_desc')}</p>
              </div>
              <div className="bg-[#131a24] border border-[#222b38] rounded-xl p-4.5 font-mono text-[12.5px] leading-[1.8] text-[#9aa5b3]">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                </div>
                <span className="text-[#cba135]">const</span> result <span className="text-[#5e6a7a]">=</span> <span className="text-[#7fb8e0]">solve</span>(input);<br />
                <span className="text-[#5e6a7a] italic">// Manan & Alex — editing</span>
              </div>
            </div>
          )}

          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10 bg-[#0d1219] border border-[#222b38] rounded-2xl transition-all duration-500 animate-[riseIn_0.5s_cubic-bezier(.16,.8,.3,1)]">
              <div className="text-left">
                <div className="font-mono text-[11.5px] uppercase tracking-wider text-[#1ec8b5] mb-3.5">{t('showcase.tab_personal')}</div>
                <h3 className="font-serif font-normal text-[27px] leading-[1.25] mb-3.5">{t('showcase.personal_title')}</h3>
                <p className="text-[#9aa5b3] text-[15.3px] leading-[1.65]">{t('showcase.personal_desc')}</p>
              </div>
              <div className="bg-[#131a24] border border-[#222b38] rounded-xl p-4.5 font-mono text-[12.5px] leading-[1.8] text-[#9aa5b3]">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                </div>
                <span className="text-[#5e6a7a] italic">// Alex's sheet — brute force draft</span><br />
                <span className="text-[#cba135]">for</span> (i, j) &#123; ... &#125;
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10 bg-[#0d1219] border border-[#222b38] rounded-2xl transition-all duration-500 animate-[riseIn_0.5s_cubic-bezier(.16,.8,.3,1)]">
              <div className="text-left">
                <div className="font-mono text-[11.5px] uppercase tracking-wider text-[#1ec8b5] mb-3.5">{t('showcase.tab_notes')}</div>
                <h3 className="font-serif font-normal text-[27px] leading-[1.25] mb-3.5">{t('showcase.notes_title')}</h3>
                <p className="text-[#9aa5b3] text-[15.3px] leading-[1.65]">{t('showcase.notes_desc')}</p>
              </div>
              <div className="bg-[#131a24] border border-[#222b38] rounded-xl p-4.5 font-mono text-[12.5px] leading-[1.8] text-[#9aa5b3]">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                </div>
                <span className="text-[#5e6a7a] italic">Time: O(n) · Space: O(n)</span><br />
                <span className="text-[#5e6a7a] italic">Edge case: empty array, no pair found</span>
              </div>
            </div>
          )}

          {activeTab === 'final' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10 bg-[#0d1219] border border-[#222b38] rounded-2xl transition-all duration-500 animate-[riseIn_0.5s_cubic-bezier(.16,.8,.3,1)]">
              <div className="text-left">
                <div className="font-mono text-[11.5px] uppercase tracking-wider text-[#1ec8b5] mb-3.5">{t('showcase.tab_final')}</div>
                <h3 className="font-serif font-normal text-[27px] leading-[1.25] mb-3.5">{t('showcase.final_title')}</h3>
                <p className="text-[#9aa5b3] text-[15.3px] leading-[1.65]">{t('showcase.final_desc')}</p>
              </div>
              <div className="bg-[#131a24] border border-[#222b38] rounded-xl p-4.5 font-mono text-[12.5px] leading-[1.8] text-[#9aa5b3]">
                <div className="flex gap-1.5 mb-3.5">
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
                  <span className="w-2 h-2 rounded-full bg-[#222b38]" />
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
