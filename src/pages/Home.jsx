import { useState } from 'react'
import { Container, Card, Alert, ListGroup, Spinner, Button } from 'react-bootstrap'
import useLatestVersion from '../hooks/useLatestVersion.js'
import useChampionData from '../hooks/useChampionData.js'
import useItemData from '../hooks/useItemData.js'
import ChampionSearchForm from '../components/ChampionSearchForm.jsx'
import ChampionStats from '../components/ChampionStats.jsx'
import ChampionCompare from '../components/ChampionCompare.jsx'

function Home() {
  const { version, loading: versionLoading, error: versionError } = useLatestVersion()
  const { champions, loading: championsLoading, error: championsError } = useChampionData(version)
  const { items, loading: itemsLoading, error: itemsError } = useItemData(version)
  const [selectedChampion, setSelectedChampion] = useState(null)
  const [matches, setMatches] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [doCompare, setDoCompare] = useState(false)

  // Picking a typeahead suggestion jumps straight to that champion.
  function handleSelect(champ) {
    setMatches(null)
    setNotFound(false)
    setSelectedChampion(champ)
  }

  // Fallback path: hitting Search with no suggestion highlighted still runs
  // the substring filter and shows a list when several champions match.
  const loading = versionLoading || championsLoading
  const error = versionError || championsError

  function handleSearch(query) {
    setSelectedChampion(null)
    setMatches(null)
    setNotFound(false)

    if (!champions || !query) return

    const results = Object.values(champions).filter((champ) =>
      champ.name.toLowerCase().includes(query.toLowerCase())
    )

    if (results.length === 0) {
      setNotFound(true)
    } else if (results.length > 1) {
      setMatches(results)
    } else {
      setSelectedChampion(results[0])
    }
  }

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <Card.Title>Champion Search</Card.Title>
          <ChampionSearchForm
            champions={champions}
            version={version}
            onSearch={handleSearch}
            onSelect={handleSelect}
          />

          {loading && (
            <div className="mt-3">
              <Spinner animation="border" size="sm" /> Loading champion data...
            </div>
          )}

          {error && (
            <Alert variant="danger" className="mt-3">
              Failed to load champion data. Please try again later.
            </Alert>
          )}

          {notFound && (
            <Alert variant="warning" className="mt-3">
              No champions found matching your search.
            </Alert>
          )}

          {matches && (
            <>
              <p className="mt-3">Multiple champions matched, pick one:</p>
              <ListGroup>
                {matches.map((champ) => (
                  <ListGroup.Item
                    action
                    key={champ.id}
                    onClick={() => {
                      setSelectedChampion(champ)
                      setMatches(null)
                    }}
                  >
                    {champ.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          {selectedChampion && (
            <div className="mt-3">
              <ChampionStats champion={selectedChampion} version={version} items={items}/>
            </div>
          )}
        </Card.Body>
      </Card>
      
    {selectedChampion && (
  <>
    <Button onClick={() => setDoCompare(!doCompare)}>
      {doCompare ? "Remove" : "Compare"}
    </Button>
    {doCompare && (
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>Compare Champions</Card.Title>
          <ChampionCompare
            key={selectedChampion.id}
            champions={champions}
            version={version}
            baseChampion={selectedChampion}
          />
        </Card.Body>
      </Card>
    )}
  </>
)}


    </Container>
  )
}

export default Home
