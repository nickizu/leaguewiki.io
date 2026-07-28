import { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'

function ItemSearchForm(props) {
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    props.onItemSearch(query.trim())
  }

  function handleRemove() {
    props.onItemRemove(props.itemNum)
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
        <Button onClick={handleRemove}>Remove</Button>
      </InputGroup>
    </Form>
  )
}

export default ItemSearchForm
