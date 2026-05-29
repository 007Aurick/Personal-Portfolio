import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './IntroLoader.css';

const PROMPT_USER = 'aurick@portfolio';
const CHAR_MS = 38;
const PAUSE_AFTER_CMD_MS = 280;
const PAUSE_AFTER_OUTPUT_MS = 520;
const PROGRESS_MS = 3000;
const PROGRESS_TICK_MS = 40;
const PROGRESS_BAR_WIDTH = 24;

const SCRIPT = [
  {
    cmd: 'cd Aurick\'s Portfolio',
    output: 'website active...',
  },
 
  {
    cmd: 'loading content...',
    type: 'progress',
    progressLabel: 'Home, Projects, Contact, Life activated...',
    duration: PROGRESS_MS,
  },
  {
    cmd: 'npm start',
    output: 'SYSTEM READY'
  }
];

function buildProgressBar(percent) {
  const filled = Math.round((percent / 100) * PROGRESS_BAR_WIDTH);
  const empty = PROGRESS_BAR_WIDTH - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent}%`;
}

function CommandLine({ command, showCursor }) {
  return (
    <div className="intro-term-line intro-term-line--cmd">
      <span className="intro-term-prompt">
        <span className="intro-term-prompt-user">{PROMPT_USER}</span>
        <span className="intro-term-prompt-path">:~$</span>
      </span>
      <span className="intro-term-cmd">{command}</span>
      {showCursor && <span className="intro-term-cursor">▌</span>}
    </div>
  );
}

function OutputLine({ text }) {
  return <div className="intro-term-line intro-term-line--out">{text}</div>;
}

function ProgressLine({ label, percent }) {
  return (
    <div className="intro-term-line intro-term-line--out intro-term-progress">
      <span className="intro-term-progress__label">{label}</span>
      <span className="intro-term-progress__bar">{buildProgressBar(percent)}</span>
    </div>
  );
}

const IntroLoader = ({ onComplete }) => {
  const inputRef = useRef(null);
  const [finishedLines, setFinishedLines] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [typedCmd, setTypedCmd] = useState('');
  const [phase, setPhase] = useState('typing');
  const [progress, setProgress] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const scriptDone = stepIndex >= SCRIPT.length;

  const resetTerminal = useCallback(() => {
    setFinishedLines([]);
    setStepIndex(0);
    setTypedCmd('');
    setUserInput('');
    setProgress(0);
    setPhase('typing');
  }, []);

  useEffect(() => {
    if (scriptDone || phase !== 'typing') {
      return undefined;
    }

    const full = SCRIPT[stepIndex].cmd;
    let pos = 0;

    const interval = setInterval(() => {
      pos += 1;
      setTypedCmd(full.slice(0, pos));
      if (pos >= full.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('output'), PAUSE_AFTER_CMD_MS);
      }
    }, CHAR_MS);

    return () => clearInterval(interval);
  }, [stepIndex, phase, scriptDone]);

  useEffect(() => {
    if (phase !== 'output' || scriptDone) {
      return undefined;
    }

    const step = SCRIPT[stepIndex];

    if (step.type === 'progress') {
      const timer = setTimeout(() => {
        setFinishedLines((prev) => [...prev, { type: 'command', text: step.cmd }]);
        setTypedCmd('');
        setProgress(0);
        setPhase('progress');
      }, PAUSE_AFTER_CMD_MS);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setFinishedLines((prev) => [
        ...prev,
        { type: 'command', text: step.cmd },
        { type: 'output', text: step.output },
      ]);
      setTypedCmd('');
      setStepIndex((i) => i + 1);
      setPhase('typing');
    }, PAUSE_AFTER_OUTPUT_MS);

    return () => clearTimeout(timer);
  }, [phase, stepIndex, scriptDone]);

  useEffect(() => {
    if (phase !== 'progress') {
      return undefined;
    }

    const step = SCRIPT[stepIndex];
    const duration = step.duration ?? PROGRESS_MS;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += PROGRESS_TICK_MS;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setFinishedLines((prev) => [
          ...prev,
          {
            type: 'progress',
            label: step.progressLabel ?? 'LOADING PROJECT ARCHIVES',
            percent: 100,
          },
          
        ]);
        setStepIndex((i) => i + 1);
        setPhase('typing');
      }
    }, PROGRESS_TICK_MS);

    return () => clearInterval(interval);
  }, [phase, stepIndex]);

  useEffect(() => {
    if (!scriptDone || phase !== 'typing') {
      return undefined;
    }
    const t = setTimeout(() => setPhase('prompt'), 450);
    return () => clearTimeout(t);
  }, [scriptDone, phase]);

  useEffect(() => {
    if (phase === 'prompt' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  const finishIntro = useCallback(() => {
    if (isExiting) {
      return;
    }
    setIsExiting(true);
    setTimeout(() => onComplete(), 650);
  }, [isExiting, onComplete]);

  const handleSkip = useCallback(() => {
    if (isExiting) {
      return;
    }
    setIsExiting(true);
    setTimeout(() => onComplete(), 400);
  }, [isExiting, onComplete]);

  const submitPrompt = useCallback(() => {
    const answer = userInput.trim().toLowerCase();

    if (answer === 'yes') {
      finishIntro();
      return;
    }

    if (answer === 'no') {
      resetTerminal();
      return;
    }

    setFinishedLines((prev) => [
      ...prev,
      { type: 'command', text: userInput },
      { type: 'output', text: 'Invalid input. Type yes or no.' },
    ]);
    setUserInput('');
  }, [userInput, finishIntro, resetTerminal]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSkip]);

  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitPrompt();
    }
  };

  const activeCmd =
    !scriptDone && (phase === 'typing' || phase === 'output') ? (
      <CommandLine
        command={phase === 'output' ? SCRIPT[stepIndex].cmd : typedCmd}
        showCursor={phase === 'typing'}
      />
    ) : null;

  const progressStep = phase === 'progress' ? SCRIPT[stepIndex] : null;

  return (
    <motion.div
      className="intro-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      role="dialog"
      aria-label="Portfolio terminal intro"
    >
      <div className="intro-loader__center">
        <p className="intro-loader__skip-hint" aria-hidden="true">
          press <kbd>^C</kbd> to skip
        </p>
        <div className="intro-terminal">
          <div className="intro-terminal__titlebar">
            <div className="intro-terminal__dots" aria-hidden="true">
              <span className="intro-terminal__dot intro-terminal__dot--close" />
              <span className="intro-terminal__dot intro-terminal__dot--min" />
              <span className="intro-terminal__dot intro-terminal__dot--max" />
            </div>
            <span className="intro-terminal__title">aurick@portfolio — bash</span>
          </div>

          <div className="intro-terminal__body">
            {finishedLines.map((line, i) => {
              if (line.type === 'command') {
                return <CommandLine key={`cmd-${i}`} command={line.text} showCursor={false} />;
              }
              if (line.type === 'progress') {
                return (
                  <ProgressLine key={`prog-${i}`} label={line.label} percent={line.percent} />
                );
              }
              return <OutputLine key={`out-${i}`} text={line.text} />;
            })}

            {activeCmd}

            {progressStep && (
              <ProgressLine
                label={progressStep.progressLabel ?? 'LOADING PROJECT ARCHIVES'}
                percent={progress}
              />
            )}

            {phase === 'prompt' && (
              <>
                <OutputLine text="Continue (Yes/No):" />
                <div className="intro-term-input-row">
                  <CommandLine command={userInput} showCursor />
                  <input
                    ref={inputRef}
                    type="text"
                    className="intro-term-input"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handlePromptKeyDown}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-label="Type yes or no to continue"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroLoader;
