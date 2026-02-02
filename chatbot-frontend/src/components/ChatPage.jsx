import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Plus, 
  MessageSquare,
  FileText,
  Upload,
  Bot,
  User,
  Settings,
  Trash2,
  Edit,
  X,
  Menu,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm your RAG Document Assistant. Upload a PDF document and ask questions about it.",
      timestamp: "Just now",
    },
  ]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadError, setUploadError] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking"); // checking, online, offline
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Check backend status - FIXED: Try multiple endpoints
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try multiple endpoints since /health might not exist
        const endpoints = [
          'http://localhost:8000/',
          'http://localhost:8000/docs',
          'http://localhost:8000/redoc'
        ];
        
        let backendOnline = false;
        
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: { 'Accept': 'application/json' },
            });
            if (response.ok || response.status === 200) {
              backendOnline = true;
              break;
            }
          } catch (e) {
            // Continue to next endpoint
            continue;
          }
        }
        
        if (backendOnline) {
          setBackendStatus("online");
        } else {
          // Try the original health endpoint as last resort
          const response = await fetch('http://localhost:8000/health', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });
          if (response.ok) {
            setBackendStatus("online");
          } else {
            setBackendStatus("offline");
          }
        }
      } catch (error) {
        console.log("Backend not reachable:", error);
        setBackendStatus("offline");
      }
    };
    
    checkBackend();
    
    // Check every 15 seconds
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle PDF upload with better error handling
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset file input so same file can be uploaded again
    e.target.value = null;
    
    if (file.type !== "application/pdf") {
      setUploadError("Please upload a PDF file");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }
    
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setUploadError("");
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.user_id);
      formData.append('document_name', file.name);
      
      // Call backend upload API
      const response = await fetch('http://localhost:8000/upload/pdf', {
        method: 'POST',
        body: formData,
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Server returned invalid JSON response');
      }
      
      if (response.ok) {
        // Extract data with fallbacks - FIXED: Handle undefined properly
        const docId = data.document_id || data.id || Date.now();
        const docName = data.document_name || data.filename || file.name;
        const message = data.message || data.detail || "Document uploaded successfully";
        
        // Add document to list
        const newDoc = {
          id: docId,
          name: docName,
          date: new Date().toLocaleDateString(),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadedAt: new Date().toISOString()
        };
        
        setDocuments(prev => [...prev, newDoc]);
        
        // Add success message - FIXED: Proper message formatting
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: "bot",
          text: `${message}\nDocument: "${docName}" has been uploaded successfully. You can now ask questions about it.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        
        setBackendStatus("online");
      } else {
        throw new Error(data.detail || data.error || data.message || `Upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload document');
      
      // Fallback to simulated upload
      const newDoc = {
        id: Date.now(),
        name: file.name,
        date: new Date().toLocaleDateString(),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString(),
        simulated: true
      };
      
      setDocuments(prev => [...prev, newDoc]);
      setBackendStatus("offline");
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: `✅ Document "${file.name}" uploaded successfully.\n\nNote: Using simulated mode as backend connection failed. You can ask questions and I'll provide simulated responses. To enable real RAG functionality, start the backend server.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Send message with improved response handling
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    
    // Check if documents are uploaded
    if (documents.length === 0) {
      alert("Please upload a PDF document first");
      triggerFileInput();
      return;
    }
    
    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setLoading(true);
    
    // Check if we're in simulated mode
    const isSimulated = documents.some(doc => doc.simulated) || backendStatus === "offline";
    
    try {
      if (isSimulated) {
        // Simulated response
        setTimeout(() => {
          const simulatedResponses = [
            `Based on the document you uploaded, "${userInput}" would typically involve analysis of the content. In simulated mode, I can't access the actual document content.`,
            `That's an interesting question about "${userInput}". To get accurate answers, please ensure the backend server is running.`,
            `I understand you're asking about "${userInput}". In simulated mode, I provide general responses. Start the backend server for document-specific answers.`,
            `Your question "${userInput}" requires document analysis. Currently in simulated mode - backend server needed for RAG functionality.`,
            `Regarding "${userInput}", this would normally trigger document search. Enable backend for accurate responses from your uploaded PDFs.`
          ];
          
          const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
          
          const botMsg = {
            id: Date.now() + 1,
            sender: "bot",
            text: `🧪 **Simulated Response**\n\n${randomResponse}\n\n*Status: Backend server not detected. To enable real document Q&A, start the backend on http://localhost:8000*`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prev => [...prev, botMsg]);
          setLoading(false);
        }, 1000);
        return;
      }
      
      // Call backend API for real response
      const response = await fetch('http://localhost:8000/chat/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          document_id: documents[0].id,
          message: userInput
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid JSON response from server');
      }
      
      if (response.ok) {
        // Extract AI response with fallbacks - FIXED: Added more fallback options
        const aiResponse = data.ai_response || 
                          data.response || 
                          data.answer || 
                          data.message || 
                          data.detail ||
                          "I received your message but couldn't generate a proper response.";
        
        // Add AI response
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, botMsg]);
        setBackendStatus("online");
      } else {
        throw new Error(data.detail || data.error || data.message || `Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback to simulated response
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: `⚠️ **Connection Issue**\n\nFailed to connect to backend: ${error.message}\n\nFalling back to simulated mode. Please check:\n1. Backend server is running on http://localhost:8000\n2. CORS is properly configured\n3. API endpoints are correct`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setBackendStatus("offline");
    } finally {
      setLoading(false);
    }
  };

  // Handle enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([{
      id: Date.now(),
      sender: "bot",
      text: "Hello! I'm your RAG Document Assistant. Upload a PDF document and ask questions about it.",
      timestamp: "Just now"
    }]);
  };

  // Delete document
  const deleteDocument = (docId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "bot",
        text: "Document deleted successfully.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // Get current user
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : { username: "User", email: "" };
    } catch {
      return { username: "User", email: "" };
    }
  };

  const user = getCurrentUser();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-gray-900 text-white flex flex-col h-full border-r border-gray-800">
          {/* New Chat Button */}
          <div className="p-3 border-b border-gray-800">
            <button 
              onClick={startNewChat}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Plus size={18} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-xs font-medium text-gray-400 px-3 py-2">Recent Chats</div>
            <div className="space-y-1">
              {[
                { id: 1, title: "New Chat", date: "Today", active: true },
                { id: 2, title: "Research Paper", date: "Yesterday", active: false },
                { id: 3, title: "Document Q&A", date: "Jan 15", active: false },
              ].map(chat => (
                <button
                  key={chat.id}
                  className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between group ${
                    chat.active 
                      ? "bg-gray-800" 
                      : "hover:bg-gray-800"
                  }`}
                  onClick={startNewChat}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} />
                    <span className="text-sm truncate">{chat.title}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                    <Edit size={14} className="text-gray-400 hover:text-white" />
                    <Trash2 size={14} className="text-gray-400 hover:text-white" />
                  </div>
                </button>
              ))}
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <div className="text-xs font-medium text-gray-400 px-3 py-2">Documents</div>
              <div className="space-y-1">
                {documents.map(doc => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded-lg group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-sm truncate max-w-[150px]">{doc.name}</span>
                        <span className="text-xs text-gray-400">{doc.size} • {doc.date}</span>
                        {doc.simulated && (
                          <span className="text-xs text-yellow-400">Simulated</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => deleteDocument(doc.id, e)}
                      className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={triggerFileInput}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm mt-2"
                >
                  <Upload size={14} />
                  <span>Upload document</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.username}</div>
                <div className="text-xs text-gray-400 truncate">{user.email}</div>
              </div>
              <Settings size={16} className="text-gray-400 hover:text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-200 bg-white flex items-center px-6">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <span className="font-medium">RAG Document Assistant</span>
            {documents.length > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                ({documents.length} document{documents.length > 1 ? 's' : ''} loaded)
              </span>
            )}
            
            {/* Backend status indicator */}
            <div className={`ml-2 flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              backendStatus === "online" 
                ? "bg-green-100 text-green-800" 
                : backendStatus === "offline" 
                ? "bg-red-100 text-red-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                backendStatus === "online" 
                  ? "bg-green-500" 
                  : backendStatus === "offline" 
                  ? "bg-red-500" 
                  : "bg-yellow-500"
              }`}></div>
              {backendStatus === "online" ? "Backend Online" : 
               backendStatus === "offline" ? "Backend Offline" : 
               "Checking..."}
            </div>
          </div>
          
          {sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto w-full">
            {/* Welcome message when no messages */}
            {messages.length === 1 && messages[0].sender === "bot" && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                  <Bot size={32} className="text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">RAG Document Chatbot</h1>
                <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                  Upload documents and ask questions. Get accurate answers based on your documents.
                </p>
                
                {/* Backend status info */}
                {backendStatus === "offline" && (
                  <div className="max-w-md mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <AlertCircle size={18} />
                      <span className="font-medium">Backend Server Offline</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      The backend server is not running. You can still upload documents and chat in simulated mode, but real document analysis won't be available.
                    </p>
                    <p className="text-yellow-700 text-sm mt-2">
                      To enable full functionality, start the backend server on <code className="bg-yellow-100 px-1 rounded">http://localhost:8000</code>
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      <strong>Note:</strong> If backend is running, it might not have a /health endpoint. The app will still work when you upload a file.
                    </p>
                  </div>
                )}
                
                {/* Upload button in center */}
                <div className="max-w-md mx-auto">
                  <div 
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-white hover:bg-blue-50"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">Upload PDF Document</p>
                    <p className="text-gray-500 text-sm">Click to browse or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-2">Max file size: 10MB</p>
                  </div>
                  {uploadError && (
                    <div className="mt-3 text-red-500 text-sm bg-red-50 p-2 rounded">
                      {uploadError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`mb-6 ${msg.sender === "user" ? "text-right" : ""}`}
              >
                <div className={`inline-block max-w-[80%] ${msg.sender === "user" ? "text-right" : ""}`}>
                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Bot size={12} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Assistant</span>
                    </div>
                  )}
                  
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.sender === "bot" 
                      ? "bg-gray-100 text-gray-800" 
                      : "bg-blue-600 text-white"
                  }`}>
                    <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  </div>
                  
                  {msg.timestamp && (
                    <div className={`text-xs mt-1 px-1 ${
                      msg.sender === "bot" ? "text-gray-500" : "text-blue-600"
                    }`}>
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Bot size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Assistant</span>
                </div>
                <div className="px-4 py-3 bg-gray-100 rounded-2xl inline-block">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-gray-700">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={documents.length === 0 
                  ? "Upload a PDF document first to start chatting..." 
                  : backendStatus === "offline"
                    ? "Simulated mode - Backend offline. Type your question..."
                    : "Message RAG Assistant..."}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-white"
                rows="2"
                disabled={documents.length === 0}
              />
              
              <button 
                onClick={sendMessage}
                disabled={!input.trim() || loading || documents.length === 0}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            
            {/* Upload button in input area */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-4">
                <button 
                  onClick={triggerFileInput}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 disabled:opacity-50"
                  disabled={loading}
                >
                  <Upload size={14} />
                  <span>Upload PDF</span>
                  {loading && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                  )}
                </button>
                
                {backendStatus === "offline" && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle size={12} />
                    <span>Simulated Mode</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                {documents.length === 0 
                  ? "Upload a PDF first to start chatting" 
                  : "Press Enter to send • Shift+Enter for new line"}
              </div>
            </div>
            
            {uploadError && (
              <div className="mt-2 text-red-500 text-sm bg-red-50 p-2 rounded">
                {uploadError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}

export default ChatPage;