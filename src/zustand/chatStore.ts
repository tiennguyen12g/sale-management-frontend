// store/chatStore.ts
import { create } from "zustand";
import type { ConversationType } from "./facebookStore";
export interface ConversationType_v100 {
  _id: string;

  platform?: "facebook" | "zalo" | "tiktok" | "instagram" | string | "website" | "shopee";
  
  pageId?: string;
  pageName?: string;

  assignedStaffId?: string;
  assignedStaffName?: string;

  customerId?: string;
  customerName?: string;
  customerAvatarURL?: string;
  customerPhone?: string;

  name: string; // will remove later
  avatar: string; // will remove later
  lastMessage: string;
  lastMessageAt:string;
  unreadCount?: number;

  isMuted?: boolean;
  isPinned?: boolean;
  tags?: string[]; // e.g. ["Khách mới", "Hỏi hàng"]

  online?: boolean;
  
}
export interface ChatMessageType {
  _id: string;

  pageId?: string;
  pageName?: string;

  conversationId?: string; // is _id of ConversationType

  senderType: "customer" | "agent" | "bot" | "shop" | string;
  senderId?: string; // external id (customer) or internal staff id

  content: string;
  contentType: "text" | "image" | "video" | "file" | "sticker" | string;
  timestamp: string | Date;
  status?: "sent" | "delivered" | "seen" | "failed" | "sending";

  metadata?: {
    fileName?: string;
    fileSize?: number;
    thumbnail?: string;
    mimeType?: string;
    [k: string]: any;
  };
  replyTo?: {
    senderName: string;
    content: string;
  };
}



export interface ChatStore {
  // selectedCustomerInfo: ConversationType | null;
  // selectedConversationId: string | null;
  // setConversation: (id: string, customerInfo: ConversationType) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // selectedCustomerInfo: null,
  // selectedConversationId: null,
  // setConversation: (id, customerInfo) => set({ selectedConversationId: id, selectedCustomerInfo: customerInfo }),
}));









export interface Conversation_V2_Type {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt:string;
  unreadCount?: number;
  tags?: string[]; // e.g. ["Khách mới", "Hỏi hàng"]
  online?: boolean;
}
export interface Conversation_Data_Type {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt:string;
  unreadCount?: number;
  tags?: string[]; // e.g. ["Khách mới", "Hỏi hàng"]
  online?: boolean;
}

export interface ChatMessage_V2_Type {
  content: string;
  timestamp: string | Date;
  type?: "text" | "image" | "file"; // extend later
  senderType?: "customer" | "agent" | "shop";
  contentType?: "text" | "image" | "file";
  metadata?: {
    thumbnail: string;
  };
    replyTo?: {
    senderName: string;
    content: string;
  };
}

// data from server
export interface ChatMessage_Data_Type {
  _id: string;
  pageId: string;
  pageName: string;
  conversationId?: string;
  messageData: ChatMessage_V2_Type[];
}