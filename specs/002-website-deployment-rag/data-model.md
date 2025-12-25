# Data Model: Website Deployment, Embeddings & Vector Storage

## Entities

### DocumentChunk
- **id**: string (unique identifier for the chunk)
- **content**: string (the text content of the chunk)
- **url**: string (source URL of the content)
- **title**: string (title of the page)
- **section**: string (section or heading from the document)
- **metadata**: object (additional metadata like tags, categories)
- **embedding**: array<float> (vector embedding of the content)

### QdrantVectorRecord
- **id**: string (unique identifier for the record)
- **vector**: array<float> (the embedding vector)
- **payload**: object (metadata including content, url, title, section)
- **collection**: string (name of the collection, e.g., "rag_embedding")

### ProcessedURL
- **url**: string (the URL being processed)
- **status**: string (processing status: pending, processing, completed, failed)
- **content_hash**: string (hash of the content to detect changes)
- **last_processed**: datetime (timestamp of last processing)

## Relationships

- One DocumentChunk maps to one QdrantVectorRecord (1:1 mapping for storage)
- One ProcessedURL can generate multiple DocumentChunks (1:many relationship)

## Validation Rules

### DocumentChunk
- content must not be empty
- url must be a valid URL format
- embedding must be an array of floats with consistent dimensions

### QdrantVectorRecord
- vector must match the expected dimension for the Cohere model used
- payload must contain required fields (content, url, title)

### ProcessedURL
- url must be unique in the system
- status must be one of the defined values

## State Transitions

### ProcessedURL
- pending → processing (when extraction begins)
- processing → completed (when successfully processed)
- processing → failed (when processing fails)
- completed → processing (when content changes and needs reprocessing)