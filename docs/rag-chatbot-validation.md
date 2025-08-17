# RAG Chatbot Functionality Validation

This document provides comprehensive testing procedures to validate the RAG (Retrieval-Augmented Generation) chatbot functionality with vector store integration in the Coolify deployment.

## Overview

The RAG chatbot validation covers:

- **Vector store loading** and document retrieval
- **Semantic search functionality** across blog content
- **LLM integration** with OpenAI and OpenRouter APIs
- **Context preservation** in conversations
- **Response quality** and relevance validation
- **Performance benchmarks** for query processing
- **Error handling** and fallback mechanisms

## Vector Store Architecture

### Current Implementation

The chatbot uses a vector store containing blog content for semantic search:

```javascript
// Vector store structure (from api/utils/vectorSearch.js)
{
  documents: [
    {
      content: "Blog post content...",
      metadata: {
        title: "Post Title",
        url: "/articles/post-slug/",
        date: "2024-01-17",
        tags: ["docker", "devops"]
      },
      embedding: [0.1, 0.2, -0.3, ...] // 1536-dimensional vector
    }
  ]
}
```

### Vector Store Location

```bash
# Vector store files in container
/app/vector_store/
├── documents.json          # Document content and metadata
├── embeddings.json         # Precomputed embeddings
└── index.json             # Search index configuration
```

## 1. Vector Store Loading Validation

### 1.1 Container Vector Store Check

Verify vector store files are properly included in Docker container:

```bash
# Check if vector store files exist in staging
curl -s https://staging.andrewford.co.nz/health | jq '.apis'

# Expected response should include vector store status
# Health endpoint should validate vector store loading

# Alternative: Check logs for vector store loading
# In Coolify dashboard, check application logs for:
# "Vector store loaded successfully with X documents"
```

### 1.2 Document Count Validation

```bash
# Test vector store document count via health endpoint
curl -s https://staging.andrewford.co.nz/health | jq '.'

# Expected: Health check should report vector store status
# Look for "vectorStore": "loaded" or document count information
```

### 1.3 Vector Store Content Verification

Create a test script to validate vector store content:

```bash
# Create vector store validation script
cat > test-vector-store.js << 'EOF'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testVectorStore() {
  try {
    // Test with known blog content query
    const response = await fetch('https://staging.andrewford.co.nz/api/chatrag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "What topics does this blog cover?",
        conversationHistory: []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.text();
    console.log('RAG Response:', data.substring(0, 500) + '...');

    // Check if response contains blog-specific content
    const hasRelevantContent = data.toLowerCase().includes('docker') ||
                              data.toLowerCase().includes('devops') ||
                              data.toLowerCase().includes('programming');

    console.log('Contains relevant blog content:', hasRelevantContent);

  } catch (error) {
    console.error('Vector store test failed:', error.message);
  }
}

testVectorStore();
EOF

# Run the test (requires Node.js)
node test-vector-store.js
```

## 2. Semantic Search Functionality Testing

### 2.1 Known Content Queries

Test queries that should find specific blog content:

```bash
# Test 1: Docker-related query
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I set up Docker containers?",
    "conversationHistory": []
  }' | head -50

# Expected: Should return content about Docker from blog posts

# Test 2: DevOps-related query
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are your thoughts on continuous integration?",
    "conversationHistory": []
  }' | head -50

# Expected: Should return relevant DevOps content

# Test 3: Programming-related query
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me JavaScript examples",
    "conversationHistory": []
  }' | head -50

# Expected: Should return programming content from blog
```

### 2.2 Semantic Similarity Testing

Test that semantically similar queries return related content:

```bash
# Test semantic variations of the same topic
echo "Testing semantic variations..."

# Variation 1: Container technology
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about containerization",
    "conversationHistory": []
  }' > response1.txt

# Variation 2: Docker specifically
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain Docker concepts",
    "conversationHistory": []
  }' > response2.txt

# Both should reference similar content sources
echo "Response 1 length: $(wc -c < response1.txt)"
echo "Response 2 length: $(wc -c < response2.txt)"

# Check for content overlap (manual review required)
grep -i "docker\|container" response1.txt | wc -l
grep -i "docker\|container" response2.txt | wc -l
```

