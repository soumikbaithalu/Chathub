import "./Chat.css";
import "emoji-mart/css/emoji-mart.css";

import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CloseIcon from "@material-ui/icons/Close";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { Picker } from "emoji-mart";
import firebase from "firebase";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { messaging } from "./firebase";
import db from "./firebase";
import { storage } from "./firebase";
import { useStateValue } from "./StateProvider";

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
  const [token, setToken] = useState("");
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  useEffect(() => {
    messaging
      .getToken()
      .then(async function () {
        setToken(await messaging.getToken());
        console.log(token);
      })
      .catch(function (err) {
        console.log("Unable to get permission to notify.", err);
      });
    navigator.serviceWorker.addEventListener("message", (message) =>
      console.log(message)
    );
  }, []);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "key=AAAAc1hdNAA:APA91bFZOOOjsa0DG2UL4RvdL1kXcq1OR1uQaMC5fQkLIxT_-3NeZ_KbFYvlTH7xtRNMfd2mVzVKr6l_fgq6TMgmtDZEXpCKbglS2aSbhikEojJ34HMcqzfFe_oj18B2Yb_1iekjiI3m"
  );

  const string = token;
  console.log(string);
  var body = "";
  if (messages.length > 0) {
    body = messages[messages.length - 1].message;
  } else {
    body = "No new Messages";
  }
  var raw = JSON.stringify({
    notification: {
      title: roomName,
      body: body,
    },
    priority: "HIGH",
    data: {},
    to: token,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  useEffect(() => {
    fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }, [requestOptions, messages.length]);

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
