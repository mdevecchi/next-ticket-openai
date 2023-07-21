import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import hljs from "highlight.js";
import React from "react";

export default function Ticket() {
  // Create a ref for the div element
  const textDivRef = useRef<HTMLDivElement>(null);
  const [productInput, setProductInput] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(() => "");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  // Add a click event listener to the copy icon that copies the text in the div to the clipboard when clicked
  useEffect(() => {
    const copyIcon = document.querySelector(".copy-icon");
    if (!copyIcon) return;
    copyIcon.addEventListener("click", () => {


      let text;
      if (textDivRef.current) {
        text = textDivRef.current.textContent;
      }

      // Create a hidden textarea element
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);

      // Select the text in the textarea
      textArea.select();

      // Copy the text to the clipboard
      document.execCommand("copy");

      // Remove the textarea element
      document.body.removeChild(textArea);
    });
  }, []); // Run this only once


  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setSubmitted(true);
    if (!nome || !cognome || !email || !productInput) {
      return;
    }
    const response = await fetch("/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product: productInput, nome: nome, cognome: cognome, email: email}),
    });
    const data = await response.json();
    console.log("data", data);
    console.log("data.result", data.result);

    let rawResult = data.result;

    console.log("rawResult");

    const hljsResult = hljs.highlightAuto(rawResult).value;

    // set result to the highlighted code. Address this error: Argument of type 'string' is not assignable to parameter of type '(prevState: undefined) => undefined'.ts(2345)
    setResult(hljsResult);
    setSubmitted(true);
    setProductInput("");
    setCognome("");
    setNome("");
    setIsLoading(false);
    setSubmitted(false);
  }

  return (
      <div>
        <Head>
          <title>OpenAI API Supporto clienti</title>
          <meta name="description" content="" />
        </Head>

        <main
            className="flex flex-col
                    items-center justify-center m-20"
        >
          <h3 className="text-slate-900 text-xl mb-3">
            OpenAI API Supporto clienti
          </h3>
          <p className="text-slate-700 text-lg mb-3">
            Open AI starter app
          </p>
          <form onSubmit={onSubmit}>
            <label>
              Nome:
              <input  className={`text-sm text-gray-base w-full
                              mr-3 py-5 px-4 h-2 border
                              border-gray-200 rounded mb-2 ${submitted && !nome ? 'error' : ''}`} type="text" value={nome} onChange={e => setNome(e.target.value)} />
            </label>
            <br />
            <label>
              Cognome:
              <input  className={`text-sm text-gray-base w-full
                              mr-3 py-5 px-4 h-2 border
                              border-gray-200 rounded mb-2 ${submitted && !cognome ? 'error' : ''}`} type="text" value={cognome} onChange={e => setCognome(e.target.value)} />
            </label>
            <label>
              Email:
              <input  className={`text-sm text-gray-base w-full
                              mr-3 py-5 px-4 h-2 border
                              border-gray-200 rounded mb-2 ${submitted && !email ? 'error' : ''}`} type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <br />
            <label>
              Problema:
              <input
                  className={`text-sm text-gray-base w-full
                              mr-3 py-5 px-4 h-2 border
                              border-gray-200 rounded mb-2 ${submitted && !productInput ? 'error' : ''}`}

                  type="text"
                  name="product"
                  placeholder="Enter a problem "
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
              />
            </label>

            <button
                className="text-sm w-full bg-fuchsia-600 h-7 text-white
                              rounded-2xl mb-10"
                type="submit"
            >
              Invia la richiesta
            </button>
          </form>
          {isLoading ? (
              <p>Loading... be patient.. may take 30s+</p>
          ) : result ? (
              <div className="relative w-2/4 ">
                <div
                    ref={textDivRef}
                    className="rounded-md border-spacing-2 border-slate-900 bg-slate-100 break-words max-w-500 overflow-x-auto  "
                >
              <pre className="">
                <code
                    className=""
                    dangerouslySetInnerHTML={{ __html: result }}
                />
              </pre>
                </div>
                <div className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer copy-icon">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-copy"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <rect x="8" y="8" width="12" height="12" rx="2"></rect>
                    <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
                  </svg>
                </div>
              </div>
          ) : null}
        </main>
      </div>
  );
}


