import { useCallback, useState } from 'react'

const STORAGE_KEY = 'leaguewiki:recentComparisons'
const MAX_PAIRS = 5

function loadPairs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function savePairs(pairs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs))
  } catch {
    // Ignore write failures (private browsing, quota, disabled storage).
  }
}

function isSamePair(pair, idA, idB) {
  return (pair.a === idA && pair.b === idB) || (pair.a === idB && pair.b === idA)
}

// Tracks the most recently compared champion pairs in localStorage.
export default function useRecentPairs() {
  const [recentPairs, setRecentPairs] = useState(loadPairs)

  const addPair = useCallback((idA, idB) => {
    setRecentPairs((prev) => {
      const withoutExisting = prev.filter((pair) => !isSamePair(pair, idA, idB))
      const next = [{ a: idA, b: idB }, ...withoutExisting].slice(0, MAX_PAIRS)
      savePairs(next)
      return next
    })
  }, [])

  return [recentPairs, addPair]
}
