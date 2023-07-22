import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import hljs from "highlight.js";
import React from "react";

export default function Ticket() {
  // Create a ref for the div element
  const textDivRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(() => "");
  const [result2, setResult2] = useState(() => "");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  // Add a click event listener to the copy icon that copies the text in the div to the clipboard when clicked
  useEffect(() => {

  }, []); // Run this only once


  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setSubmitted(true);
    const response = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message}),
    });
    const data = await response.json();
    console.log("data", data);
    console.log("data.result", data.result);

    let rawResult = data.result[0].b64_json;
    let rawResult2 = data.result[1].b64_json;
    console.log("rawResult");



    // set result to the highlighted code. Address this error: Argument of type 'string' is not assignable to parameter of type '(prevState: undefined) => undefined'.ts(2345)
    setResult(rawResult);
    setResult2(rawResult2);
    setSubmitted(true);
    setMessage("");
    setIsLoading(false);
    setSubmitted(false);
  }

  return (
      <div>
        <Head>
          <title>OpenAI API image generator</title>
          <meta name="description" content="" />
        </Head>

        <main
            className="flex flex-col
                    items-center justify-center m-20"
        >
          <h3 className="text-slate-900 text-xl mb-3">
            OpenAI API image generator
          </h3>

          {isLoading ? (
              <p>Loading... be patient.. may take 30s+</p>
          ) : <p>Enter your image description  below</p>}


          <form onSubmit={onSubmit}>

            <label>
              <input
                  className={`text-sm text-gray-base w-full
                              mr-3 py-5 px-4 h-2 border
                              border-gray-200 rounded mb-2 ${submitted && !message ? 'error' : ''}`}

                  type="text"
                  name="input"
                  placeholder="Enter a problem "
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
          {result ?
              <div>
              <div className="relative w-2/4 ">
                <img width="300" height="300" src={`data:image/png;base64, ${result}`} alt="Red dot" />
              </div>
              <br/>
            <div className="relative w-2/4 ">
            <img width="300" height="300" src={`data:image/png;base64, ${result2}`} alt="Red dot" />
      </div>
              </div>
              : '' }


          <br/>

        </main>
      </div>
  );
}


