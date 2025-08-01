import React from "react";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Login</h2>
        <form>
          <label>
            Username or email address <span>*</span>
            <input type="text" required />
          </label>
          <label>
            Password <span>*</span>
            <input type="password" required />
          </label>
          <div className="modal-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="modal-login-btn">Login</button>
        </form>
        <p className="modal-register">REGISTER NOW!</p>
      </div>
    </div>
  );
};

export default LoginModal;
