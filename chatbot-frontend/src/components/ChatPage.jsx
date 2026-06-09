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
  X,
  Menu,
  AlertCircle,
  Copy,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm your RAG Document Assistant. Upload a document (PDF, DOCX, PPTX, or TXT) and ask questions about it.",
      timestamp: "Just now",
    },
  ]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadError, setUploadError] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking"); // checking, online, offline
  const [openSettings, setOpenSettings] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        username: u.username || "User",
        email: u.email || "",
        avatar: u.avatar || "",
      };
    } catch {
      return { username: "User", email: "", avatar: "" };
    }
  });
  const [appSettings, setAppSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("appSettings") || "{}");
    } catch {
      return {};
    }
  });
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Use local backend in dev (via .env), fall back to deployed backend in prod
  const API_URL = import.meta.env.VITE_API_URL || "https://chatbot-eo65.onrender.com";

  // Check backend status - FIXED: Try multiple endpoints
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try multiple endpoints since /health might not exist
        const API = import.meta.env.VITE_API_URL;
        const endpoints = [
          `${API}/`,
          `${API}/docs`,
          `${API}/redoc`
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
          const response = await fetch('https://chatbot-eo65.onrender.com/health', {
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

  // Auto-scroll to bottom (gated by setting)
  useEffect(() => {
    if (appSettings.autoScroll === false) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, appSettings.autoScroll]);

  // Handle PDF upload with better error handling
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset file input so same file can be uploaded again
    e.target.value = null;
    
    const allowedExtensions = [".pdf", ".docx", ".pptx", ".txt"];
    const fileName = (file.name || "").toLowerCase();
    const ext = fileName.slice(fileName.lastIndexOf("."));
    if (!allowedExtensions.includes(ext)) {
      if ([".doc", ".ppt"].includes(ext)) {
        setUploadError(`Legacy ${ext} is not supported — please save as ${ext}x.`);
      } else {
        setUploadError("Supported formats: PDF, DOCX, PPTX, TXT");
      }
      setTimeout(() => setUploadError(""), 4000);
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
      const response = await fetch(`${API_URL}/upload/pdf`, {
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


//

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
      alert("Please upload a document first (PDF, DOCX, PPTX, or TXT)");
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
            text: `🧪 **Simulated Response**\n\n${randomResponse}\n\n*Status: Backend server not detected. To enable real document Q&A, start the backend on https://chatbot-eo65.onrender.com*`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          // filter the bot message.text
          setMessages(prev => [...prev, botMsg]);
          setLoading(false);
        }, 1000);
        return;
      }
      
      // Call backend API for real response
      const response = await fetch(`${API_URL}/chat/ai`, {
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
       let aiResponse = data.ai_response || 
                 data.response || 
                 data.answer || 
                 data.message || 
                 data.detail ||
                 "I received your message but couldn't generate a proper response.";

// ✅ CLEAN + ADD SPACING
aiResponse = cleanAIResponse(aiResponse);

 
  
  
        
        // Add AI response
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: aiResponse,
          source: data.source || "",
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
        text: `⚠️ **Connection Issue**\n\nFailed to connect to backend: ${error.message}\n\nFalling back to simulated mode. Please check:\n1. Backend server is running on https://chatbot-eo65.onrender.com\n2. CORS is properly configured\n3. API endpoints are correct`,
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
      text: "Hello! I'm your RAG Document Assistant. Upload a document (PDF, DOCX, PPTX, or TXT) and ask questions about it.",
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
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const saveProfile = (next) => {
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem("user") || "{}"); }
      catch { return {}; }
    })();
    const merged = { ...stored, ...next };
    localStorage.setItem("user", JSON.stringify(merged));
    setProfile({
      username: merged.username || "User",
      email: merged.email || "",
      avatar: merged.avatar || "",
    });
  };

  const saveSettings = (next) => {
    const merged = { ...appSettings, ...next };
    localStorage.setItem("appSettings", JSON.stringify(merged));
    setAppSettings(merged);
  };

  const user = profile;

// Collapse runs of 3+ identical letters — a PDF/PPTX extraction artifact
// that duplicates characters, e.g. "TTTThhhhrrrreeeeeeee" -> "Three".
// (No English word has a letter 3+ times in a row, so legit doubles like
// "oo"/"ll" are preserved.)
const dedupeRepeatedChars = (text) =>
  (text || "").replace(/([A-Za-z])\1{2,}/g, "$1");

const cleanAIResponse = (text) => {
  if (!text) return "";
  let out = dedupeRepeatedChars(text)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[a-zA-Z][^>]*>/g, "")
    .replace(/\r\n/g, "\n");

  // Strip markdown table separator lines like |---|---|
  out = out.replace(/^\s*\|?[-:\s|]{3,}\|?\s*$/gm, "");
  // Convert table rows (| a | b | c |) into bullet-style "a — b — c"
  out = out.replace(/^\s*\|(.+)\|\s*$/gm, (_, row) =>
    row
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)
      .join(" — ")
  );
  // Any remaining stray pipes
  out = out.replace(/\s*\|\s*/g, " ");

  // Remove markdown emphasis but keep inner text
  out = out
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/(^|\s)\*(?!\s)([^*\n]+?)\*(?=\s|$|[.,;:!?])/g, "$1$2")
    .replace(/(^|\s)_(?!\s)([^_\n]+?)_(?=\s|$|[.,;:!?])/g, "$1$2");

  // Remove headings markers
  out = out.replace(/^#{1,6}\s+/gm, "");

  // Strip code fencing / inline code
  out = out.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""));
  out = out.replace(/`+([^`]+)`+/g, "$1");

  // Strip LaTeX commands and math delimiters
  out = out.replace(/\$\$([\s\S]*?)\$\$/g, "$1");
  out = out.replace(/\$([^$\n]+)\$/g, "$1");
  out = out.replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, "");
  out = out.replace(/[{}]/g, "");

  // Horizontal rules / divider-only lines
  out = out.replace(/^\s*[-=_*]{3,}\s*$/gm, "");

  // Normalize bullet markers to "- "
  out = out.replace(/^[ \t]*[•●◦▪]\s*/gm, "- ");

  // Cleanup whitespace
  out = out
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((l) => l.replace(/[ \t]{2,}/g, " ").trimEnd())
    .join("\n")
    .trim();

  return out;
};


  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Sidebar */}
      {sidebarOpen && (
        <div className="w-56 bg-[#0b0b12] text-white flex flex-col overflow-hidden shrink-0 border-r border-white/10">
          {/* Brand */}
          <div className="px-4 min-h-[68px] flex items-center gap-2.5 border-b border-white/10 shrink-0">
            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1.5 rounded-lg shadow-lg shadow-fuchsia-600/30">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold tracking-tight text-white">
              DocuChat <span className="text-gradient">AI</span>
            </span>
          </div>

          {/* New Chat Button */}
          <div className="px-3 pt-3 pb-2">
            <button
              onClick={startNewChat}
              className="btn-grad w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="px-3 pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">History</div>
            <div className="px-3 py-2 flex items-center gap-2 text-xs text-slate-500">
              <MessageSquare size={14} className="shrink-0" />
              <span>No conversations yet</span>
            </div>

            {/* Documents Section */}
            <div className="mt-5">
              <div className="px-3 pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Documents</div>
              <div className="space-y-1">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/5 border border-white/10 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-fuchsia-500/15 flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-fuchsia-400" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm truncate max-w-[130px]">{doc.name}</span>
                        <span className="text-xs text-slate-500 truncate">
                          {doc.size} • {doc.date}{doc.simulated ? " • Simulated" : ""}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteDocument(doc.id, e)}
                      className="p-1 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={triggerFileInput}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 border border-dashed border-white/15 transition"
                >
                  <Upload size={15} />
                  <span>Upload document</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="px-3 border-t border-white/10 min-h-[68px] flex items-center shrink-0">
            <div className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center overflow-hidden shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.username}</div>
                <div className="text-xs text-slate-400 truncate">{user.email}</div>
              </div>
              <div className="relative">
                <Settings
                  size={16}
                  className="text-slate-400 hover:text-white cursor-pointer"
                  onClick={() => setOpenSettings(!openSettings)}
                />

                {openSettings && (
                  <div className="absolute bottom-10 right-0 bg-[#0e0e1a] shadow-lg rounded-lg p-1 w-44 border border-white/10 z-50">
                    <button
                      onClick={() => {
                        setShowProfile(true);
                        setOpenSettings(false);
                      }}
                      className="w-full text-left p-2 hover:bg-fuchsia-500/10 rounded cursor-pointer text-sm flex items-center gap-2"
                    >
                      <User size={14} />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowSettings(true);
                        setOpenSettings(false);
                      }}
                      className="w-full text-left p-2 hover:bg-fuchsia-500/10 rounded cursor-pointer text-sm flex items-center gap-2"
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-2 hover:bg-red-500/10 text-red-400 rounded cursor-pointer text-sm flex items-center gap-2"
                    >
                      <X size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <div className="min-h-[68px] border-b border-white/10 flex items-center px-6 shrink-0">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="mr-4 p-2 hover:bg-white/10 rounded-lg"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-600 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <span className="font-medium">RAG Document Assistant</span>
            {documents.length > 0 && (
              <span className="text-sm text-slate-400 ml-2">
                ({documents.length} document{documents.length > 1 ? 's' : ''} loaded)
              </span>
            )}
          </div>
          
          {sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-2 hover:bg-white/10 rounded-lg"
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
              <div className="text-center py-6 animate-fade-up">
                {/* Glowing gradient orb */}
                <div className="relative w-20 h-20 mx-auto mb-5 animate-floaty">
                  <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-fuchsia-600/40 via-violet-600/30 to-indigo-600/40 blur-3xl orb-glow" />
                  <div className="absolute inset-0 rounded-full orb overflow-hidden shadow-2xl shadow-fuchsia-700/40">
                    <div className="absolute inset-0 rounded-full orb-spin" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  Hi, <span className="text-gradient">{user.username}</span>
                </h1>
                <p className="text-slate-400 text-base mb-7 max-w-xl mx-auto">
                  Upload a document and ask anything — get accurate answers grounded in your content.
                </p>
                
                {/* Backend status info */}
                {backendStatus === "offline" && (
                  <div className="max-w-md mx-auto mb-6 p-4 bg-fuchsia-500/10 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-300 mb-2">
                      <AlertCircle size={18} />
                      <span className="font-medium">Backend Server Offline</span>
                    </div>
                    <p className="text-fuchsia-300 text-sm">
                      The backend server is not running. You can still upload documents and chat in simulated mode, but real document analysis won't be available.
                    </p>
                    <p className="text-fuchsia-300 text-sm mt-2">
                      To enable full functionality, start the backend server on <code className="bg-fuchsia-500/10 px-1 rounded">https://chatbot-eo65.onrender.com</code>
                    </p>
                    <p className="text-fuchsia-300 text-sm mt-1">
                      <strong>Note:</strong> If backend is running, it might not have a /health endpoint. The app will still work when you upload a file.
                    </p>
                  </div>
                )}
                
                {/* Soft gradient quick-action tiles */}
                <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
                  {[
                    { icon: <Upload size={18} />, title: "Upload Document", desc: "PDF, DOCX, PPTX, TXT", grad: "from-fuchsia-500 to-purple-600" },
                    { icon: <MessageSquare size={18} />, title: "Ask Questions", desc: "Chat with your file", grad: "from-blue-500 to-cyan-500" },
                    { icon: <FileText size={18} />, title: "Get Summary", desc: "Instant overview", grad: "from-violet-500 to-indigo-600" },
                  ].map((tile, i) => (
                    <button
                      key={i}
                      onClick={triggerFileInput}
                      className={`group relative overflow-hidden rounded-xl p-3.5 text-left glass hover:-translate-y-0.5 transition-all duration-300 ${i === 2 ? "col-span-2" : ""}`}
                    >
                      <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br ${tile.grad} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
                      <div className={`relative w-9 h-9 rounded-lg bg-gradient-to-br ${tile.grad} flex items-center justify-center text-white shadow-lg mb-2.5`}>
                        {tile.icon}
                      </div>
                      <div className="relative font-semibold text-white text-sm">{tile.title}</div>
                      <div className="relative text-xs text-slate-400 mt-0.5">{tile.desc}</div>
                    </button>
                  ))}
                </div>
                {uploadError && (
                  <div className="max-w-xl mx-auto mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl">
                    {uploadError}
                  </div>
                )}
              </div>
            )}

            {/* Messages (hidden while the welcome screen is showing) */}
            {!(messages.length === 1 && messages[0].sender === "bot") && messages.map(msg => (
              <div 
                key={msg.id} 
                className={`${appSettings.compactMode ? "mb-2" : "mb-6"} ${msg.sender === "user" ? "text-right" : ""}`}
              >
                <div className={`inline-block max-w-[80%] ${msg.sender === "user" ? "text-right" : ""}`}>
                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-fuchsia-600 flex items-center justify-center">
                        <Bot size={12} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-200">Assistant</span>
                    </div>
                  )}
                  
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.sender === "bot"
                      ? "bg-white/10 text-white"
                      : "bg-fuchsia-600 text-white"
                  }`}>
                    <PlainTextResponse text={msg.text} />
                  </div>

                  {msg.sender === "bot" && msg.source && (
                    <div className="mt-2 p-2 bg-white/5 border border-white/10 rounded text-xs text-slate-400">
                      Source: {dedupeRepeatedChars(msg.source)}
                    </div>
                  )}

                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-3 mt-1 text-slate-400">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cleanAIResponse(msg.text));
                          setCopiedId(msg.id);
                          setTimeout(() => setCopiedId(null), 1200);
                        }}
                        className="flex items-center gap-1 text-xs hover:text-white cursor-pointer"
                        title="Copy response"
                      >
                        <Copy size={14} />
                        {copiedId === msg.id && (
                          <span className="text-emerald-400">Copied</span>
                        )}
                      </button>
                    </div>
                  )}


        
                  {msg.timestamp && appSettings.showTimestamps !== false && (
                    <div className="text-xs mt-1 px-1 text-slate-400">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-fuchsia-600 flex items-center justify-center">
                    <Bot size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">Assistant</span>
                </div>
                <div className="px-5 py-4 glass rounded-2xl inline-block">
                  <div className="flex items-center gap-1.5">
                    <span className="dot w-2 h-2 rounded-full bg-fuchsia-400"></span>
                    <span className="dot w-2 h-2 rounded-full bg-violet-400"></span>
                    <span className="dot w-2 h-2 rounded-full bg-pink-400"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 px-4 shrink-0 min-h-[68px] flex flex-col justify-center">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2 glass rounded-2xl px-2.5 py-1.5 focus-within:border-fuchsia-500/50 focus-within:ring-4 focus-within:ring-fuchsia-500/10 transition">
              <button
                onClick={triggerFileInput}
                disabled={loading}
                title="Upload document"
                className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
              >
                <Upload size={18} />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={documents.length === 0
                  ? "Upload a document first to start chatting..."
                  : backendStatus === "offline"
                    ? "Simulated mode — type your question..."
                    : "Ask anything about your document..."}
                className="flex-1 bg-transparent border-0 outline-none resize-none py-2 min-h-[24px] max-h-40 text-white placeholder-slate-500 text-sm leading-relaxed"
                rows="1"
                disabled={documents.length === 0}
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading || documents.length === 0}
                className="btn-grad shrink-0 p-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send"
              >
                <Send size={18} />
              </button>
            </div>
            
            {/* Hint row */}
            <div className="flex justify-center items-center gap-3 mt-1.5 text-xs text-slate-500">
              {loading && (
                <span className="flex items-center gap-1.5 text-fuchsia-300">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-fuchsia-400"></span>
                  Working...
                </span>
              )}
              {backendStatus === "offline" && (
                <span className="flex items-center gap-1 text-amber-300">
                  <AlertCircle size={12} /> Simulated Mode
                </span>
              )}
              <span>
                {documents.length === 0
                  ? "Upload a document to start chatting"
                  : "Press Enter to send · Shift+Enter for new line"}
              </span>
            </div>
            
            {uploadError && (
              <div className="mt-2 text-red-400 text-sm bg-red-500/10 p-2 rounded">
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
        accept=".pdf,.docx,.pptx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          profile={profile}
          onSave={(next) => {
            saveProfile(next);
            setShowProfile(false);
          }}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={appSettings}
          backendStatus={backendStatus}
          onSave={(next) => {
            saveSettings(next);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Plain Text Response — renders AI text as clean paragraphs
// and dash-bulleted lists. No markdown, no tables, no LaTeX.
// ───────────────────────────────────────────────────────────
function PlainTextResponse({ text }) {
  if (!text) return null;

  const lines = String(text).split("\n");
  const blocks = [];
  let buffer = [];
  let bulletBuffer = [];

  const flushPara = () => {
    if (buffer.length) {
      blocks.push({ type: "p", content: buffer.join(" ") });
      buffer = [];
    }
  };
  const flushList = () => {
    if (bulletBuffer.length) {
      blocks.push({ type: "ul", items: bulletBuffer });
      bulletBuffer = [];
    }
  };

  const isHeadingLike = (line, nextLine) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (trimmed.length > 70) return false;
    if (/[.:;,]$/.test(trimmed)) return false;
    const nextBlank = !nextLine || !nextLine.trim();
    return nextBlank && trimmed.split(/\s+/).length <= 10;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      flushList();
      flushPara();
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      flushPara();
      bulletBuffer.push(line.replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, ""));
      continue;
    }

    if (bulletBuffer.length) flushList();

    if (isHeadingLike(raw, lines[i + 1])) {
      flushPara();
      blocks.push({ type: "h", content: line });
      continue;
    }

    buffer.push(line);
  }
  flushList();
  flushPara();

  return (
    <div className="text-left text-sm leading-relaxed text-white space-y-2">
      {blocks.map((b, i) => {
        if (b.type === "h") {
          return (
            <div key={i} className="font-semibold text-white pt-1">
              {b.content}
            </div>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="list-disc pl-5 space-y-0.5">
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {b.content}
          </p>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Profile Modal — edit username, email, avatar
// ───────────────────────────────────────────────────────────
function ProfileModal({ profile, onSave, onClose }) {
  const [username, setUsername] = useState(profile.username || "");
  const [email, setEmail] = useState(profile.email || "");
  const [avatar, setAvatar] = useState(profile.avatar || "");
  const [error, setError] = useState("");
  const avatarInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Name is required.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    onSave({
      username: username.trim(),
      email: email.trim(),
      avatar: avatar || "",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#0e0e1a] rounded-xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-600 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="font-semibold text-white">Edit Profile</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 rounded-full bg-fuchsia-500/10 border-2 border-fuchsia-500/40 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90"
              onClick={() => avatarInputRef.current?.click()}
              title="Click to change"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-fuchsia-300" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="text-fuchsia-300 hover:text-amber-300 font-medium"
              >
                Upload photo
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar("")}
                  className="text-slate-400 hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none text-sm"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none text-sm"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex justify-end gap-2 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Settings Modal — preferences and account actions
// ───────────────────────────────────────────────────────────
function SettingsModal({ settings, backendStatus, onSave, onClose, onLogout }) {
  const [showTimestamps, setShowTimestamps] = useState(
    settings.showTimestamps !== false
  );
  const [autoScroll, setAutoScroll] = useState(settings.autoScroll !== false);
  const [compactMode, setCompactMode] = useState(!!settings.compactMode);

  const handleSave = () => {
    onSave({ showTimestamps, autoScroll, compactMode });
  };

  const Toggle = ({ checked, onChange, label, description }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-white/5 text-left"
    >
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {description && (
          <div className="text-xs text-slate-400 mt-0.5">{description}</div>
        )}
      </div>
      <div
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-fuchsia-600" : "bg-white/20"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-[#0e0e1a] rounded-full shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0e0e1a] rounded-xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-600 flex items-center justify-center">
              <Settings size={16} className="text-white" />
            </div>
            <div className="font-semibold text-white">Settings</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-2 pb-1">
            Chat Preferences
          </div>
          <Toggle
            checked={showTimestamps}
            onChange={setShowTimestamps}
            label="Show timestamps"
            description="Display time next to each message"
          />
          <Toggle
            checked={autoScroll}
            onChange={setAutoScroll}
            label="Auto-scroll to new messages"
            description="Automatically scroll down when responses arrive"
          />
          <Toggle
            checked={compactMode}
            onChange={setCompactMode}
            label="Compact mode"
            description="Reduce padding between messages"
          />

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 pt-4 pb-1">
            System
          </div>
          <div className="flex items-center justify-between px-3 py-2 text-sm">
            <span className="text-slate-200">Backend</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                backendStatus === "online"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : backendStatus === "offline"
                  ? "bg-red-400/20 text-red-300"
                  : "bg-fuchsia-500/10 text-fuchsia-300"
              }`}
            >
              {backendStatus}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 rounded-lg"
          >
            Log out
          </button>
        </div>

        <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex justify-end gap-2 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-200 hover:bg-white/10 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;