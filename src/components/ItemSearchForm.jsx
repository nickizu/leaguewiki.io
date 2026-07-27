import { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'

function ItemSearchForm({ onItemSearch }) {
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onItemSearch(query.trim())
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="Enter an item"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
        <Button>Remove</Button>
      </InputGroup>
    </Form>
  )
}

export default ItemSearchForm
