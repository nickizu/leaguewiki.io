import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'

function Home() {
  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <Card.Title>Home</Card.Title>
          <Card.Text>
            This is a dummy page proving the Vite + React Bootstrap + React
            Router (HashRouter) stack is wired up correctly.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Home
