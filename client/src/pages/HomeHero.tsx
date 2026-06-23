import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/common/Button';

interface Position {
  teal: { top: number; left: number };
  gold: { top: number; left: number };
  sel: { top: number; left: number; width: number };
}

const cursorPositions: Position[] = [
  { teal: { top: 80, left: 90 }, gold: { top: 132, left: 70 }, sel: { top: 80, left: 200, width: 60 } },
  { teal: { top: 154, left: 230 }, gold: { top: 206, left: 120 }, sel: { top: 154, left: 60, width: 170 } },
  { teal: { top: 232, left: 150 }, gold: { top: 180, left: 280 }, sel: { top: 232, left: 40, width: 100 } },
  { teal: { top: 106, left: 260 }, gold: { top: 258, left: 90 }, sel: { top: 106, left: 70, width: 180 } },
];

export const HomeHero: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posIdx, setPosIdx] = useState(1);
  const currentPos = cursorPositions[posIdx % cursorPositions.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setPosIdx((prev) => prev + 1);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="pt-48 pb-24 relative">
      <div className="max-w-[1180px] mx-auto px-8 relative z-10 text-center flex flex-col gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11.8px] tracking-widest text-[#1ec8b5] bg-[#1ec8b5]/8 border border-[#1ec8b5]/25 px-3.5 py-1.5 rounded-full mb-7 rise-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1ec8b5] shadow-[0_0_0_0_rgba(30,200,181,0.45)] animate-[pulseDot_2.2s_infinite]" />
            {t('hero.eyebrow')}
          </div>
          
          <h1 className="font-serif font-normal text-4.5xl md:text-[70px] leading-[1.07] tracking-tight max-w-[900px] mx-auto rise-in">
            {t('hero.headline_main')}<br />
            {t('hero.headline_sub')}{' '}
            <span className="italic text-[#1ec8b5]">
              {t('hero.headline_em')}
            </span>
          </h1>
          
          <p className="max-w-[560px] mx-auto mt-6 text-[#9aa5b3] text-lg leading-[1.65] rise-in">
            {t('hero.sub')}
          </p>
        </div>

        <div className="flex gap-4.5 justify-center flex-wrap rise-in">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/login')}
            icon={
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            {t('hero.cta_create')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('hero.cta_how')}
          </Button>
        </div>

        {/* Monaco style mockup editor */}
        <div className="w-full max-w-[920px] mx-auto text-left bg-[#0d1219] border border-[#222b38] rounded-2xl overflow-hidden shadow-2xl relative z-10 rise-in">
          <div className="flex justify-between items-center px-4.5 py-3.5 bg-[#131a24] border-b border-[#222b38]">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.8 h-2.8 rounded-full bg-[#222b38]" />
                <span className="w-2.8 h-2.8 rounded-full bg-[#222b38]" />
                <span className="w-2.8 h-2.8 rounded-full bg-[#222b38]" />
              </div>
              <span className="font-mono text-[12.5px] text-[#5e6a7a] ml-1.5">{t('hero.editor_file')}</span>
            </div>
            <div className="flex">
              <div className="w-5.5 h-5.5 rounded-full border-2 border-[#131a24] flex items-center justify-center font-mono text-[9.5px] font-semibold text-[#0a0e14] bg-[#1ec8b5]">M</div>
              <div className="w-5.5 h-5.5 rounded-full border-2 border-[#131a24] flex items-center justify-center font-mono text-[9.5px] font-semibold text-[#0a0e14] bg-[#cba135] -ml-1.8">A</div>
            </div>
          </div>

          <div className="p-7 font-mono text-[13.8px] leading-[1.9] relative min-h-[280px]">
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">1</span><span className="text-[#5e6a7a] italic">// shared-sheet · live</span></div>
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">2</span><span className="text-[#9aa5b3]"><span className="text-[#cba135]">function</span> <span className="text-[#7fb8e0]">twoSum</span>(nums, target) &#123;</span></div>
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">3</span><span className="text-[#9aa5b3]">&nbsp; <span className="text-[#cba135]">const</span> seen = <span className="text-[#cba135]">new</span> <span className="text-[#7fb8e0]">Map</span>();</span></div>
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">4</span><span className="text-[#9aa5b3]">&nbsp; <span className="text-[#cba135]">for</span> (let i = 0; i &lt; nums.length; i++) &#123;</span></div>
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">5</span><span className="text-[#9aa5b3]">&nbsp;&nbsp; <span className="text-[#cba135]">const</span> need = target - nums[i];</span></div>
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">6</span><span className="text-[#9aa5b3]">&nbsp;&nbsp; <span className="text-[#cba135]">if</span> (seen.<span className="text-[#7fb8e0]">has</span>(need)) <span className="text-[#cba135]">return</span> [seen.<span className="text-[#7fb8e0]">get</span>(need), i];</span></div>
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">7</span><span className="text-[#9aa5b3]">&nbsp;&nbsp; seen.<span className="text-[#7fb8e0]">set</span>(nums[i], i);</span></div>
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">8</span><span className="text-[#9aa5b3]">&nbsp; &#125;</span></div>
            <div className="flex">
              <span className="w-7 text-[#5e6a7a] opacity-60 select-none">9</span>
              <span className="text-[#9aa5b3]">
                &nbsp; <span className="text-[#5e6a7a] italic">// O(n) one-pass — Manan, 0:42</span>
                <span className="inline-block w-0.5 h-[1.1em] bg-[#1ec8b5] ml-0.5 align-text-bottom animate-[blink_1s_steps(2)_infinite]" />
              </span>
            </div>
            <div className="flex"><span className="w-7 text-[#5e6a7a] opacity-60 select-none">10</span><span className="text-[#9aa5b3]">&#125;</span></div>

            {/* Simulated cursor tags */}
            <div
              className="absolute font-mono text-[9.8px] font-semibold px-2 py-0.5 rounded-tr rounded-br rounded-bl text-[#0a0e14] bg-[#1ec8b5] transition-all duration-[0.9s] ease-[cubic-bezier(.16,.8,.3,1)] pointer-events-none"
              style={{ top: `${currentPos.teal.top}px`, left: `${currentPos.teal.left}px` }}
            >
              Manan
            </div>
            <div
              className="absolute font-mono text-[9.8px] font-semibold px-2 py-0.5 rounded-tr rounded-br rounded-bl text-[#0a0e14] bg-[#cba135] transition-all duration-[0.9s] ease-[cubic-bezier(.16,.8,.3,1)] pointer-events-none"
              style={{ top: `${currentPos.gold.top}px`, left: `${currentPos.gold.left}px` }}
            >
              Alex
            </div>
            <div
              className="absolute h-[25px] rounded bg-[#1ec8b5]/16 transition-all duration-[0.9s] ease-[cubic-bezier(.16,.8,.3,1)] pointer-events-none"
              style={{ top: `${currentPos.sel.top}px`, left: `${currentPos.sel.left}px`, width: `${currentPos.sel.width}px` }}
            />
          </div>

          <div className="flex justify-between items-center px-4.5 py-2.8 bg-[#131a24] border-t border-[#222b38] font-mono text-[11.5px] text-[#5e6a7a]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              {t('hero.editor_collaborators')}
            </div>
            <span>{t('hero.editor_lang_sheet')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
