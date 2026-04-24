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
  AlertCircle,
  Copy,
  Network
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
  const [mindMapData, setMindMapData] = useState(null);
  const [mindMapTitle, setMindMapTitle] = useState("");
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

  // Check backend status - FIXED: Try multiple endpoints
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try multiple endpoints since /health might not exist
        const endpoints = [
          'https://chatbot-eo65.onrender.com/',
          'https://chatbot-eo65.onrender.com/docs',
          'https://chatbot-eo65.onrender.com/redoc'
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
      const response = await fetch('https://chatbot-eo65.onrender.com/upload/pdf', {
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
      const response = await fetch('https://chatbot-eo65.onrender.com/chat/ai', {
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

const cleanAIResponse = (text) => {
  if (!text) return "";
  let out = text
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

// Parse plain-text AI response into a mind map tree.
// Headings (short terminal-punctuation-free lines followed by a blank line)
// become branches; dash / numbered bullets become children.
const parseTextToMindMap = (text) => {
  if (!text) return null;

  const cleaned = cleanAIResponse(text);
  const rawLines = cleaned.split("\n");
  if (!rawLines.length) return null;

  const clip = (s, n) => {
    const t = (s || "").trim().replace(/[:.]$/, "");
    return t.length > n ? t.slice(0, n - 1) + "…" : t;
  };

  const isBullet = (l) => /^[-*]\s+/.test(l) || /^\d+[.)]\s+/.test(l);
  const stripBullet = (l) => l.replace(/^[-*]\s+/, "").replace(/^\d+[.)]\s+/, "");

  const isHeadingLike = (line, next) => {
    const t = line.trim();
    if (!t || isBullet(t)) return false;
    if (t.length > 70) return false;
    if (/[.;,]$/.test(t)) return false;
    const nextBlank = !next || !next.trim();
    return nextBlank && t.split(/\s+/).length <= 10;
  };

  // Pick root: first heading-like line, else first short line
  let root = "Summary";
  for (let i = 0; i < rawLines.length; i++) {
    const l = rawLines[i].trim();
    if (!l) continue;
    if (isHeadingLike(rawLines[i], rawLines[i + 1])) {
      root = clip(l, 60);
      break;
    }
    if (l.length < 70 && !isBullet(l)) {
      root = clip(l, 60);
      break;
    }
  }

  const branches = [];
  let current = null;
  let rootUsed = false;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    const line = raw.trim();
    if (!line) continue;

    if (!rootUsed && clip(line, 60) === root) {
      rootUsed = true;
      continue;
    }

    if (isBullet(line)) {
      const child = clip(stripBullet(line), 70);
      if (!child) continue;
      if (current) current.children.push({ label: child });
      else branches.push({ label: child, children: [] });
      continue;
    }

    if (isHeadingLike(raw, rawLines[i + 1])) {
      current = { label: clip(line, 70), children: [] };
      branches.push(current);
      continue;
    }

    // Long prose paragraph → use first short phrase as a branch
    if (line.length < 90) {
      current = { label: clip(line, 70), children: [] };
      branches.push(current);
    } else if (current) {
      const snippet = line.split(/[.;]/)[0];
      current.children.push({ label: clip(snippet, 70) });
    } else {
      current = { label: clip(line.split(/[.;]/)[0], 70), children: [] };
      branches.push(current);
    }
  }

  if (!branches.length) return null;

  const trimmed = branches.slice(0, 8).map((b) => ({
    ...b,
    children: (b.children || []).slice(0, 5),
  }));

  return { root, branches: trimmed };
};



  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-white text-gray-800 flex flex-col h-full border-r border-gray-200">
          {/* New Chat Button */}
          <div className="p-3 border-b border-gray-800">
            <button 
              onClick={startNewChat}
className="w-full flex items-center gap-2 px-3 py-2 bg-white hover:bg-yellow-100 text-black border border-yellow-200 rounded-lg text-sm mt-2"            >
              <Plus size={18} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">Recent Chats</div>
            <div className="space-y-1">
              {[
                { id: 1, title: "New Chat", date: "Today", active: true },
                { id: 2, title: "Research Paper", date: "Yesterday", active: true },
                { id: 3, title: "Document Q&A", date: "Jan 15", active: true },
              ].map(chat => (
                <button
                  key={chat.id}
                  className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between group ${
                    chat.active 
  ? "bg-yellow-400 text-black" 
  : "bg-white hover:bg-yellow-100  border-yellow-200"
                  }`}
                  onClick={startNewChat}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} />
                    <span className="text-sm truncate">{chat.title}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                    <Edit size={14} className="text-gray-500 hover:text-white" />
                    <Trash2 size={14} className="text-gray-500 hover:text-white" />
                  </div>
                </button>
              ))}
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <div className="text-xs font-medium text-gray-500 px-3 py-2">Documents</div>
              <div className="space-y-1">
                {documents.map(doc => (
                  <div 
                    key={doc.id}
className="flex items-center justify-between px-3 py-2 bg-white hover:bg-yellow-100 text-black border border-yellow-200 rounded-lg group"                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-yellow-400" />
                      <div className="flex flex-col">
                        <span className="text-sm truncate max-w-[150px]">{doc.name}</span>
                        <span className="text-xs text-gray-500">{doc.size} • {doc.date}</span>
                        {doc.simulated && (
                          <span className="text-xs text-yellow-400">Simulated</span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={(e) => deleteDocument(doc.id, e)}
                      className="p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={triggerFileInput}
       className="flex items-center justify-between px-3 py-2 bg-yellow hover:bg-yellow-100 text-black border border-yellow-200 rounded-lg group"         >
                  <Upload size={14} />
                  <span>Upload document</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-yellow-100 text-black">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden">
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
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
              <div className="relative">
                <Settings
                  size={16}
                  className="text-gray-500 hover:text-black cursor-pointer"
                  onClick={() => setOpenSettings(!openSettings)}
                />

                {openSettings && (
                  <div className="absolute bottom-10 right-0 bg-white shadow-lg rounded-lg p-1 w-44 border border-gray-200 z-50">
                    <button
                      onClick={() => {
                        setShowProfile(true);
                        setOpenSettings(false);
                      }}
                      className="w-full text-left p-2 hover:bg-yellow-50 rounded cursor-pointer text-sm flex items-center gap-2"
                    >
                      <User size={14} />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowSettings(true);
                        setOpenSettings(false);
                      }}
                      className="w-full text-left p-2 hover:bg-yellow-50 rounded cursor-pointer text-sm flex items-center gap-2"
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left p-2 hover:bg-red-50 text-red-500 rounded cursor-pointer text-sm flex items-center gap-2"
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
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
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
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
                  <Bot size={32} className="text-yellow-500" />
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
                      To enable full functionality, start the backend server on <code className="bg-yellow-100 px-1 rounded">https://chatbot-eo65.onrender.com</code>
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
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-yellow-500 transition-colors cursor-pointer bg-white hover:bg-yellow-50"
                  >
                    <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-2">Upload Document</p>
                    <p className="text-gray-500 text-sm">Click to browse or drag & drop</p>
                    <p className="text-xs text-gray-500 mt-2">PDF, DOCX, PPTX, TXT · Max 10MB</p>
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
                className={`${appSettings.compactMode ? "mb-2" : "mb-6"} ${msg.sender === "user" ? "text-right" : ""}`}
              >
                <div className={`inline-block max-w-[80%] ${msg.sender === "user" ? "text-right" : ""}`}>
                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                        <Bot size={12} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Assistant</span>
                    </div>
                  )}
                  
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.sender === "bot"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-400 text-black"
                  }`}>
                    <PlainTextResponse text={msg.text} />
                  </div>

                  {msg.sender === "bot" && msg.source && (
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                      Source: {msg.source}
                    </div>
                  )}

                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-3 mt-1 text-gray-500">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cleanAIResponse(msg.text));
                          setCopiedId(msg.id);
                          setTimeout(() => setCopiedId(null), 1200);
                        }}
                        className="flex items-center gap-1 text-xs hover:text-black cursor-pointer"
                        title="Copy response"
                      >
                        <Copy size={14} />
                        {copiedId === msg.id && (
                          <span className="text-green-500">Copied</span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          const data = parseTextToMindMap(msg.text);
                          if (data) {
                            setMindMapData(data);
                            setMindMapTitle(data.root);
                          }
                        }}
                        className="flex items-center gap-1 text-xs hover:text-yellow-600 cursor-pointer"
                        title="Generate mind map"
                      >
                        <Network size={14} />
                        <span>Mind Map</span>
                      </button>
                    </div>
                  )}


        
                  {msg.timestamp && appSettings.showTimestamps !== false && (
                    <div className="text-xs mt-1 px-1 text-gray-500">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Bot size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Assistant</span>
                </div>
                <div className="px-4 py-3 bg-gray-100 rounded-2xl inline-block">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
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
                  ? "Upload a document first to start chatting..."
                  : backendStatus === "offline"
                    ? "Simulated mode - Backend offline. Type your question..."
                    : "Message RAG Assistant..."}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none resize-none bg-white"
                rows="2"
                disabled={documents.length === 0}
              />
              
              <button 
  onClick={sendMessage}
  disabled={!input.trim() || loading || documents.length === 0}
  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
  <Send size={18} className="text-black" />
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
                  <span>Upload Document</span>
                  {loading && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400"></div>
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
                  ? "Upload a document first to start chatting"
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
        accept=".pdf,.docx,.pptx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Mind Map Modal */}
      {mindMapData && (
        <MindMapModal
          data={mindMapData}
          title={mindMapTitle}
          onClose={() => setMindMapData(null)}
        />
      )}

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
    <div className="text-left text-sm leading-relaxed text-gray-800 space-y-2">
      {blocks.map((b, i) => {
        if (b.type === "h") {
          return (
            <div key={i} className="font-semibold text-gray-900 pt-1">
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
// Mind Map Modal Component
// ───────────────────────────────────────────────────────────
function MindMapModal({ data, title, onClose }) {
  const { root, branches } = data;

  // Layout calculations
  const rowHeight = 90;
  const rootX = 40;
  const rootW = 220;
  const branchX = 340;
  const branchW = 240;
  const childX = 640;
  const childW = 220;

  const totalRows = branches.reduce(
    (acc, b) => acc + Math.max(1, (b.children || []).length),
    0
  );
  const height = Math.max(400, totalRows * rowHeight + 80);
  const width = childX + childW + 60;

  // Compute y positions for branches and children
  let cursor = 60;
  const layout = branches.map((b) => {
    const childCount = Math.max(1, (b.children || []).length);
    const branchTop = cursor;
    const branchBottom = cursor + childCount * rowHeight;
    const branchY = (branchTop + branchBottom) / 2;
    const children = (b.children || []).map((c, i) => ({
      ...c,
      y: branchTop + i * rowHeight + rowHeight / 2,
    }));
    cursor = branchBottom;
    return { ...b, y: branchY, children };
  });

  const rootY = height / 2;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <Network size={16} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Mind Map</div>
              <div className="text-xs text-gray-500 truncate max-w-md">
                {title}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gradient-to-br from-yellow-50 to-white p-6">
          <svg width={width} height={height} style={{ minWidth: width }}>
            {/* Root → Branch curves */}
            {layout.map((b, i) => {
              const x1 = rootX + rootW;
              const y1 = rootY;
              const x2 = branchX;
              const y2 = b.y;
              const mx = (x1 + x2) / 2;
              return (
                <path
                  key={`r-${i}`}
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  stroke="#eab308"
                  strokeWidth="2.5"
                  fill="none"
                />
              );
            })}

            {/* Branch → Child curves */}
            {layout.map((b, i) =>
              (b.children || []).map((c, j) => {
                const x1 = branchX + branchW;
                const y1 = b.y;
                const x2 = childX;
                const y2 = c.y;
                const mx = (x1 + x2) / 2;
                return (
                  <path
                    key={`c-${i}-${j}`}
                    d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                  />
                );
              })
            )}

            {/* Root node */}
            <g>
              <rect
                x={rootX}
                y={rootY - 36}
                width={rootW}
                height={72}
                rx="14"
                fill="#facc15"
                stroke="#ca8a04"
                strokeWidth="2"
              />
              <foreignObject
                x={rootX + 8}
                y={rootY - 32}
                width={rootW - 16}
                height={64}
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  className="w-full h-full flex items-center justify-center text-center text-sm font-bold text-black px-2"
                >
                  {root}
                </div>
              </foreignObject>
            </g>

            {/* Branch nodes */}
            {layout.map((b, i) => (
              <g key={`bn-${i}`}>
                <rect
                  x={branchX}
                  y={b.y - 28}
                  width={branchW}
                  height={56}
                  rx="10"
                  fill="#fef3c7"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <foreignObject
                  x={branchX + 8}
                  y={b.y - 24}
                  width={branchW - 16}
                  height={48}
                >
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    className="w-full h-full flex items-center justify-center text-center text-xs font-semibold text-gray-800 px-1"
                  >
                    {b.label}
                  </div>
                </foreignObject>
              </g>
            ))}

            {/* Child nodes */}
            {layout.map((b, i) =>
              (b.children || []).map((c, j) => (
                <g key={`cn-${i}-${j}`}>
                  <rect
                    x={childX}
                    y={c.y - 20}
                    width={childW}
                    height={40}
                    rx="8"
                    fill="#fffbeb"
                    stroke="#fde68a"
                    strokeWidth="1"
                  />
                  <foreignObject
                    x={childX + 6}
                    y={c.y - 18}
                    width={childW - 12}
                    height={36}
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className="w-full h-full flex items-center justify-center text-center text-[11px] text-gray-700 px-1 leading-tight"
                    >
                      {c.label}
                    </div>
                  </foreignObject>
                </g>
              ))
            )}
          </svg>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {branches.length} branches •{" "}
            {branches.reduce((a, b) => a + (b.children?.length || 0), 0)} leaves
          </span>
          <span>Scroll to pan · Click outside to close</span>
        </div>
      </div>
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
        className="bg-white rounded-xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="font-semibold text-gray-900">Edit Profile</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 rounded-full bg-yellow-100 border-2 border-yellow-300 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90"
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
                <User size={40} className="text-yellow-600" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="text-yellow-700 hover:text-yellow-800 font-medium"
              >
                Upload photo
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar("")}
                  className="text-gray-500 hover:text-red-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg font-medium"
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
      className="w-full flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 text-left"
    >
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
        )}
      </div>
      <div
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-yellow-400" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
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
        className="bg-white rounded-xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
              <Settings size={16} className="text-white" />
            </div>
            <div className="font-semibold text-gray-900">Settings</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 pt-2 pb-1">
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

          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 pt-4 pb-1">
            System
          </div>
          <div className="flex items-center justify-between px-3 py-2 text-sm">
            <span className="text-gray-700">Backend</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                backendStatus === "online"
                  ? "bg-green-100 text-green-700"
                  : backendStatus === "offline"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {backendStatus}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            Log out
          </button>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;