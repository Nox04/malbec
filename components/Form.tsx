"use client";
import React from "react";

enum Status {
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
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [status, setStatus] = React.useState<Status>(Status.IDLE);

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
    messageInput.current!.value = "";
    if (!message) return;
    setHistory((prev) => [...prev, { message }]);

    const response = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        history,
        message,
      }),
    });

    if (!response.ok) {
      setStatus(Status.ERROR);
      return;
    }

    const data = await response.json();
    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory[newHistory.length - 1].response = data.response;
      return newHistory;
    });
    setStatus(Status.SUCCESS);
  };

  const handleReset = () => {
    localStorage.removeItem("response");
    setHistory([]);
    messageInput.current?.focus();
  };

  const renderResponse = (item: HistoryItem) => {
    if (item.response) {
      return item.response;
    }
    if (status === Status.LOADING) {
      return "Thinking...";
    } else if (status === Status.ERROR) {
      return "Error";
    }
  };

  return (
    <div className="flex items-center h-full flex-col">
      <div className="w-full flex justify-end p-4">
        <button
          onClick={handleReset}
          type="reset"
          className="p-4 rounded-md text-gray-400 bg-gray-900"
        >
          Start a new session
        </button>
      </div>
      <div className="w-full mx-2 flex flex-col items-start gap-3 pt-6 last:mb-6 md:mx-auto md:max-w-3xl h-full">
        {history.map((item: HistoryItem) => {
          return (
            <>
              <div className="w-full">
                <div
                  className={`bg-blue-500 text-right float-right p-3 rounded-lg`}
                >
                  <p>{item.message}</p>
                </div>
              </div>
              <div className="w-full">
                <div
                  className={`bg-gray-500 text-left float-left p-3 rounded-lg`}
                >
                  <p>{renderResponse(item)}</p>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full md:max-w-3xl rounded-md mb-4 flex space-x-4"
      >
        <textarea
          placeholder="Ask to Malbec"
          ref={messageInput}
          onKeyDown={handleEnter}
          className="flex-grow resize-none shadow-[0_0_10px_rgba(0,0,0,0.10)] bg-gray-900 outline-none pt-4 pl-4 rounded-md"
        />
        <button
          disabled={status === Status.LOADING}
          type="submit"
          className="h-full p-1 w-16 rounded-md flex items-center justify-center text-gray-400 bg-gray-900"
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