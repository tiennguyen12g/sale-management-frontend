import React, { useState, useEffect, use } from "react";
import classNames from "classnames/bind";
import styles from "./PageMessage.module.scss";
const cx = classNames.bind(styles);

import Sidebar from "./SideBar";
import ChatPanel from "./ChatPanel";

import type { ConversationType, ChatMessageType } from "../../../zustand/facebookStore";
import CallPagePermission from "./CallPagePermission";
import { useAuthStore } from "../../../zustand/authStore";
import PageSelect from "./PageSelect";
import { useFacebookStore } from "../../../zustand/facebookStore";
import InitialMessageShow from "./InitialMessageShow";
export default function PageMessage() {
  const [showListPage, setShowListPage] = useState(false);
  const {
    currentConversationInfo,
    fetchFacebookPages_v2,
    pageSelected,
    setPageSelected,
    fetchFacebookPages,
    fetchConversationFromPage,
    conversations,
    messageList,
    setConversationId,
    selectedConversationId,
    sendMessageToFacebook,
  } = useFacebookStore();
  const {yourStaffId} = useAuthStore();




  const [currentPageId, setCurrentPageId] = useState<string | number | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessageType[]>([]);
  useEffect(() => {
    if (pageSelected) {
      setCurrentPageId(pageSelected.pageId);
    } else {
      setCurrentPageId(null);
    }
  }, [pageSelected]);
  useEffect(() => {
    if (selectedConversationId) {
      const msgs = messageList[selectedConversationId] || [];
      setCurrentMessages(msgs);
    } else {
      setCurrentMessages([]);
    }

  }, [selectedConversationId, messageList]);

  useEffect(() => {
    // Fetch Facebook pages when component mounts
    fetchFacebookPages_v2();
  }, [fetchFacebookPages_v2]);

  useEffect(() => {
    console.log('run');
    fetchConversationFromPage();
  }, [fetchConversationFromPage]);
  console.log('conver', conversations);
  const handleSendMessage = (conversationId: string, msg: ChatMessageType) => {
    // update messageList in store
    const existingMessages = messageList[conversationId] || [];
    const updatedMessages = [...existingMessages, msg];
    useFacebookStore.getState().setMessageList(conversationId, updatedMessages);

    // send to Facebook API
    if (currentPageId ) {
      sendMessageToFacebook(currentPageId.toString(), conversationId, msg.recipientId || "", {
        message: msg.content,
        contentType: msg.contentType,
        metadata: msg.metadata,
        _id: msg._id,
        replyTo: msg.replyTo,
        
      });
    }
  };

  const createTags = () => {

  }

  return (
    <div className={cx("main")}>
      {pageSelected === null ? (
        <InitialMessageShow />
      ) : (
        <React.Fragment>
          {showListPage && <PageSelect setShowListPage={setShowListPage} />}
          <div className={cx("header-menu")}>
            <div>
              <button className={cx("btn-decor")} onClick={() => setShowListPage(true)}>
                Danh sách shop
              </button>
              {/* <button onClick={() => }>Create Tag</button> */}
            </div>
            <div className={cx("shop-name")}>TNBT Shop</div>
            <div> </div>
          </div>

          <div className={cx("message-container")}>
            {/* Left Sidebar: Conversation List */}
            <aside className={cx("sidebar")}>
              <Sidebar conversationData={conversations} />
            </aside>

            {/* Middle Chat Section */}
            <section className={cx("chat")}>
              <ChatPanel currentPageId={currentPageId} messagesByConversation={currentMessages} onSendMessage={handleSendMessage} conversationInfo={currentConversationInfo} />
            </section>

            {/* Right Info Panel */}
            {/* Right Info Panel */}
            <aside className={cx("info-panel")}>
              <div>
                <button className={cx("btn-decor")}>Tạo đơn hàng</button>
              </div>
            </aside>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

import axios from "axios";

export async function checkNgrokConnection() {
  const ngrokUrl = "https://marceline-goadlike-pseudoprosperously.ngrok-free.dev";
  try {
    const res = await axios.get(`https://marceline-goadlike-pseudoprosperously.ngrok-free.dev/ping`, { timeout: 5000 });
    if (res.data?.success) {
      console.log(`✅ Ngrok connected successfully: ${ngrokUrl}`);
      return true;
    } else {
      console.log(`⚠️ Ngrok responded but not OK:`, res.data);
      return false;
    }
  } catch (err: any) {
    console.error(`❌ Cannot reach server via ngrok: ${ngrokUrl}`);
    console.error(err.message);
    return false;
  }
}
