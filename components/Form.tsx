"use client";
import React from "react";
import { Loading } from "./Loading";
import Modal from "./Modal";

enum Status {
  ASKING_DOCUMENT = "asking_document",
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

type HistoryItem = {
  message: string;
  response?: string;
};

const Form = () => {
  const messageInput = React.useRef<HTMLTextAreaElement | null>(null);
  const scrollableDiv = React.useRef<HTMLDivElement | null>(null);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [status, setStatus] = React.useState<Status>(Status.ASKING_DOCUMENT);
  const [topic, setTopic] = React.useState<string>("");

  const handleEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement> &
      React.FormEvent<HTMLFormElement>
  ) => {
    if (e.key === "Enter" && status !== Status.LOADING) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(Status.LOADING);
    const message = messageInput.current?.value;
    scrollableDiv.current?.scrollTo(0, scrollableDiv.current.scrollHeight);
    messageInput.current!.value = "";
    if (!message) return;
    setHistory((prev) => [...prev, { message }]);

    const response = await fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history,
        message,
        topic,
      }),
    });

    if (!response.ok) {
      setStatus(Status.ERROR);
      scrollableDiv.current?.scrollTo(0, scrollableDiv.current.scrollHeight);
      return;
    }

    const data = await response.json();
    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1].response = data.response;
      return newHistory;
    });
    scrollableDiv.current?.scrollTo(0, scrollableDiv.current.scrollHeight);
    setStatus(Status.SUCCESS);
  };

  const handleReset = () => {
    localStorage.removeItem("response");
    setHistory([]);
    messageInput.current?.focus();
    setStatus(Status.ASKING_DOCUMENT);
  };

  const renderResponse = (item: HistoryItem) => {
    if (item.response) {
      return item.response;
    }
    if (status === Status.LOADING) {
      return <Loading />;
    } else if (status === Status.ERROR) {
      return "Error";
    }
  };

  const closeModal = (topic: string) => {
    setTopic(topic);
    setStatus(Status.IDLE);
  };

  return (
    <div className="flex items-center h-full flex-col">
      <Modal open={status === Status.ASKING_DOCUMENT} onClose={closeModal} />
      <div className="w-full flex justify-end p-4">
        <button
          onClick={handleReset}
          type="reset"
          className="p-4 rounded-md text-[#fab387] bg-gray-900"
        >
          Start a new session
        </button>
      </div>
      <div
        className="w-full mx-2 flex flex-col items-start gap-3 pt-6 pb-20 md:mx-auto md:max-w-[850px] h-full overflow-y-scroll"
        ref={scrollableDiv}
      >
        {history.map((item: HistoryItem, index: number) => {
          return (
            <React.Fragment key={index}>
              <div className="w-full">
                <div
                  className={`bg-blue-500 text-right float-right p-3 rounded-lg`}
                >
                  <div>{item.message}</div>
                </div>
              </div>
              <div className="w-full">
                <div
                  className={`bg-green-800 text-left float-left p-3 rounded-lg whitespace-pre-line`}
                >
                  <div>{renderResponse(item)}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full md:max-w-3xl rounded-md mb-4 flex space-x-4 text-[#fab387]"
      >
        <textarea
          placeholder="Ask to Malbec"
          ref={messageInput}
          onKeyDown={handleEnter}
          className="flex-grow placeholder:text-[#fab387] resize-none shadow-[0_0_10px_rgba(0,0,0,0.10)] bg-gray-900 outline-none pt-4 pl-4 rounded-md"
        />
        <button
          disabled={status === Status.LOADING}
          type="submit"
          className="h-full p-1 w-16 rounded-md flex items-center justify-center bg-gray-900"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 20 20"
            className="h-4 w-4 rotate-90"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Form;
