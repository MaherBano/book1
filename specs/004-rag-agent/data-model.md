# Data Model: RAG-Enabled AI Agent

## Entities

### Query
- **Description**: A user's question or request for information from the book content
- **Fields**:
  - `text`: string (required) - The user's question
  - `context_constraint`: string (optional) - Limit scope to specific sections/chapters
  - `query_type`: enum (factual, conceptual, section-specific) - Type of query
  - `timestamp`: datetime - When the query was made

### Retrieved Content
- **Description**: Book chunks retrieved from Qdrant based on semantic similarity to the query
- **Fields**:
  - `content`: string (required) - The text content from the book
  - `source_url`: string (required) - URL to the original book section
  - `chapter`: string (required) - Book chapter containing the content
  - `section`: string (required) - Specific section within the chapter
  - `chunk_index`: integer (required) - Index of the chunk within the source
  - `similarity_score`: float (required) - Semantic similarity score to the query
  - `metadata`: dict - Additional metadata from Qdrant

### Agent Response
- **Description**: The AI-generated answer containing information from retrieved content with citations
- **Fields**:
  - `content`: string (required) - The agent's response text
  - `citations`: array of Citation (required) - References to source materials
  - `query_id`: string (required) - Reference to the original query
  - `timestamp`: datetime - When the response was generated
  - `confidence_score`: float - Agent's confidence in the response

### Citation
- **Description**: Reference to the original book section, including chapter, section, and URL
- **Fields**:
  - `url`: string (required) - URL to the original book section
  - `chapter`: string (required) - Book chapter
  - `section`: string (required) - Specific section within the chapter
  - `content_preview`: string (required) - Preview of the cited content
  - `relevance_score`: float (required) - Relevance to the user's query

### Context Constraint
- **Description**: Optional parameter that limits the scope of content the agent can draw from
- **Fields**:
  - `type`: enum (chapter, section, page_range, custom) - Type of constraint
  - `value`: string (required) - The specific constraint value
  - `description`: string (optional) - Human-readable description of the constraint

## Relationships

- Query → Agent Response (1:1) - Each query generates one response
- Query → Retrieved Content (1:M) - Each query can retrieve multiple content chunks
- Agent Response → Citation (1:M) - Each response can have multiple citations
- Retrieved Content → Citation (1:1) - Each retrieved content maps to one citation
- Query → Context Constraint (1:1) - Each query can have one context constraint (optional)

## Validation Rules

- Query.text must be between 10 and 1000 characters
- Retrieved Content.similarity_score must be between 0.0 and 1.0
- Agent Response must include at least one citation if content was retrieved
- Citation.url must be a valid URL format
- Context Constraint is optional but if provided, type and value must be valid