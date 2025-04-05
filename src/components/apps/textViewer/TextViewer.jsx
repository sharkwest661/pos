// components/apps/textViewer/TextViewer.jsx
import React, { useEffect } from "react";
import { useTextViewerStore } from "../../../store";
import styles from "./TextViewer.module.scss";

const TextViewer = ({ fileId }) => {
  // Fix: Use separate selectors to prevent infinite updates
  const files = useTextViewerStore((state) => state.files);
  const openFile = useTextViewerStore((state) => state.openFile);
  const currentFile = useTextViewerStore((state) => state.currentFile);

  // Open the specified file when component mounts
  useEffect(() => {
    if (fileId && files[fileId]) {
      openFile(fileId);
    }
  }, [fileId, openFile, files]);

  if (!currentFile) {
    return (
      <div className={styles.container}>
        <div className={styles.noFile}>
          <p>No file selected or file could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.fileName}>{currentFile.title}</h2>
        {currentFile.date && (
          <div className={styles.fileInfo}>
            Last modified: {new Date(currentFile.date).toLocaleString()}
          </div>
        )}
      </div>
      <div className={styles.content}>
        {currentFile.content.split("\n").map((paragraph, index) => {
          // Check if paragraph is a header (starts with # or ##)
          if (paragraph.startsWith("## ")) {
            return (
              <h3 key={index} className={styles.subheading}>
                {paragraph.replace("## ", "")}
              </h3>
            );
          } else if (paragraph.startsWith("# ")) {
            return (
              <h2 key={index} className={styles.heading}>
                {paragraph.replace("# ", "")}
              </h2>
            );
          } else if (paragraph.trim() === "") {
            return <br key={index} />;
          } else {
            return <p key={index}>{paragraph}</p>;
          }
        })}
      </div>
    </div>
  );
};

export default TextViewer;