### 2.3 Irrelevant Query Handling

Test how the system handles queries outside blog scope:

```bash
# Test 1: Completely unrelated topic
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the weather like today?",
    "conversationHistory": []
  }' | head -50

# Expected: Should indicate limited knowledge or redirect to blog topics

# Test 2: Personal questions not in blog content
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is your favorite color?",
    "conversationHistory": []
  }' | head -50

# Expected: Should handle gracefully, possibly redirect to available topics
```

## 3. LLM Integration Testing

### 3.1 OpenAI API Integration

Test primary LLM provider integration:

```bash
# Test OpenAI integration with technical query
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain the benefits of Docker mentioned in your blog",
    "conversationHistory": []
  }' -w "Response time: %{time_total}s\n"

# Expected: Response in under 10 seconds with relevant content

# Test complex reasoning query
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Compare the DevOps approaches you have written about",
    "conversationHistory": []
  }' | head -100

# Expected: Should synthesize information from multiple sources
```

### 3.2 OpenRouter Fallback Testing

Test backup LLM provider (requires API key configuration):

```bash
# Test system behavior when primary LLM is unavailable
# (This would require temporarily disabling OpenAI API key)

# For now, test that OpenRouter key is configured
curl -s https://staging.andrewford.co.nz/health | jq '.apis.openrouter'
# Expected: "configured"

# Test with complex query that might use fallback
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Summarize all your blog posts about cloud computing and provide key insights",
    "conversationHistory": []
  }' -w "Response time: %{time_total}s\n"

# Expected: Should still provide coherent response
```

### 3.3 Response Quality Assessment

Create automated response quality tests:

```bash
# Create response quality validator
cat > validate-response-quality.js << 'EOF'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function validateResponseQuality() {
  const testQueries = [
    "What is Docker and why should I use it?",
    "How do you approach DevOps in your projects?",
    "What programming languages do you recommend?",
    "Explain continuous integration best practices"
  ];

  for (const query of testQueries) {
    console.log(`\nTesting query: "${query}"`);

    try {
      const response = await fetch('https://staging.andrewford.co.nz/api/chatrag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          conversationHistory: []
        })
      });

      const responseText = await response.text();

      // Quality metrics
      const wordCount = responseText.split(' ').length;
      const hasRelevantKeywords = responseText.toLowerCase().includes('docker') ||
                                 responseText.toLowerCase().includes('devops') ||
                                 responseText.toLowerCase().includes('programming');
      const hasStructure = responseText.includes('\n') || responseText.includes('.');

      console.log(`- Word count: ${wordCount}`);
      console.log(`- Contains relevant keywords: ${hasRelevantKeywords}`);
      console.log(`- Has structure: ${hasStructure}`);
      console.log(`- Response preview: ${responseText.substring(0, 150)}...`);

    } catch (error) {
      console.error(`Error testing query "${query}":`, error.message);
    }
  }
}

validateResponseQuality();
EOF

node validate-response-quality.js
```

## 4. Context Preservation Testing

### 4.1 Multi-turn Conversation Testing

Test conversation memory and context:

```bash
# Test 1: Multi-turn conversation about Docker
echo "Testing multi-turn conversation..."

# First message
RESPONSE1=$(curl -s -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Docker?",
    "conversationHistory": []
  }')

echo "First response preview: $(echo "$RESPONSE1" | head -c 150)..."

# Follow-up message using context
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"How do I get started with it?\",
    \"conversationHistory\": [
      {\"role\": \"user\", \"content\": \"What is Docker?\"},
      {\"role\": \"assistant\", \"content\": \"$(echo "$RESPONSE1" | sed 's/"/\\"/g' | tr -d '\n')\"}
    ]
  }" | head -100

# Expected: Should understand "it" refers to Docker from context
```

