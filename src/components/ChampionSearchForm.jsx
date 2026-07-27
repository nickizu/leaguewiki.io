import { useEffect, useMemo, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import ListGroup from 'react-bootstrap/ListGroup'

// Strip case + punctuation so "kaisa" matches "Kai'Sa" and
// "monkeyking" matches Wukong (whose data id is "MonkeyKing").
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

const MAX_SUGGESTIONS = 8

function ChampionSearchForm({ champions, version, onSearch, onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const containerRef = useRef(null)

  // Recompute the suggestion list only when the query or champion data changes.
    
const q = normalize(query)
let suggestions = []

if (champions && q) {
  const scored = []
  for (const champ of Object.values(champions)) {
    const name = normalize(champ.name)
    const id = normalize(champ.id)
    let rank
    if (name.startsWith(q)) rank = 1
    else if (name.includes(q)) rank = 2
    else if (id.startsWith(q)) rank = 3
    else if (id.includes(q)) rank = 4
    else continue
    scored.push({ champ, rank })
  }
  scored.sort((a, b) => {
    if (a.rank !== b.rank) {
      return a.rank - b.rank
    }
    return a.champ.name.localeCompare(b.champ.name)
  })
  suggestions = scored.slice(0, MAX_SUGGESTIONS).map((s) => s.champ)
}

  // Close the dropdown when the user clicks anywhere outside the search box.
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function choose(champ) {
    setQuery(champ.name)
    setOpen(false)
    setHighlight(-1)
    onSelect(champ)
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Enter on a highlighted suggestion picks it; otherwise run a plain search.
    if (open && highlight >= 0 && suggestions[highlight]) {
      choose(suggestions[highlight])
    } else {
      setOpen(false)
    onSearch(query.trim())
  }
  }

  function handleKeyDown(e) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="position-relative">
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="Enter a champion"
          value={query}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              setHighlight(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </InputGroup>
    </Form>

      {open && suggestions.length > 0 && (
        <ListGroup
          className="position-absolute w-100 shadow-sm"
          style={{ zIndex: 1000 }}
        >
          {suggestions.map((champ, i) => (
            <ListGroup.Item
              action
              key={champ.id}
              active={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                choose(champ)
              }}
              >
              <img 
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`}
                // alt = ""
                alt= {`A picture of ${champ.name}`}
                width={32}
                height={32}
                style={{ borderRadius: '4px' }}
              />
              {champ.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}

export default ChampionSearchForm
