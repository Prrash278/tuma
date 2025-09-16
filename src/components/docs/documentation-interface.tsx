'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Code, 
  Key, 
  Zap, 
  Globe, 
  Terminal,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

const documentationSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    items: [
      { id: 'quick-start', title: 'Quick Start Guide', description: 'Get up and running in 5 minutes' },
      { id: 'authentication', title: 'Authentication', description: 'Learn how to authenticate your requests' },
      { id: 'api-keys', title: 'API Keys', description: 'Create and manage your API keys' }
    ]
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: Code,
    items: [
      { id: 'chat-completions', title: 'Chat Completions', description: 'Generate text completions' },
      { id: 'models', title: 'Models', description: 'List available AI models' },
      { id: 'usage', title: 'Usage Tracking', description: 'Monitor your API usage' }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Globe,
    items: [
      { id: 'openai-compat', title: 'OpenAI Compatibility', description: 'Drop-in replacement for OpenAI API' },
      { id: 'langchain', title: 'LangChain', description: 'Integrate with LangChain framework' },
      { id: 'curl-examples', title: 'cURL Examples', description: 'Command-line examples' }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced',
    icon: Terminal,
    items: [
      { id: 'webhooks', title: 'Webhooks', description: 'Real-time notifications' },
      { id: 'rate-limits', title: 'Rate Limits', description: 'Understanding rate limiting' },
      { id: 'error-handling', title: 'Error Handling', description: 'Best practices for error handling' }
    ]
  }
]

const codeExamples = {
  'quick-start': {
    title: 'Quick Start Guide',
    description: 'Make your first API call to Tuma',
    code: `curl -X POST "https://api.tuma.ai/v1/chat/completions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": "Hello, world!"
      }
    ]
  }'`
  },
  'authentication': {
    title: 'Authentication',
    description: 'All API requests require authentication using your API key',
    code: `# Include your API key in the Authorization header
Authorization: Bearer tuma_sk_your_api_key_here

# Example with curl
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.tuma.ai/v1/models`
  },
  'chat-completions': {
    title: 'Chat Completions',
    description: 'Generate text completions using our AI models',
    code: `curl -X POST "https://api.tuma.ai/v1/chat/completions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "What is the capital of France?"
      }
    ],
    "max_tokens": 150,
    "temperature": 0.7
  }'`
  },
  'models': {
    title: 'List Models',
    description: 'Get a list of available AI models',
    code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.tuma.ai/v1/models

# Response
{
  "data": [
    {
      "id": "gpt-4o-mini",
      "object": "model",
      "created": 1640995200,
      "owned_by": "openai"
    },
    {
      "id": "claude-3-haiku",
      "object": "model", 
      "created": 1640995200,
      "owned_by": "anthropic"
    }
  ]
}`
  }
}

export function DocumentationInterface() {
  const [selectedSection, setSelectedSection] = useState('getting-started')
  const [selectedItem, setSelectedItem] = useState('quick-start')
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'getting-started': true
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="col-span-1">
        <Card className="border-purple-100 sticky top-6">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {documentationSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center gap-2 w-full p-2 text-left text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <section.icon className="h-4 w-4" />
                    {section.title}
                    {expandedSections[section.id] ? (
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                  
                  {expandedSections[section.id] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedSection(section.id)
                            setSelectedItem(item.id)
                          }}
                          className={`block w-full p-2 text-left text-sm rounded-lg transition-colors ${
                            selectedItem === item.id
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="col-span-3">
        <Card className="border-purple-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {codeExamples[selectedItem as keyof typeof codeExamples]?.title || 'Documentation'}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {codeExamples[selectedItem as keyof typeof codeExamples]?.description || 'Select a topic to get started'}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {codeExamples[selectedItem as keyof typeof codeExamples] && (
              <>
                {/* Code Example */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">Code Example</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCode(codeExamples[selectedItem as keyof typeof codeExamples].code)}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm font-mono">
                      <code>{codeExamples[selectedItem as keyof typeof codeExamples].code}</code>
                    </pre>
                  </div>
                </div>

                {/* Response Example */}
                {selectedItem === 'chat-completions' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Response</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-blue-400 text-sm font-mono">
                        <code>{`{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "The capital of France is Paris."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}`}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="border-purple-100">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900">model</h4>
                        <p className="text-sm text-gray-600">The AI model to use (e.g., gpt-4o-mini)</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">messages</h4>
                        <p className="text-sm text-gray-600">Array of message objects</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">max_tokens</h4>
                        <p className="text-sm text-gray-600">Maximum tokens to generate</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">temperature</h4>
                        <p className="text-sm text-gray-600">Controls randomness (0.0 to 1.0)</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">Rate Limits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Requests per minute</span>
                        <Badge className="bg-green-50 text-green-700 border-green-200">1000</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tokens per minute</span>
                        <Badge className="bg-green-50 text-green-700 border-green-200">100K</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Concurrent requests</span>
                        <Badge className="bg-green-50 text-green-700 border-green-200">10</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Try in Postman
                  </Button>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Code className="h-4 w-4 mr-2" />
                    View SDK
                  </Button>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Key className="h-4 w-4 mr-2" />
                    Get API Key
                  </Button>
                </div>
              </>
            )}

            {!codeExamples[selectedItem as keyof typeof codeExamples] && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Topic</h3>
                <p className="text-gray-600">Choose a topic from the sidebar to view documentation and code examples.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
