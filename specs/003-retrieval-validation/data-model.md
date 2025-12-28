# Data Model: Retrieval Pipeline & Validation

## Entities

### Query
- **text**: string (the search query text)
- **parameters**: object (search parameters like number of results, similarity threshold)
- **timestamp**: datetime (when the query was made)

### RetrievedChunk
- **id**: string (unique identifier for the chunk)
- **content**: string (the text content of the chunk)
- **url**: string (source URL of the content)
- **title**: string (title of the page)
- **section**: string (section or heading from the document)
- **metadata**: object (additional metadata like tags, categories)
- **similarity_score**: float (relevance score for the query)

### SearchResult
- **query**: Query (the original query that generated this result)
- **chunks**: array<RetrievedChunk> (list of retrieved content chunks)
- **total_results**: integer (total number of matching results)
- **retrieval_time**: float (time taken to retrieve results in seconds)

### ValidationTest
- **id**: string (unique identifier for the test)
- **query_text**: string (the test query)
- **expected_results**: array<object> (expected results for validation)
- **actual_results**: array<RetrievedChunk> (actual results returned)
- **accuracy_score**: float (calculated accuracy score)
- **status**: string (pass/fail status)
- **timestamp**: datetime (when test was executed)

### QdrantConnection
- **url**: string (Qdrant Cloud URL)
- **api_key**: string (Qdrant API key)
- **collection_name**: string (name of the collection to query)
- **connection_status**: string (connection status: connected/disconnected/error)

## Relationships

- One Query maps to one SearchResult (1:1 mapping for search results)
- One SearchResult contains multiple RetrievedChunk (1:many relationship)
- One ValidationTest evaluates multiple SearchResult (1:many relationship for testing)
- One QdrantConnection serves multiple Query (1:many relationship for queries)

## Validation Rules

### RetrievedChunk
- content must not be empty
- url must be a valid URL format
- similarity_score must be between 0 and 1

### SearchResult
- chunks array must not be empty
- retrieval_time must be positive
- total_results must be >= number of chunks returned

### ValidationTest
- accuracy_score must be between 0 and 1
- status must be either "pass" or "fail"
- query_text must not be empty

### QdrantConnection
- url must be a valid Qdrant Cloud URL
- api_key must not be empty
- collection_name must exist in Qdrant

## State Transitions

### ValidationTest
- pending → running (when test execution begins)
- running → pass (when accuracy meets threshold)
- running → fail (when accuracy falls below threshold)
- pass/fail → rerun (when test is executed again)