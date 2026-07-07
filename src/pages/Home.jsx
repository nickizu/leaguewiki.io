import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'
import useChampionData from '../hooks/useChampionData.js'
import ChampionSearchForm from '../components/ChampionSearchForm.jsx'
import ChampionStats from '../components/ChampionStats.jsx'

function Home() {
  const { champions, version, loading, error } = useChampionData()
  const [selectedChampion, setSelectedChampion] = useState(null)
  const [matches, setMatches] = useState(null)
  const [notFound, setNotFound] = useState(false)

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
          <ChampionSearchForm onSearch={handleSearch} />

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
              <ChampionStats champion={selectedChampion} version={version} />
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Home
