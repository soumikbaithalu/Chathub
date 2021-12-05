import "./Chat.css";

import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import AssignmentIcon from "@material-ui/icons/Assignment";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import firebase from "firebase";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import db from "./firebase";
import { storage } from "./firebase";
import { useStateValue } from "./StateProvider";
import CloseIcon from "@material-ui/icons/Close";
import { DropzoneDialogBase } from "material-ui-dropzone";

function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const [showEmoji, setEMoji] = useState(false);

  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  const upload = () => {
    if (fileObjects == null) return;
    storage
      .ref(`/files/${fileObjects}`)
      .put(fileObjects)
      .on("state_changed", alert("success"), alert);
  };

  const dialogTitle = () => (
    <>
      <span>Upload file</span>
      <IconButton
        style={{ right: "12px", top: "8px", position: "absolute" }}
        onClick={() => setOpen(false)}
      >
        <CloseIcon />
      </IconButton>
    </>
  );

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  useEffect(() => {
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  });
  const toggleEMoji = () => {
    sEmoji();
  };
  const sEmoji = (e) => {
    setEMoji(!showEmoji);
  };
  const addEmoji = (e) => {
    sEmoji();
    let emoji = e.native;
    setInput(input + emoji);
  };
  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  const copyToClipBoard = (e) => {
    e.preventDefault();
    inputRef.current.select();
    document.execCommand("copy");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3 className="chat-room-name">{roomName}</h3>
          <p className="chat-room-last-seen">
            Last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>

          <IconButton onClick={() => setOpen(true)}>
            <AttachFile />
          </IconButton>
          <DropzoneDialogBase
            dialogTitle={dialogTitle()}
            acceptedFiles={[]}
            fileObjects={fileObjects}
            cancelButtonText={"cancel"}
            submitButtonText={"submit"}
            maxFileSize={5000000}
            open={open}
            onAdd={(newFileObjs) => {
              console.log("onAdd", newFileObjs);
              setFileObjects([].concat(fileObjects, newFileObjs));
            }}
            onDelete={(deleteFileObj) => {
              console.log("onDelete", deleteFileObj);
            }}
            onClose={() => setOpen(false)}
            onSave={() => {
              console.log("onSave", fileObjects);
              upload();
              setOpen(false);
            }}
            showPreviews={true}
            showFileNamesInPreview={true}
          />
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body" ref={chatBodyRef}>
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__receiver"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            {/*{fileObjects.length > 0 && (
              <div className="chat__name">
                {message.name}
                {fileObjects.length}
              </div>
            )}*/}
            <span className="chat__timestamp">
              {" "}
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        {showEmoji ? (
          <Picker onSelect={addEmoji} emojiTooltip={true} title="Chathub" />
        ) : null}
        <button
          type="button"
          style={{ cursor: "pointer", background: "none" }}
          className="toggle-emoji"
          onClick={toggleEMoji}
        >
          <InsertEmoticonIcon />
        </button>
        <form>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button type="submit" onClick={sendMessage}>
            {" "}
            Send a Message
          </button>
        </form>

        <Tooltip title="Copy">
          <AssignmentIcon onClick={copyToClipBoard} />
        </Tooltip>

        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
