import React, { useState } from 'react';

interface CopyProps {
  content: string
}

export default function ({ content }: CopyProps) {
  const [copied, setCopied] = useState(false)

  function copyRaw() {
    console.log('to import clipboard library');
    setCopied(true)
    window.setTimeout(() => {
      setCopied(false)
    }, 2000);
  }

  return (
    <div
      className="copy position-absolute"
      style={{ top: 0, right: 0 }}
    >
      <button
        name="copyRawButton"
        className={copied ? "d-none" : "btn btn-outline-secondary bg-light btn-sm m-2 d-block"}
        onClick={copyRaw}
      >
        <i className="far fa-clipboard fa-fw"></i>
      </button>
      <button
        className={copied ? "btn btn-outline-secondary bg-light btn-sm m-2 d-block" : "d-none"}
        onClick={copyRaw}
      >
        <i className="fa fa-check fa-fw text-success"></i>
      </button >
    </div >
  );
}