### 4.2 Context Window Testing

Test conversation history limits:

```bash
# Create long conversation to test context limits
cat > test-long-conversation.js << 'EOF'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLongConversation() {
  let conversationHistory = [];

  const queries = [
    "What is Docker?",
    "How do I install it?",
    "What are the best practices?",
    "How does it compare to virtual machines?",
    "What about container orchestration?",
    "Tell me about Kubernetes",
    "How do they work together?",
    "What are common pitfalls?",
    "How do you handle security?",
    "What about performance optimization?"
  ];

  for (let i = 0; i < queries.length; i++) {
    console.log(`\nTurn ${i + 1}: ${queries[i]}`);

    try {
      const response = await fetch('https://staging.andrewford.co.nz/api/chatrag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: queries[i],
          conversationHistory: conversationHistory
        })
      });

      const responseText = await response.text();
      console.log(`Response length: ${responseText.length} chars`);
      console.log(`Preview: ${responseText.substring(0, 100)}...`);

      // Add to conversation history
      conversationHistory.push(
        { role: 'user', content: queries[i] },
        { role: 'assistant', content: responseText }
      );

      // Keep only last 6 messages to test context management
      if (conversationHistory.length > 6) {
        conversationHistory = conversationHistory.slice(-6);
      }

    } catch (error) {
      console.error(`Error in turn ${i + 1}:`, error.message);
      break;
    }
  }
}

testLongConversation();
EOF

node test-long-conversation.js
```

## 5. Performance Benchmarking

### 5.1 Response Time Testing

```bash
# Test response times for different query types
echo "Testing RAG response times..."

# Simple factual query
echo "Simple query:"
curl -w "Time: %{time_total}s\n" -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Docker?",
    "conversationHistory": []
  }' -s -o /dev/null

# Complex analytical query
echo "Complex query:"
curl -w "Time: %{time_total}s\n" -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Compare different containerization approaches and explain when to use each",
    "conversationHistory": []
  }' -s -o /dev/null

# Query with conversation context
echo "Contextual query:"
curl -w "Time: %{time_total}s\n" -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How does this apply to microservices?",
    "conversationHistory": [
      {"role": "user", "content": "What is Docker?"},
      {"role": "assistant", "content": "Docker is a containerization platform..."}
    ]
  }' -s -o /dev/null

# Expected times:
# Simple query: < 5 seconds
# Complex query: < 15 seconds
# Contextual query: < 8 seconds
```

### 5.2 Concurrent Request Testing

```bash
# Test multiple concurrent RAG requests
echo "Testing concurrent RAG requests..."

for i in {1..5}; do
  curl -X POST https://staging.andrewford.co.nz/api/chatrag \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"Test query $i - What is containerization?\",
      \"conversationHistory\": []
    }" \
    -w "Request $i time: %{time_total}s\n" \
    -s -o /dev/null &
done

wait
echo "Concurrent testing completed"

# Expected: All requests should complete within reasonable time
# No request should fail due to resource contention
```

### 5.3 Memory Usage Monitoring

```bash
# Monitor memory usage during RAG operations
echo "Monitoring memory usage during RAG operations..."

# Baseline memory
BASELINE=$(curl -s https://staging.andrewford.co.nz/health | jq -r '.memory.percentage')
echo "Baseline memory usage: $BASELINE%"

# Execute several RAG queries
for i in {1..3}; do
  curl -s -X POST https://staging.andrewford.co.nz/api/chatrag \
    -H "Content-Type: application/json" \
    -d '{
      "message": "Explain Docker architecture and its components in detail",
      "conversationHistory": []
    }' > /dev/null

  CURRENT=$(curl -s https://staging.andrewford.co.nz/health | jq -r '.memory.percentage')
  echo "Memory after query $i: $CURRENT%"
done

# Expected: Memory usage should remain stable
# No significant memory leaks during RAG operations
```

## 6. Error Handling and Fallback Testing

### 6.1 Invalid Input Testing

