// components/apps/contact/Contact.jsx
import React, { useState } from "react";
import { Mail, Send, User, MessageSquare, Paperclip, X } from "lucide-react";
import { useThemeStore } from "../../../store";
import { Scanlines } from "../../effects/Scanlines";
import styles from "./Contact.module.scss";

const Contact = () => {
  // Get theme configuration
  const effectsEnabled = useThemeStore((state) => state.effectsEnabled);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error when user is typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "FROM: field is required";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "REPLY-TO: field is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = "SUBJECT: field is required";
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = "MESSAGE: field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file upload (attachment)
  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
    }));

    setAttachments([...attachments, ...newAttachments]);

    // Reset the input value so the same file can be selected again
    e.target.value = "";
  };

  // Remove an attachment
  const removeAttachment = (id) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate sending message
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after successful submission (after a delay for animation)
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
          setAttachments([]);
          setIsSubmitted(false);
        }, 3000);
      }, 2000);
    }
  };

  // Create new message (reset form)
  const handleNewMessage = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setAttachments([]);
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.emailHeader}>
        <div className={styles.emailTitle}>
          <Mail size={18} />
          <span>New Message</span>
        </div>

        <div className={styles.emailActions}>
          <button
            className={styles.newButton}
            onClick={handleNewMessage}
            title="New Message"
          >
            <Mail size={16} />
          </button>
          <button
            className={styles.sendButton}
            onClick={handleSubmit}
            disabled={isSubmitting || isSubmitted}
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.emailForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <User size={16} />
            <span>FROM:</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.name ? styles.error : ""}`}
            placeholder="Your Name"
            disabled={isSubmitting || isSubmitted}
          />
          {errors.name && (
            <div className={styles.errorMessage}>{errors.name}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <Mail size={16} />
            <span>REPLY-TO:</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.formInput} ${
              errors.email ? styles.error : ""
            }`}
            placeholder="your.email@example.com"
            disabled={isSubmitting || isSubmitted}
          />
          {errors.email && (
            <div className={styles.errorMessage}>{errors.email}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <MessageSquare size={16} />
            <span>SUBJECT:</span>
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`${styles.formInput} ${
              errors.subject ? styles.error : ""
            }`}
            placeholder="Message Subject"
            disabled={isSubmitting || isSubmitted}
          />
          {errors.subject && (
            <div className={styles.errorMessage}>{errors.subject}</div>
          )}
        </div>

        <div className={`${styles.formGroup} ${styles.messageGroup}`}>
          <label className={styles.formLabel}>
            <span>MESSAGE:</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`${styles.messageInput} ${
              errors.message ? styles.error : ""
            }`}
            placeholder="Type your message here..."
            rows={8}
            disabled={isSubmitting || isSubmitted}
          />
          {errors.message && (
            <div className={styles.errorMessage}>{errors.message}</div>
          )}
        </div>

        {/* Attachments section */}
        <div className={styles.attachmentsSection}>
          <div className={styles.attachmentsHeader}>
            <Paperclip size={16} />
            <span>ATTACHMENTS:</span>

            <label className={styles.attachButton}>
              Add File
              <input
                type="file"
                onChange={handleAttachment}
                style={{ display: "none" }}
                disabled={isSubmitting || isSubmitted}
              />
            </label>
          </div>

          <div className={styles.attachmentsList}>
            {attachments.length === 0 ? (
              <div className={styles.noAttachments}>No files attached</div>
            ) : (
              <div className={styles.attachments}>
                {attachments.map((attachment) => (
                  <div key={attachment.id} className={styles.attachment}>
                    <div className={styles.attachmentInfo}>
                      <Paperclip size={14} />
                      <span className={styles.attachmentName}>
                        {attachment.name}
                      </span>
                      <span className={styles.attachmentSize}>
                        {attachment.size}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.removeAttachment}
                      onClick={() => removeAttachment(attachment.id)}
                      disabled={isSubmitting || isSubmitted}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={`${styles.submitButton} ${
              isSubmitting ? styles.sending : ""
            } ${isSubmitted ? styles.sent : ""}`}
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitting
              ? "SENDING..."
              : isSubmitted
              ? "MESSAGE SENT"
              : "SEND MESSAGE"}
          </button>
        </div>
      </form>

      {/* Social links */}
      <div className={styles.socialLinks}>
        <h3>Connect with me:</h3>
        <div className={styles.socialButtons}>
          <a
            href="#"
            className={styles.socialButton}
            onClick={(e) => e.preventDefault()}
          >
            GitHub
          </a>
          <a
            href="#"
            className={styles.socialButton}
            onClick={(e) => e.preventDefault()}
          >
            LinkedIn
          </a>
          <a
            href="#"
            className={styles.socialButton}
            onClick={(e) => e.preventDefault()}
          >
            Twitter
          </a>
        </div>
      </div>

      {/* Email client footer */}
      <div className={styles.footer}>
        <div className={styles.statusBar}>
          <div className={styles.status}>
            {isSubmitting
              ? "Sending message..."
              : isSubmitted
              ? "Message sent successfully!"
              : "Ready"}
          </div>
          <div className={styles.clientInfo}>VaporMail v1.0</div>
        </div>
      </div>

      {/* Success animation overlay */}
      {isSubmitted && (
        <div className={styles.successOverlay}>
          <div className={styles.successAnimation}>
            <div className={styles.successIcon}>✓</div>
            <div className={styles.successMessage}>Message Sent!</div>
          </div>
        </div>
      )}

      {/* Scanlines effect if enabled */}
      {effectsEnabled?.scanlines && <Scanlines opacity={0.1} />}
    </div>
  );
};

export default Contact;
