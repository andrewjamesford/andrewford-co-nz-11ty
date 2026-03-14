# Product Requirements Document: AI Chatbot Migration to OpenRouter

## Introduction/Overview

This PRD outlines the requirements for migrating the existing AI chatbot on the blog from its current implementation (with Upstash rate limiting) to a new architecture using OpenRouter with LangChain. The migration aims to remove rate limiting restrictions and provide users with unrestricted access to AI assistance while optimizing costs by utilizing free AI models available through OpenRouter.

## Goals

1. Eliminate rate limiting restrictions currently imposed by Upstash
2. Implement OpenRouter integration to access free AI models
3. Enable streaming responses for better user experience
4. Maintain chatbot availability as a widget on all blog pages
5. Reduce operational costs by leveraging free-tier AI models
6. Ensure smooth migration with complete replacement of old implementation

## User Stories

1. **As a blog visitor**, I want to use the AI chatbot without encountering rate limit errors, so that I can ask multiple questions and get help whenever needed.

2. **As a blog visitor**, I want to see responses streaming in real-time, so that I know the chatbot is working and don't have to wait for complete responses.

3. **As a blog owner**, I want to use free AI models through OpenRouter, so that I can provide AI assistance without incurring high operational costs.

4. **As a blog visitor**, I want the chatbot to be easily accessible on any blog page, so that I can get help with content-related questions without navigating away.

## Functional Requirements

1. **OpenRouter Integration**

   - The system must integrate with OpenRouter API using appropriate authentication
   - The system must support configuration of API keys through environment variables
   - The system must handle API errors gracefully with user-friendly error messages

2. **Free Model Selection**

   - The system must use only free-tier models available on OpenRouter
   - The system must implement model fallback logic if primary model is unavailable
   - The system must log which models are being used for monitoring purposes

3. **LangChain Implementation**

   - The system must use LangChain.js for managing conversations and prompts
   - The system must implement proper prompt templates for consistent responses
   - The system must handle conversation context appropriately

4. **Streaming Responses**

   - The system must stream AI responses character-by-character or chunk-by-chunk
   - The system must show visual indicators during response generation
   - The system must handle stream interruptions gracefully

5. **Chat Widget**

   - The system must display a chat widget on all blog pages
   - The widget must be collapsible/expandable
   - The widget must maintain conversation state during page navigation
   - The widget must be responsive and work on mobile devices

6. **Static Site Compatibility**

   - The system must work with static site architecture (11ty)
   - The system must use client-side JavaScript for API calls
   - The system must not require server-side infrastructure beyond API endpoints

7. **Rate Limiting Removal**
   - The system must completely remove Upstash rate limiting dependencies
   - The system must not implement any user-based rate limiting
   - The system must handle potential abuse through other means (e.g., request validation)

## Non-Goals (Out of Scope)

1. User authentication or account management
2. Conversation history persistence across sessions
3. Multi-language support
4. Voice input/output capabilities
5. Integration with paid AI models
6. Server-side rendering of chat components
7. Analytics or conversation tracking
8. Custom model fine-tuning

## Design Considerations

1. **UI/UX Requirements**

   - Chat widget should match existing blog design theme
   - Widget should be unobtrusive but easily discoverable
   - Loading states must be clear during streaming
   - Error messages should be helpful and actionable

2. **Accessibility**
   - Widget must be keyboard navigable
   - Must include appropriate ARIA labels
   - Must work with screen readers

## Technical Considerations

1. **API Key Management**

   - OpenRouter API keys must be stored securely
   - Consider using edge functions or serverless endpoints to protect keys
   - Never expose API keys in client-side code

2. **Performance**

   - Lazy load chat widget to avoid impacting initial page load
   - Implement request debouncing to prevent spam
   - Cache static assets appropriately

3. **Browser Compatibility**

   - Must support modern browsers (Chrome, Firefox, Safari, Edge)
   - Must gracefully degrade for older browsers

4. **Dependencies**
   - LangChain.js for conversation management
   - OpenRouter SDK or REST API client
   - Minimal additional dependencies to keep bundle size small

## Success Metrics

1. **User Engagement**

   - 100% elimination of rate limit error messages
   - Increase in average chat sessions per visitor
   - Reduction in chat abandonment rate

2. **Performance**

   - Time to first token < 2 seconds
   - Complete response streaming without interruptions
   - Widget load time < 500ms

3. **Cost Optimization**

   - $0 monthly cost for AI model usage (using only free tiers)
   - Reduced infrastructure costs from removing Upstash

4. **Reliability**
   - 99% uptime for chat functionality
   - Successful fallback to alternative models when needed

## Open Questions

1. Which specific free models on OpenRouter should be prioritized?
2. Should conversation context be stored in browser localStorage for session persistence?
3. What should be the maximum conversation length before context is truncated?
4. Should there be any client-side validation to prevent prompt injection attacks?
5. How should the system handle OpenRouter API downtime?
6. Should typing indicators be shown while the AI is generating responses?
7. What specific prompt template should be used to ensure helpful blog-related responses?