```bash
# Test malformed requests
echo "Testing error handling..."

# Empty message
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "",
    "conversationHistory": []
  }' -w "Status: %{http_code}\n"

# Missing message field
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": []
  }' -w "Status: %{http_code}\n"

# Invalid JSON
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{invalid json}' -w "Status: %{http_code}\n"

# Expected: Should return appropriate error codes (400, 422)
# Should not crash the application
```

### 6.2 Large Input Testing

```bash
# Test very long messages
echo "Testing large input handling..."

# Generate large message (10KB)
LARGE_MESSAGE=$(python3 -c "print('This is a very long message. ' * 500)")

curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"$LARGE_MESSAGE\",
    \"conversationHistory\": []
  }" -w "Status: %{http_code}, Time: %{time_total}s\n" -s -o /dev/null

# Expected: Should handle gracefully or return appropriate error
# Should not cause server timeout or crash
```

### 6.3 API Failure Simulation

```bash
# Test behavior when external APIs are unavailable
# (This would require temporarily modifying API keys)

echo "Testing API failure scenarios..."

# For now, test with invalid conversation history format
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is Docker?",
    "conversationHistory": "invalid_format"
  }' -w "Status: %{http_code}\n"

# Expected: Should handle gracefully with appropriate error message
```

## 7. Vector Store Content Quality Testing

### 7.1 Content Coverage Testing

```bash
# Test coverage of different blog topics
echo "Testing vector store content coverage..."

TOPICS=("docker" "kubernetes" "devops" "programming" "javascript" "python" "ci/cd" "automation")

for topic in "${TOPICS[@]}"; do
  echo "Testing topic: $topic"

  response=$(curl -s -X POST https://staging.andrewford.co.nz/api/chatrag \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"Tell me about $topic from your blog posts\",
      \"conversationHistory\": []
    }")

  if echo "$response" | grep -qi "$topic"; then
    echo "✅ $topic content found"
  else
    echo "❌ $topic content not found or limited"
  fi
done
```

### 7.2 Metadata Validation

```bash
# Test that responses include proper source attribution
echo "Testing source attribution..."

curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What Docker tutorial do you recommend?",
    "conversationHistory": []
  }' | grep -i "source\|article\|post\|blog"

# Expected: Should reference specific blog posts when appropriate
```

## 8. Integration Testing with Frontend

### 8.1 Frontend Chat Interface Testing

```bash
# Test that frontend can communicate with RAG API
echo "Testing frontend integration..."

# Check if chat interface loads
curl -s https://staging.andrewford.co.nz/ | grep -i "chat\|assistant\|ask"

# Check if chat JavaScript loads
curl -s https://staging.andrewford.co.nz/scripts/chat.js | grep -i "api/chatrag"

# Expected: Frontend should have proper integration code
```

### 8.2 CORS and Security Testing

```bash
# Test CORS for chat functionality
curl -H "Origin: https://staging.andrewford.co.nz" \
     -H "Content-Type: application/json" \
     -X POST https://staging.andrewford.co.nz/api/chatrag \
     -d '{
       "message": "Test CORS",
       "conversationHistory": []
     }' -I

# Expected: Should include proper CORS headers
# Should allow requests from staging domain
```

## 9. RAG Quality Assessment

### 9.1 Relevance Testing

Create a comprehensive relevance test:

