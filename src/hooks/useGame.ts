import { useCallback, useEffect, useRef, useState } from 'react';
import type { Anime } from '../types/anime';
import { pickInitialPair, pickReplacement } from '../utils/animePairing';
import { incrementGamesPlayed, maybeUpdateRecord } from '../storage/localStorage';

type Question = 'newer' | 'older';
type Side = 'left' | 'right';
type GameStatus = 'idle' | 'playing' | 'feedback' | 'gameover';
type Feedback = 'correct' | 'incorrect' | null;

const FEEDBACK_DURATION_MS = 800;
const TIMER_TICK_MS = 100;

export type GameOverResult = {
  finalStreak: number;
  finalTimeMs: number;
  isNewRecord: boolean;
};

export function useGame(pool: Anime[]) {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [question, setQuestion] = useState<Question>('newer');
  const [leftAnime, setLeftAnime] = useState<Anime | null>(null);
  const [rightAnime, setRightAnime] = useState<Anime | null>(null);
  const [leftYearVisible, setLeftYearVisible] = useState(false);
  const [rightYearVisible, setRightYearVisible] = useState(false);
  const [feedbackLeft, setFeedbackLeft] = useState<Feedback>(null);
  const [feedbackRight, setFeedbackRight] = useState<Feedback>(null);
  const [streak, setStreak] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [gameOverResult, setGameOverResult] = useState<GameOverResult | null>(null);

  const usedIdsRef = useRef<Set<number>>(new Set());
  const startTimeRef = useRef<number>(0);
  const streakRef = useRef(0);

  useEffect(() => {
    if (status !== 'playing' && status !== 'feedback') return;

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, TIMER_TICK_MS);

    return () => clearInterval(interval);
  }, [status]);

  const endGame = useCallback(() => {
    const finalStreak = streakRef.current;
    const finalTimeMs = Date.now() - startTimeRef.current;

    setStatus('gameover');

    incrementGamesPlayed();
    const { isNewRecord } = maybeUpdateRecord(finalStreak, finalTimeMs);

    setGameOverResult({ finalStreak, finalTimeMs, isNewRecord });
  }, []);

  const startGame = useCallback(() => {
    if (pool.length === 0) return;

    const pair = pickInitialPair(pool, new Set());
    if (!pair) return; // pool too small to find a valid pair

    usedIdsRef.current = new Set([pair.left.id, pair.right.id]);
    startTimeRef.current = Date.now();
    streakRef.current = 0;

    setLeftAnime(pair.left);
    setRightAnime(pair.right);
    setLeftYearVisible(false);
    setRightYearVisible(false);
    setFeedbackLeft(null);
    setFeedbackRight(null);
    setStreak(0);
    setElapsedMs(0);
    setQuestion('newer'); // Round 1 is always "which is newer?"
    setGameOverResult(null);
    setStatus('playing');
  }, [pool]);

  const selectAnime = useCallback(
    (side: Side) => {
      if (status !== 'playing' || !leftAnime || !rightAnime) return;

      const selected = side === 'left' ? leftAnime : rightAnime;
      const other = side === 'left' ? rightAnime : leftAnime;

      const selectedIsNewer = selected.year > other.year;
      const isCorrect = question === 'newer' ? selectedIsNewer : !selectedIsNewer;

      setLeftYearVisible(true);
      setRightYearVisible(true);
      setStatus('feedback');

      if (isCorrect) {
        setFeedbackLeft('correct');
        setFeedbackRight('correct');
      } else {
        setFeedbackLeft(side === 'left' ? 'incorrect' : null);
        setFeedbackRight(side === 'right' ? 'incorrect' : null);
      }

      if (!isCorrect) {
        setTimeout(endGame, FEEDBACK_DURATION_MS);
        return;
      }

      setTimeout(() => {
        streakRef.current += 1;
        setStreak(streakRef.current);

        const replacement = pickReplacement(pool, selected, usedIdsRef.current);

        if (!replacement) {
          endGame();
          return;
        }

        usedIdsRef.current.add(replacement.id);
        setQuestion((prev) => (prev === 'newer' ? 'older' : 'newer'));
        setFeedbackLeft(null);
        setFeedbackRight(null);

        if (side === 'left') {
          setRightAnime(replacement);
          setRightYearVisible(false);
          setLeftYearVisible(true);
        } else {
          setLeftAnime(replacement);
          setLeftYearVisible(false);
          setRightYearVisible(true);
        }

        setStatus('playing');
      }, FEEDBACK_DURATION_MS);
    },
    [status, leftAnime, rightAnime, question, pool, endGame]
  );

  return {
    status,
    question,
    leftAnime,
    rightAnime,
    leftYearVisible,
    rightYearVisible,
    feedbackLeft,
    feedbackRight,
    streak,
    elapsedMs,
    gameOverResult,
    startGame,
    selectAnime,
  };
}