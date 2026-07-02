import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'

function About() {
  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <Card.Title>About</Card.Title>
          <Card.Text>
            Navigating here via a link, or reloading this page directly,
            both work because the app uses a HashRouter — no server-side
            rewrites required on GitHub Pages.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default About