```bash
# Create RAG quality assessment
cat > assess-rag-quality.js << 'EOF'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function assessRAGQuality() {
  const testCases = [
    {
      query: "How do I get started with Docker?",
      expectedKeywords: ["docker", "container", "install", "tutorial"],
      category: "Technical Tutorial"
    },
    {
      query: "What are your thoughts on DevOps best practices?",
      expectedKeywords: ["devops", "practice", "automation", "pipeline"],
      category: "Opinion/Analysis"
    },
    {
      query: "Show me JavaScript examples from your blog",
      expectedKeywords: ["javascript", "example", "code", "function"],
      category: "Code Examples"
    }
  ];

  console.log("RAG Quality Assessment Report");
  console.log("============================");

  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.category}`);
    console.log(`Query: "${testCase.query}"`);

    try {
      const startTime = Date.now();
      const response = await fetch('https://staging.andrewford.co.nz/api/chatrag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testCase.query,
          conversationHistory: []
        })
      });

      const responseText = await response.text();
      const responseTime = Date.now() - startTime;

      // Assess quality metrics
      const wordCount = responseText.split(' ').length;
      const foundKeywords = testCase.expectedKeywords.filter(keyword =>
        responseText.toLowerCase().includes(keyword)
      );
      const relevanceScore = (foundKeywords.length / testCase.expectedKeywords.length) * 100;

      console.log(`✅ Response time: ${responseTime}ms`);
      console.log(`✅ Word count: ${wordCount}`);
      console.log(`✅ Keywords found: ${foundKeywords.join(', ')}`);
      console.log(`✅ Relevance score: ${relevanceScore.toFixed(1)}%`);
      console.log(`Preview: ${responseText.substring(0, 200)}...`);

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

assessRAGQuality();
EOF

node assess-rag-quality.js
```

## 10. Production Readiness Checklist

### 10.1 RAG System Validation

The RAG chatbot is ready for production when:

**Critical (Must Pass)**:

- [ ] Vector store loads successfully in container
- [ ] Health endpoint reports vector store as "loaded"
- [ ] Basic queries return relevant responses from blog content
- [ ] Response times are under 10 seconds for typical queries
- [ ] No critical errors in chatbot endpoint
- [ ] CORS configuration allows frontend access

**Important (Should Pass)**:

- [ ] Semantic search finds relevant content for various topics
- [ ] Multi-turn conversations maintain context appropriately
- [ ] Error handling works for invalid inputs
- [ ] Memory usage remains stable during operations
- [ ] Concurrent requests are handled properly

**Nice to Have (May Pass)**:

- [ ] Response quality scores >80% on relevance tests
- [ ] Complex analytical queries work well
- [ ] Source attribution is included in responses
- [ ] Performance optimizations are implemented

### 10.2 Performance Benchmarks

| Metric                      | Target         | Staging Result | Status |
| --------------------------- | -------------- | -------------- | ------ |
| Simple query response time  | <5s            | [X]s           | ✅/❌  |
| Complex query response time | <15s           | [X]s           | ✅/❌  |
| Vector store load time      | <30s           | [X]s           | ✅/❌  |
| Memory usage increase       | <50MB          | [X]MB          | ✅/❌  |
| Concurrent request handling | 5 simultaneous | [X]            | ✅/❌  |

## 11. Troubleshooting Guide

### Common RAG Issues

| Issue              | Symptoms                    | Cause                    | Solution                                         |
| ------------------ | --------------------------- | ------------------------ | ------------------------------------------------ |
| Empty responses    | API returns but no content  | Vector store not loaded  | Check container logs, verify vector_store/ files |
| Slow responses     | >30s response time          | LLM API latency          | Check OpenAI/OpenRouter API status               |
| Irrelevant answers | Responses don't match query | Poor semantic search     | Review vector store content quality              |
| Context loss       | Follow-up questions ignored | History management issue | Verify conversation history format               |
| Memory leaks       | Increasing memory usage     | Vector data not released | Monitor health endpoint, restart if needed       |

### Debug Commands

```bash
# Check vector store status
curl -s https://staging.andrewford.co.nz/health | jq '.apis'

# Test basic connectivity
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/api/chatrag

# Monitor memory during RAG operations
watch -n 5 'curl -s https://staging.andrewford.co.nz/health | jq ".memory"'

# Check container logs for RAG errors
# (In Coolify dashboard, view application logs)
```

## Next Steps

After completing RAG functionality validation:

1. ✅ Document all test results and performance metrics
2. ✅ Address any critical issues found with vector store or LLM integration
3. ✅ Validate response quality meets expected standards
4. ✅ Proceed to API integration testing (Task 5.4)
5. ✅ Ensure RAG system is ready for production workload
