import React, { useEffect, useRef, useState } from "react";
import {
  PencilIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";

import { useAuth } from "./hooks/useAuth";

import { LoginForm } from "./components/LoginForm";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";

export const App = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [activeTabTitle, setActiveTabTitle] = useState("");
  const [activeTabUrl, setActiveTabUrl] = useState("");
  const [userRecords, setUserRecords] = useState([]);

  const titleInputRef = useRef();

  const recordHasAlreadyBeenSaved = userRecords.some(
    (record) => record.url === activeTabUrl
  );

  const getSavedRecords = async () => {
    try {
      const { installType } = await chrome.management.getSelf();

      const url =
        installType === "development"
          ? "http://localhost:8080"
          : "https://archives.taytestokes.io";

      const response = await fetch(`${url}/api/v1/records/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUserRecords(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const getAndSetActiveTab = async () => {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const { title, url } = tabs[0];

      await setActiveTabTitle(title);
      await setActiveTabUrl(url);
    } catch (error) {
      setError(error.message);
    }
  };

  const saveRecord = async () => {
    setLoading(true);

    try {
      const { installType } = await chrome.management.getSelf();

      const url =
        installType === "development"
          ? "http://localhost:8080"
          : "https://archives.taytestokes.io";

      const response = await fetch(`${url}/api/v1/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: activeTabUrl,
          title: activeTabTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (error) {
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAndSetActiveTab();
  }, []);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (token) {
      getSavedRecords();
    }
  }, [token]);

  if (!token) return <LoginForm />;

  return (
    <Layout>
      {error && (
        <div className="flex items-center mt-4">
          <ExclamationCircleIcon className="h-4 w-4 text-red-400" />
          <p className="text-red-400 ml-2">{error}</p>
        </div>
      )}

      <div className="w-full mt-4 p-2 bg-zinc-800 rounded-md">
        <span className="rounded-md bg-zinc-700 px-2.5 py-0.5 text-white">
          URL
        </span>
        <p className="mt-2 break-words text-zinc-300">{activeTabUrl}</p>
      </div>

      <div className="w-full mt-4 p-2 bg-zinc-800 rounded-md">
        <div className="w-full flex items-center justify-between">
          <span className="rounded-md bg-zinc-700 px-2.5 py-0.5 text-white">
            Title
          </span>

          {!recordHasAlreadyBeenSaved && (
            <button
              className="border border-zinc-700 hover:bg-zinc-800 transition rounded-md p-1 ml-auto"
              onClick={() => {
                setIsEditingTitle(!isEditingTitle);
              }}
              aria-label={
                isEditingTitle
                  ? "Select to disbale title edit mode"
                  : "Select to enable title edit mode"
              }
            >
              {isEditingTitle ? (
                <XMarkIcon className="h-3 w-3 text-white" />
              ) : (
                <PencilIcon className="h-3 w-3 text-white" />
              )}
            </button>
          )}
        </div>
        <input
          type="text"
          className="w-full bg-zinc-800 mt-2 p-1 rounded-md focus:outline-none truncate font-semibold"
          value={activeTabTitle}
          onChange={(evt) => setActiveTabTitle(evt.target.value)}
          disabled={!isEditingTitle}
          ref={titleInputRef}
        />
      </div>

      {!recordHasAlreadyBeenSaved && (
        <button
          className={`w-full mt-4 rounded-md bg-transparent px-8 py-2 font-medium transition hover:bg-zinc-800 border border-zinc-700`}
          onClick={saveRecord}
          disabled={recordHasAlreadyBeenSaved}
        >
          {loading ? (
            <LoadingSpinner className="w-[18px] h-[18px] mx-auto" />
          ) : (
            "Archive"
          )}
        </button>
      )}
    </Layout>
  );
};
