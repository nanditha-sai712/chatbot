import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Upload, 
  FileText, 
  X, 
  Download, 
  Trash2,
  Search,
  MoreVertical,
  Bot,
  User,
  Clock,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Settings,
  Zap,
  Brain,
  Shield,
  Database,
  History,
  FolderOpen,
  Image as ImageIcon,
  Paperclip,
  Mic,
  Volume2,
  ChevronDown,
  Filter,
  Star,
  Hash
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your RAG-powered document assistant. I can help you analyze, summarize, and answer questions about your uploaded documents with minimal hallucinations thanks to Groq integration.",
      sender: 'bot',
      timestamp: '10:00 AM',
      documents: [],
      isProcessing: false
    },
    {
      id: 2,
      text: "Upload a document or ask me anything about your previously uploaded files.",
      sender: 'bot',
      timestamp: '10:01 AM',
      documents: [],
      isProcessing: false
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([
    { id: 1, name: 'Q3_Financial_Report.pdf', size: '2.4 MB', type: 'pdf', uploadedAt: '2024-01-15' },
    { id: 2, name: 'Research_Paper_RAG.pdf', size: '3.1 MB', type: 'pdf', uploadedAt: '2024-01-16' },
    { id: 3, name: 'Technical_Specs.docx', size: '1.8 MB', type: 'docx', uploadedAt: '2024-01-16' },
    { id: 4, name: 'Meeting_Notes.txt', size: '0.5 MB', type: 'txt', uploadedAt: '2024-01-17' }
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Financial Analysis Q3', date: 'Today', messageCount: 24 },
    { id: 2, title: 'Research Paper Review', date: 'Yesterday', messageCount: 18 },
    { id: 3, title: 'Technical Docs Q&A', date: 'Jan 15', messageCount: 12 },
    { id: 4, title: 'Legal Document Review', date: 'Jan 12', messageCount: 42 }
  ]);
  
  const [activeTab, setActiveTab] = useState('chat');
  const [ragMetrics, setRagMetrics] = useState({
    accuracy: '95%',
    hallucinationRate: '2.3%',
    responseTime: '1.4s',
    contextLength: '4096 tokens',
    sourcesCited: 3
  });
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && selectedDocuments.length === 0) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      documents: [...selectedDocuments],
      isProcessing: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedDocuments([]);
    setIsProcessing(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Based on the uploaded documents, I found that the Q3 revenue increased by 15% quarter-over-quarter. The main drivers were new product launches and expanded market reach.",
        "The research paper discusses advanced RAG architectures that can reduce hallucinations by up to 90% when combined with Groq's LPU inference engine.",
        "Looking at the technical specifications, the system requirements include 8GB RAM minimum and support for multiple document formats including PDF, DOCX, and TXT.",
        "The meeting notes suggest implementing a hybrid retrieval approach combining semantic search with keyword matching for better accuracy."
      ];

      const botMessage = {
        id: messages.length + 2,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        documents: [],
        isProcessing: false,
        sources: [
          { id: 1, name: 'Q3_Financial_Report.pdf', page: 12, relevance: '95%' },
          { id: 2, name: 'Research_Paper_RAG.pdf', page: 5, relevance: '87%' }
        ],
        confidence: 'High'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);
      
      // Update metrics
      setRagMetrics(prev => ({
        ...prev,
        accuracy: `${Math.min(100, Math.floor(Math.random() * 5) + 93)}%`,
        hallucinationRate: `${(Math.random() * 3).toFixed(1)}%`,
        responseTime: `${(Math.random() * 0.5 + 1.2).toFixed(1)}s`
      }));
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    setTimeout(() => {
      const newDocs = files.map((file, index) => ({
        id: uploadedDocuments.length + index + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.split('.').pop(),
        uploadedAt: new Date().toLocaleDateString()
      }));
      
      setUploadedDocuments(prev => [...prev, ...newDocs]);
      setSelectedDocuments(prev => [...prev, ...newDocs.map(doc => doc.id)]);
      setIsUploading(false);
      
      // Add system message about upload
      const uploadMessage = {
        id: messages.length + 1,
        text: `${files.length} document${files.length > 1 ? 's' : ''} uploaded successfully. You can now ask questions about ${files.length > 1 ? 'them' : 'it'}.`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        documents: newDocs,
        isProcessing: false
      };
      
      setMessages(prev => [...prev, uploadMessage]);
    }, 2000);
  };

  const handleDocumentSelect = (docId) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleDeleteDocument = (docId) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
    setSelectedDocuments(prev => prev.filter(id => id !== docId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message) => {
    const isBot = message.sender === 'bot';
    
    return (
      <div 
        key={message.id} 
        className={`flex gap-4 ${isBot ? '' : 'flex-row-reverse'} mb-6`}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isBot 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : 'bg-gradient-to-r from-green-500 to-emerald-500'
        }`}>
          {isBot ? (
            <Bot className="h-5 w-5 text-white" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        
        {/* Message Content */}
        <div className={`flex-1 ${isBot ? '' : 'text-right'}`}>
          <div className={`rounded-2xl p-4 max-w-[80%] ${
            isBot 
              ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none'
          } ${!isBot ? 'ml-auto' : ''}`}>
            {message.isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Processing with RAG...</span>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap">{message.text}</p>
                
                {/* Sources for bot messages */}
                {isBot && message.sources && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <div className="text-sm font-medium text-gray-700 mb-2">Sources:</div>
                    <div className="space-y-2">
                      {message.sources.map(source => (
                        <div key={source.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{source.name}</span>
                            <span className="text-gray-500">Page {source.page}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            parseFloat(source.relevance) > 90 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {source.relevance} relevant
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Confidence indicator */}
                    {message.confidence && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">
                          Confidence: <span className="font-semibold">{message.confidence}</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Message Actions */}
          <div className={`flex items-center space-x-4 mt-2 ${isBot ? '' : 'justify-end'}`}>
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {message.timestamp}
            </span>
            
            {!message.isProcessing && (
              <div className="flex items-center space-x-2">
                {isBot && (
                  <>
                    <button className="text-gray-500 hover:text-blue-600 transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-gray-500 hover:text-green-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button className="text-gray-500 hover:text-red-600 transition-colors">
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                    <button className="text-gray-500 hover:text-purple-600 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents or chats..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Recent Chats
                </h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                {chatHistory.map(chat => (
                  <div 
                    key={chat.id}
                    className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">{chat.title}</div>
                      <span className="text-xs text-gray-500">{chat.date}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {chat.messageCount} messages
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Section */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Documents
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {uploadedDocuments.length}
                  </span>
                </h3>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Upload
                </button>
              </div>
              
              <div className="space-y-2">
                {uploadedDocuments.map(doc => (
                  <div 
                    key={doc.id}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedDocuments.includes(doc.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleDocumentSelect(doc.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${
                        doc.type === 'pdf' ? 'bg-red-100 text-red-600' :
                        doc.type === 'docx' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm truncate max-w-[120px]">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDocument(doc.id);
                        }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RAG Metrics */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Brain className="h-4 w-4 mr-2 text-blue-600" />
              RAG Metrics
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">Accuracy</div>
                <div className="text-lg font-bold text-green-600">{ragMetrics.accuracy}</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">Hallucination</div>
                <div className="text-lg font-bold text-red-600">{ragMetrics.hallucinationRate}</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">Response Time</div>
                <div className="text-lg font-bold text-blue-600">{ragMetrics.responseTime}</div>
              </div>
              <div className="bg-white p-2 rounded">
                <div className="text-xs text-gray-500">Context</div>
                <div className="text-lg font-bold text-purple-600">{ragMetrics.contextLength}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    RAG
                  </div>
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Groq
                  </div>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Document Chat Assistant
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{uploadedDocuments.length}</span> documents indexed
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-4 mt-4">
              {['chat', 'documents', 'insights', 'settings'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'chat' ? (
              <>
                {messages.map(renderMessage)}
                
                {/* Processing indicator */}
                {isProcessing && (
                  <div className="flex gap-4 mb-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 text-gray-800 rounded-2xl p-4 rounded-tl-none max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          <span>Processing with RAG...</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          Retrieving relevant information from {selectedDocuments.length > 0 ? selectedDocuments.length : uploadedDocuments.length} documents
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            ) : activeTab === 'documents' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedDocuments.map(doc => (
                  <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg ${
                        doc.type === 'pdf' ? 'bg-red-100' :
                        doc.type === 'docx' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-blue-600">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 truncate">{doc.name}</h4>
                    <div className="text-sm text-gray-500 mb-3">{doc.size} • {doc.type.toUpperCase()}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Uploaded {doc.uploadedAt}</span>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                        Analyze →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-blue-600" />
                      Processing Stats
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Document Indexing</span>
                          <span className="text-sm font-medium">98%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-[98%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Semantic Search Accuracy</span>
                          <span className="text-sm font-medium">95%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[95%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-purple-600" />
                      Vector Database
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Embeddings Generated</span>
                        <span className="font-semibold">12,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vector Dimensions</span>
                        <span className="font-semibold">1536</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Retrieval Speed</span>
                        <span className="font-semibold">0.8ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            {/* Selected Documents */}
            {selectedDocuments.length > 0 && (
              <div className="mb-4 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Selected:</span>
                <div className="flex flex-wrap gap-2">
                  {uploadedDocuments
                    .filter(doc => selectedDocuments.includes(doc.id))
                    .map(doc => (
                      <div 
                        key={doc.id}
                        className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        <FileText className="h-3 w-3" />
                        <span>{doc.name}</span>
                        <button 
                          onClick={() => handleDocumentSelect(doc.id)}
                          className="hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Input Box */}
            <div className="flex space-x-4">
              {/* Upload Button */}
              <div className="relative">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-50 transition-colors"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                  ) : (
                    <Upload className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.pptx,.ppt"
                />
              </div>
              
              {/* Message Input */}
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your documents or type / for commands..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows="3"
                />
                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Mic className="h-5 w-5 text-gray-500" />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={(!inputMessage.trim() && selectedDocuments.length === 0) || isProcessing}
                    className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors">
                  /summarize
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors">
                  /extract
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors">
                  /compare
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded border">Enter</kbd> to send •{' '}
                <kbd className="px-2 py-1 bg-gray-100 rounded border">Shift</kbd> +{' '}
                <kbd className="px-2 py-1 bg-gray-100 rounded border">Enter</kbd> for new line
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default ChatPage;